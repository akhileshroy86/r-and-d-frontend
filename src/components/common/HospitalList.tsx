'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { hospitalService } from '../../services/api/hospitalService';
import { doctorService } from '../../services/api/doctorService';
import { Hospital, Doctor } from '../../types/models';
import axios from 'axios';

const HospitalList: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [notes, setNotes] = useState('');
  const toast = React.useRef<Toast>(null);

  const timeSlots = [
    '09:00 AM - 09:30 AM', '09:30 AM - 10:00 AM', '10:00 AM - 10:30 AM',
    '10:30 AM - 11:00 AM', '11:00 AM - 11:30 AM', '11:30 AM - 12:00 PM',
    '02:00 PM - 02:30 PM', '02:30 PM - 03:00 PM', '03:00 PM - 03:30 PM',
    '03:30 PM - 04:00 PM', '04:00 PM - 04:30 PM', '04:30 PM - 05:00 PM'
  ];

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/hospitals');
      const data = await response.json();
      console.log('Hospital data:', data);
      
      // Format the raw data to match Hospital interface
      const formattedHospitals = data.map(hospital => ({
        id: hospital.id.toString(),
        name: hospital.name,
        address: `${hospital.city}, India`,
        phone: '+91 9876543210',
        email: `info@${hospital.name.toLowerCase().replace(/\s+/g, '')}.com`,
        rating: hospital.rating,
        status: 'open',
        departments: [],
        location: { latitude: 17.4065, longitude: 78.4772 },
        operatingHours: { open: '08:00', close: '22:00' }
      }));
      
      setHospitals(formattedHospitals);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    console.log('Fetching doctors...');
    setDoctorsLoading(true);
    try {
      const response = await fetch('http://localhost:3002/api/doctors');
      const data = await response.json();
      console.log('Doctors data:', data);
      setDoctors(data);
      setShowDoctors(true);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setDoctorsLoading(false);
    }
  };

  const bookAppointment = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientId: 'temp_patient_id',
          doctorId: selectedDoctor.id,
          date: selectedDate.toISOString(),
          timeRange: selectedTimeSlot,
          notes: notes,
          duration: 30
        })
      });

      const data = await response.json();
      console.log('Booking response:', data);
      
      if (response.ok && data.success) {
        alert(`Appointment booked successfully! ID: ${data.appointment.id}`);
        setShowBooking(false);
        setSelectedDoctor(null);
        setSelectedDate(null);
        setSelectedTimeSlot('');
        setNotes('');
      } else {
        alert(`Error: ${data.message || 'Failed to book appointment'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to book appointment');
    }
  };

  const statusBodyTemplate = (rowData: Hospital) => {
    return (
      <Tag 
        value={rowData.status} 
        severity={rowData.status === 'open' ? 'success' : 'danger'} 
      />
    );
  };

  const ratingBodyTemplate = (rowData: Hospital) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  };

  const actionBodyTemplate = () => {
    return (
      <Button 
        label="Book Appointment" 
        icon="pi pi-calendar" 
        onClick={fetchDoctors}
        loading={doctorsLoading}
        size="small"
      />
    );
  };

  return (
    <>
      <Card title="All Hospitals" className="m-4">
        <DataTable 
          value={hospitals} 
          loading={loading}
          paginator 
          rows={10}
          responsiveLayout="scroll"
        >
          <Column field="name" header="Hospital Name" sortable />
          <Column field="address" header="Address" />
          <Column field="phone" header="Phone" />
          <Column field="email" header="Email" />
          <Column field="rating" header="Rating" body={ratingBodyTemplate} sortable />
          <Column field="status" header="Status" body={statusBodyTemplate} sortable />
          <Column field="operatingHours.open" header="Opens At" />
          <Column field="operatingHours.close" header="Closes At" />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
      </Card>

      <Dialog 
        header="Available Doctors" 
        visible={showDoctors} 
        onHide={() => setShowDoctors(false)}
        style={{ width: '80vw' }}
        maximizable
      >
        <DataTable 
          value={doctors} 
          loading={doctorsLoading}
          paginator 
          rows={10}
          responsiveLayout="scroll"
        >
          <Column field="name" header="Doctor Name" sortable />
          <Column field="specialization" header="Specialization" sortable />
          <Column field="rating" header="Rating" body={(rowData) => <Rating value={rowData.rating} readOnly cancel={false} />} sortable />
          <Column field="consultationFee" header="Fee (₹)" sortable />
          <Column header="Action" body={(rowData) => (
            <Button 
              label="Book" 
              size="small" 
              onClick={() => {
                setSelectedDoctor(rowData);
                setShowDoctors(false);
                setShowBooking(true);
              }}
            />
          )} />
        </DataTable>
      </Dialog>

      <Dialog 
        header={`Book Appointment - ${selectedDoctor?.name}`}
        visible={showBooking} 
        onHide={() => setShowBooking(false)}
        style={{ width: '50vw' }}
      >
        <div className="p-fluid">
          <div className="field">
            <label>Select Date</label>
            <Calendar 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.value)} 
              minDate={new Date()}
              showIcon 
            />
          </div>
          
          <div className="field">
            <label>Select Time Slot</label>
            <Dropdown 
              value={selectedTimeSlot} 
              options={timeSlots.map(slot => ({ label: slot, value: slot }))} 
              onChange={(e) => setSelectedTimeSlot(e.value)} 
              placeholder="Choose time slot"
            />
          </div>
          
          <div className="field">
            <label>Notes (Optional)</label>
            <InputTextarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              rows={3}
              placeholder="Any symptoms or notes..."
            />
          </div>
          
          <div className="field">
            <Button 
              label="TEST BUTTON" 
              onClick={() => alert('Test button clicked!')}
              className="p-button-warning mb-2"
            />
            <Button 
              label="Book Appointment" 
              onClick={() => {
                alert('Button clicked!');
                bookAppointment();
              }}
              className="p-button-success"
            />
          </div>
        </div>
      </Dialog>
      
      <Toast ref={toast} />
    </>
  );
};

export default HospitalList;