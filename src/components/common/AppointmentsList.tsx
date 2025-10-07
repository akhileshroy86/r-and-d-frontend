'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Doctor, Appointment } from '../../types/models';
import { appointmentService } from '../../services/api/appointmentService';

interface EnrichedAppointment extends Appointment {
  doctorName?: string;
  specialization?: string;
  consultationFee?: number;
}

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<EnrichedAppointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDoctors = async () => {
    try {
      const data = await appointmentService.getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    }
  };

  const fetchAppointments = async () => {
    console.log('Fetching appointments...');
    setLoading(true);
    try {
      const appointmentsData = await appointmentService.getAppointments();
      console.log('Appointments data:', appointmentsData);
      
      // Enrich appointments with doctor details
      const enrichedAppointments: EnrichedAppointment[] = appointmentsData.map((appointment: any) => {
        const doctor = doctors.find(doc => doc.id === appointment.doctorId);
        return {
          ...appointment,
          doctorName: doctor?.name || 'Unknown Doctor',
          specialization: doctor?.specialization || 'N/A',
          consultationFee: doctor?.consultationFee || 0
        };
      });
      
      setAppointments(enrichedAppointments);
      console.log('Enriched appointments:', enrichedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      console.log('Finished fetching appointments');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (doctors.length > 0) {
      fetchAppointments();
    }
  }, [doctors]);

  return (
    <div className="p-4">
      <Card title="My Appointments">
        <Button 
          label="Refresh" 
          onClick={fetchAppointments} 
          className="mb-3"
          loading={loading}
        />
        
        <DataTable 
          value={appointments} 
          loading={loading}
          emptyMessage="No appointments found"
        >
          <Column field="id" header="Appointment ID" />
          <Column field="doctorName" header="Doctor" />
          <Column field="specialization" header="Specialization" />
          <Column 
            field="date" 
            header="Date" 
            body={(rowData) => new Date(rowData.date).toLocaleDateString()}
          />
          <Column field="timeRange" header="Time" />
          <Column field="status" header="Status" />
          <Column 
            field="consultationFee" 
            header="Fee (₹)" 
            body={(rowData) => `₹${rowData.consultationFee}`}
          />
          <Column field="notes" header="Notes" />
        </DataTable>
      </Card>
    </div>
  );
};

export default AppointmentsList;