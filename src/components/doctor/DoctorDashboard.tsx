'use client';

import React, { useEffect } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Rating } from 'primereact/rating';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

const DoctorDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const todayAppointments = [
    {
      id: '1',
      patientName: 'John Doe',
      time: '10:00 AM - 11:00 AM',
      status: 'waiting',
      queuePosition: 1,
      symptoms: 'Chest pain, shortness of breath'
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      time: '11:00 AM - 12:00 PM',
      status: 'in-consultation',
      queuePosition: 0,
      symptoms: 'Regular checkup'
    },
    {
      id: '3',
      patientName: 'Mike Wilson',
      time: '2:00 PM - 3:00 PM',
      status: 'scheduled',
      queuePosition: 3,
      symptoms: 'Follow-up visit'
    }
  ];

  const stats = {
    todayPatients: 8,
    completedToday: 3,
    avgConsultationTime: 25,
    rating: 4.8,
    totalReviews: 156
  };

  const statusBodyTemplate = (rowData: any) => {
    const getSeverity = (status: string) => {
      switch (status) {
        case 'waiting': return 'warning';
        case 'in-consultation': return 'info';
        case 'completed': return 'success';
        default: return 'secondary';
      }
    };
    return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        {rowData.status === 'waiting' && (
          <Button label="Call Next" icon="pi pi-arrow-right" size="small" />
        )}
        {rowData.status === 'in-consultation' && (
          <Button label="Complete" icon="pi pi-check" size="small" severity="success" />
        )}
        <Button icon="pi pi-eye" size="small" outlined />
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-content-between align-items-center">
        <div>
          <h1>Good morning, Dr. {user?.name}!</h1>
          <p className="text-600">You have {stats.todayPatients} appointments scheduled for today.</p>
        </div>
        <Button 
          label="Logout" 
          icon="pi pi-sign-out" 
          severity="secondary" 
          outlined 
          onClick={handleLogout}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid mb-4">
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-blue-100">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-blue-600 font-medium mb-1">Today's Patients</div>
                <div className="text-3xl font-bold text-blue-900">{stats.todayPatients}</div>
              </div>
              <i className="pi pi-users text-blue-500 text-4xl"></i>
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-green-100">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-green-600 font-medium mb-1">Completed</div>
                <div className="text-3xl font-bold text-green-900">{stats.completedToday}</div>
              </div>
              <i className="pi pi-check-circle text-green-500 text-4xl"></i>
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-orange-100">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-orange-600 font-medium mb-1">Avg Time (min)</div>
                <div className="text-3xl font-bold text-orange-900">{stats.avgConsultationTime}</div>
              </div>
              <i className="pi pi-clock text-orange-500 text-4xl"></i>
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-purple-100">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-purple-600 font-medium mb-1">Rating</div>
                <div className="flex align-items-center">
                  <Rating value={stats.rating} readOnly cancel={false} className="mr-2" />
                  <span className="text-purple-900 font-bold">({stats.totalReviews})</span>
                </div>
              </div>
              <i className="pi pi-star text-purple-500 text-4xl"></i>
            </div>
          </Card>
        </div>
      </div>

      {/* Today's Queue */}
      <Card title="Today's Appointment Queue" className="mb-4">
        <DataTable value={todayAppointments} responsiveLayout="scroll">
          <Column field="queuePosition" header="Queue #" />
          <Column field="patientName" header="Patient" />
          <Column field="time" header="Time Slot" />
          <Column field="symptoms" header="Symptoms" />
          <Column field="status" header="Status" body={statusBodyTemplate} />
          <Column header="Actions" body={actionBodyTemplate} />
        </DataTable>
      </Card>

      {/* Quick Actions */}
      <div className="grid">
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="text-center cursor-pointer hover:shadow-3">
            <i className="pi pi-calendar text-4xl text-blue-500 mb-3"></i>
            <h4>View Schedule</h4>
            <p className="text-600">Check upcoming appointments</p>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="text-center cursor-pointer hover:shadow-3">
            <i className="pi pi-file-medical text-4xl text-green-500 mb-3"></i>
            <h4>Patient Records</h4>
            <p className="text-600">Access medical histories</p>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="text-center cursor-pointer hover:shadow-3">
            <i className="pi pi-star text-4xl text-orange-500 mb-3"></i>
            <h4>My Reviews</h4>
            <p className="text-600">View patient feedback</p>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="text-center cursor-pointer hover:shadow-3">
            <i className="pi pi-chart-line text-4xl text-purple-500 mb-3"></i>
            <h4>Analytics</h4>
            <p className="text-600">View practice insights</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;