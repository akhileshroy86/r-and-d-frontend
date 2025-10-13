'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { appointmentService } from '../../services/api/appointmentService';
import { Appointment, Doctor } from '../../types/models';

interface AppointmentDisplay {
  id: string;
  patientName: string;
  patientPhone: string;
  department: string;
  doctorName: string;
  timeRange: string;
  queuePosition: number;
  status: 'waiting' | 'being-called' | 'completed' | 'cancelled';
  eta: string;
}

const AppointmentsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentQueue, setCurrentQueue] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');

  const departments = [
    { label: 'All Departments', value: 'all' },
    { label: 'Cardiology', value: 'cardiology' },
    { label: 'Neurology', value: 'neurology' },
    { label: 'Orthopedics', value: 'orthopedics' }
  ];

  const [doctorFilterOptions, setDoctorFilterOptions] = useState([
    { label: 'All Doctors', value: 'all' }
  ]);

  const statuses = [
    { label: 'All Status', value: 'all' },
    { label: 'Waiting', value: 'waiting' },
    { label: 'Being Called', value: 'being-called' },
    { label: 'Completed', value: 'completed' }
  ];

  const payments = [
    { label: 'All Payments', value: 'all' },
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'pending' },
    { label: 'Partial', value: 'partial' }
  ];

  const [appointments, setAppointments] = useState<AppointmentDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorData = await appointmentService.getDoctors();
        setDoctors(doctorData);
        if (doctorData.length > 0 && !selectedDoctorId) {
          setSelectedDoctorId(doctorData[0].id);
          setCurrentQueue(`${doctorData[0].name} - ${doctorData[0].specialization}`);
        }
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        
        // Get all appointments from API and localStorage
        let allAppointments = [];
        
        try {
          const apiData = await appointmentService.getAppointments();
          allAppointments = [...allAppointments, ...apiData];
        } catch (error) {
          console.log('API not available, using localStorage only');
        }
        
        // Get all user appointments from localStorage
        const allUsers = ['patient_1', 'patient_2', 'patient_3']; // Mock user IDs
        allUsers.forEach(userId => {
          const stored = localStorage.getItem(`userAppointments_${userId}`);
          if (stored) {
            try {
              const userAppointments = JSON.parse(stored);
              allAppointments = [...allAppointments, ...userAppointments];
            } catch (e) {
              console.error('Error parsing appointments for user:', userId);
            }
          }
        });
        
        // Remove duplicates
        const uniqueAppointments = allAppointments.filter((apt, index, self) => 
          index === self.findIndex(a => a.id === apt.id)
        );
        
        // Filter by date based on active tab
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        
        let filteredByDate = uniqueAppointments;
        
        if (activeTab === 'today') {
          filteredByDate = uniqueAppointments.filter(apt => {
            const aptDate = new Date(apt.date);
            const aptDay = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate());
            return aptDay.getTime() === today.getTime();
          });
        } else if (activeTab === 'upcoming') {
          filteredByDate = uniqueAppointments.filter(apt => {
            const aptDate = new Date(apt.date);
            const aptDay = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate());
            return aptDay.getTime() >= tomorrow.getTime();
          });
        } else if (activeTab === 'past') {
          filteredByDate = uniqueAppointments.filter(apt => {
            const aptDate = new Date(apt.date);
            const aptDay = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate());
            return aptDay.getTime() < today.getTime();
          });
        }
        
        // Sort appointments by date
        filteredByDate.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // Convert to display format first
        const displayData: AppointmentDisplay[] = filteredByDate.map((apt, index) => {
          // Try multiple ways to get doctor name from different data structures
          let doctorName = 'Dr. Unknown';
          
          if (apt.doctor?.name) {
            doctorName = apt.doctor.name;
          } else if (apt.doctor?.firstName || apt.doctor?.lastName) {
            doctorName = `${apt.doctor.firstName || ''} ${apt.doctor.lastName || ''}`.trim();
          } else if (apt.doctorName) {
            doctorName = apt.doctorName;
          } else if (apt.doctorId) {
            // Try to find doctor from the doctors list
            const doctor = doctors.find(d => d.id === apt.doctorId);
            if (doctor) {
              doctorName = `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim() || doctor.name || 'Dr. Unknown';
            }
          }
          
          // Ensure it starts with "Dr." if it doesn't already
          if (doctorName && !doctorName.startsWith('Dr.')) {
            doctorName = `Dr. ${doctorName}`;
          }
          
          return {
            id: apt.id,
            patientName: `Patient ${index + 1}`,
            patientPhone: '+91 9876543210',
            department: apt.specialization || 'General',
            doctorName,
            timeRange: apt.timeRange || '10:00 AM - 11:00 AM',
            queuePosition: index + 1,
            status: apt.status === 'confirmed' ? 'waiting' : 
                   apt.status === 'in-progress' ? 'being-called' : 
                   apt.status === 'completed' ? 'completed' : 'waiting',
            eta: `${(index + 1) * 15} mins`
          };
        });
        
        // Apply filters to display data
        let filteredDisplayData = displayData;
        
        // Filter by selected doctor if not 'all'
        if (selectedDoctor !== 'all') {
          filteredDisplayData = filteredDisplayData.filter(apt => 
            apt.doctorName === selectedDoctor
          );
        }
        
        // Filter by department if not 'all'
        if (selectedDepartment !== 'all') {
          filteredDisplayData = filteredDisplayData.filter(apt => 
            apt.department.toLowerCase().includes(selectedDepartment.toLowerCase())
          );
        }
        
        // Filter by status if not 'all'
        if (selectedStatus !== 'all') {
          filteredDisplayData = filteredDisplayData.filter(apt => 
            apt.status === selectedStatus
          );
        }
        
        setAppointments(filteredDisplayData);
        
        // Update doctor filter options based on all appointments (before filtering)
        const uniqueDoctors = [...new Set(displayData.map(apt => apt.doctorName))]
          .filter(name => name && name !== 'Dr. Unknown')
          .sort();
        
        const doctorOptions = [
          { label: 'All Doctors', value: 'all' },
          ...uniqueDoctors.map(doctorName => ({
            label: doctorName,
            value: doctorName
          }))
        ];
        
        setDoctorFilterOptions(doctorOptions);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, [activeTab, selectedDoctor, selectedDepartment, selectedStatus]);

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case 'being-called': return 'success';
      case 'waiting': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'being-called': return 'Being Called';
      case 'waiting': return 'Waiting';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const headerTemplate = () => (
    <div className="flex align-items-center justify-content-between">
      <div className="flex align-items-center gap-2" style={{ paddingLeft: '24px', paddingTop: '12px' }}>
        <h3 className="m-0 text-900">Appointments & Queues</h3>
        <div className="flex align-items-center gap-1">
          <span className="w-0.5rem h-0.5rem border-circle bg-green-500"></span>
          <span className="text-sm text-600">(Live)</span>
        </div>
      </div>
      <Button 
        icon="pi pi-refresh" 
        className="p-button-text p-button-rounded" 
        tooltip="Refresh"
      />
    </div>
  );

  return (
    <Card header={headerTemplate} className="h-full">
      {/* Tab Navigation */}
      <div className="flex gap-1 mb-4 bg-gray-50 p-1 border-round">
        <Button
          label="Today"
          className={`flex-1 ${activeTab === 'today' ? 'bg-white shadow-1 text-900 border-blue-500' : 'bg-transparent text-600 border-transparent'}`}
          onClick={() => setActiveTab('today')}
        />
        <Button
          label="Upcoming"
          className={`flex-1 ${activeTab === 'upcoming' ? 'bg-white shadow-1 text-900 border-blue-500' : 'bg-transparent text-600 border-transparent'}`}
          onClick={() => setActiveTab('upcoming')}
        />
        <Button
          label="Past"
          className={`flex-1 ${activeTab === 'past' ? 'bg-white shadow-1 text-900 border-blue-500' : 'bg-transparent text-600 border-transparent'}`}
          onClick={() => setActiveTab('past')}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-3">
        <Dropdown
          value={selectedDepartment}
          options={departments}
          onChange={(e) => setSelectedDepartment(e.value)}
          className="flex-1"
        />
        <Dropdown
          value={selectedDoctor}
          options={doctorFilterOptions}
          onChange={(e) => setSelectedDoctor(e.value)}
          className="flex-1"
        />
        <Dropdown
          value={selectedStatus}
          options={statuses}
          onChange={(e) => setSelectedStatus(e.value)}
          className="flex-1"
        />
        <Dropdown
          value={selectedPayment}
          options={payments}
          onChange={(e) => setSelectedPayment(e.value)}
          className="flex-1"
        />
      </div>

      {/* Search */}
      <div className="mb-3">
        <span className="p-input-icon-left w-full">
          <i className="pi pi-search" />
          <InputText
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by mobile or Booking ID"
            className="w-full text-sm"
          />
        </span>
      </div>

      {/* Current Queue Status */}
      <div className="bg-blue-50 p-2 border-round mb-3">
        <div className="flex align-items-center justify-content-between">
          <div className="flex align-items-center">
            <span className="text-xs text-600">Queue Status:</span>
            <Dropdown
              value={currentQueue}
              options={doctors.map(doctor => ({
                label: `${doctor.name} - ${doctor.specialization}`,
                value: `${doctor.name} - ${doctor.specialization}`
              }))}
              onChange={(e) => {
                setCurrentQueue(e.value);
                const selectedDoctor = doctors.find(d => `${d.name} - ${d.specialization}` === e.value);
                if (selectedDoctor) {
                  setSelectedDoctorId(selectedDoctor.id);
                }
              }}
              className="ml-2 text-sm"
            />
          </div>
          <div className="flex align-items-center gap-3">
            <div className="text-center">
              <div className="text-sm font-bold text-blue-600">Position #3</div>
              <div className="text-xs text-600">Current</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-green-600">Priya Sharma</div>
              <div className="text-xs text-600">Being Called</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-orange-600">15 mins</div>
              <div className="text-xs text-600">ETA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table Header */}
      <div className="flex bg-gray-50 p-2 border-round mb-2 font-semibold text-xs text-600">
        <div style={{ width: '15%', minWidth: '80px' }}>BOOKING ID</div>
        <div style={{ width: '25%', minWidth: '120px' }}>PATIENT</div>
        <div style={{ width: '30%', minWidth: '150px' }}>DEPARTMENT → DOCTOR</div>
        <div style={{ width: '15%', minWidth: '80px' }}>TIME RANGE</div>
        <div style={{ width: '15%', minWidth: '80px' }}>QUEUE STATUS</div>
      </div>

      {/* Appointments List */}
      <div className="flex flex-column gap-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {loading ? (
          <div className="text-center p-4">
            <i className="pi pi-spin pi-spinner text-2xl text-primary"></i>
            <p className="text-sm text-600 mt-2">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-sm text-600">No appointments found</p>
          </div>
        ) : (
          appointments.map((appointment) => (
          <div key={appointment.id} className="flex align-items-center p-2 border-round hover:bg-gray-50 transition-colors transition-duration-150">
            <div style={{ width: '15%', minWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span className="text-blue-600 font-medium text-sm">{appointment.id}</span>
            </div>
            <div style={{ width: '25%', minWidth: '120px', overflow: 'hidden' }}>
              <div className="font-medium text-900 text-sm" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{appointment.patientName}</div>
              <div className="text-xs text-600" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{appointment.patientPhone}</div>
            </div>
            <div style={{ width: '30%', minWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <div className="text-900 text-sm">{appointment.department} → {appointment.doctorName}</div>
            </div>
            <div style={{ width: '15%', minWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <div className="text-900 text-xs">{appointment.timeRange}</div>
            </div>
            <div style={{ width: '15%', minWidth: '80px', overflow: 'hidden' }}>
              <div className="flex flex-column gap-1">
                <span className="font-medium text-xs">#{appointment.queuePosition}</span>
                <Tag 
                  value={getStatusLabel(appointment.status)}
                  severity={getStatusSeverity(appointment.status)}
                  className="text-xs"
                  style={{ fontSize: '10px', padding: '2px 4px' }}
                />
                <span className="text-xs text-600">{appointment.eta}</span>
              </div>
            </div>
          </div>
        ))
        )}
      </div>
    </Card>
  );
};

export default AppointmentsSection;