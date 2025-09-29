'use client';

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const StaffDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [walkInDialog, setWalkInDialog] = useState(false);
  const [walkInData, setWalkInData] = useState({
    patientName: '',
    phone: '',
    doctorId: '',
    paymentMethod: 'cash'
  });

  const pendingAppointments = [
    {
      id: '1',
      patientName: 'John Doe',
      phone: '+91 9876543210',
      doctorName: 'Dr. Smith',
      time: '10:00 AM',
      status: 'pending',
      paymentStatus: 'paid'
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      phone: '+91 9876543211',
      doctorName: 'Dr. Johnson',
      time: '11:30 AM',
      status: 'confirmed',
      paymentStatus: 'pending'
    }
  ];

  const queueData = [
    {
      doctorName: 'Dr. Smith',
      currentPatient: 'John Doe',
      waitingCount: 3,
      avgWaitTime: '15 min'
    },
    {
      doctorName: 'Dr. Johnson',
      currentPatient: 'Jane Smith',
      waitingCount: 2,
      avgWaitTime: '20 min'
    }
  ];

  const drawerStats = {
    totalCash: 15000,
    totalOnline: 28000,
    totalPatients: 45,
    pendingPayments: 3
  };

  const doctors = [
    { label: 'Dr. Smith - Cardiology', value: 'dr1' },
    { label: 'Dr. Johnson - Orthopedics', value: 'dr2' }
  ];

  const statusBodyTemplate = (rowData: any) => {
    const getSeverity = (status: string) => {
      switch (status) {
        case 'confirmed': return 'success';
        case 'pending': return 'warning';
        default: return 'secondary';
      }
    };
    return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
  };

  const paymentStatusBodyTemplate = (rowData: any) => {
    const getSeverity = (status: string) => {
      return status === 'paid' ? 'success' : 'danger';
    };
    return <Tag value={rowData.paymentStatus} severity={getSeverity(rowData.paymentStatus)} />;
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <Button label="Accept" icon="pi pi-check" size="small" severity="success" />
        <Button label="Reject" icon="pi pi-times" size="small" severity="danger" />
        <Button icon="pi pi-eye" size="small" outlined />
      </div>
    );
  };

  const handleWalkInSubmit = () => {
    console.log('Walk-in patient:', walkInData);
    setWalkInDialog(false);
    setWalkInData({ patientName: '', phone: '', doctorId: '', paymentMethod: 'cash' });
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1>Staff Dashboard</h1>
        <p className="text-600">Welcome, {user?.name}! Manage appointments and patient flow.</p>
      </div>

      {/* Drawer Stats */}
      <div className="grid mb-4">
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-green-100">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-green-600 font-medium mb-1">Cash Collected</div>
                <div className="text-3xl font-bold text-green-900">₹{drawerStats.totalCash.toLocaleString()}</div>
              </div>
              <i className="pi pi-money-bill text-green-500 text-4xl"></i>
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-blue-100">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-blue-600 font-medium mb-1">Online Payments</div>
                <div className="text-3xl font-bold text-blue-900">₹{drawerStats.totalOnline.toLocaleString()}</div>
              </div>
              <i className="pi pi-credit-card text-blue-500 text-4xl"></i>
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-orange-100">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-orange-600 font-medium mb-1">Patients Served</div>
                <div className="text-3xl font-bold text-orange-900">{drawerStats.totalPatients}</div>
              </div>
              <i className="pi pi-users text-orange-500 text-4xl"></i>
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-red-100">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-red-600 font-medium mb-1">Pending Payments</div>
                <div className="text-3xl font-bold text-red-900">{drawerStats.pendingPayments}</div>
              </div>
              <i className="pi pi-exclamation-triangle text-red-500 text-4xl"></i>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-4">
        <Button 
          label="Add Walk-in Patient" 
          icon="pi pi-user-plus" 
          onClick={() => setWalkInDialog(true)}
        />
        <Button label="Search Patient" icon="pi pi-search" outlined />
        <Button label="Generate Report" icon="pi pi-file-pdf" outlined />
      </div>

      <div className="grid">
        {/* Pending Appointments */}
        <div className="col-12 lg:col-8">
          <Card title="Pending Appointments">
            <DataTable value={pendingAppointments} responsiveLayout="scroll">
              <Column field="patientName" header="Patient" />
              <Column field="phone" header="Phone" />
              <Column field="doctorName" header="Doctor" />
              <Column field="time" header="Time" />
              <Column field="status" header="Status" body={statusBodyTemplate} />
              <Column field="paymentStatus" header="Payment" body={paymentStatusBodyTemplate} />
              <Column header="Actions" body={actionBodyTemplate} />
            </DataTable>
          </Card>
        </div>

        {/* Queue Status */}
        <div className="col-12 lg:col-4">
          <Card title="Real-time Queue">
            <div className="flex flex-column gap-3">
              {queueData.map((queue, index) => (
                <div key={index} className="p-3 border-round surface-100">
                  <div className="font-medium mb-2">{queue.doctorName}</div>
                  <div className="text-sm text-600 mb-1">Current: {queue.currentPatient}</div>
                  <div className="flex justify-content-between">
                    <span className="text-sm">Waiting: {queue.waitingCount}</span>
                    <span className="text-sm">Avg: {queue.avgWaitTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Walk-in Patient Dialog */}
      <Dialog
        header="Add Walk-in Patient"
        visible={walkInDialog}
        style={{ width: '450px' }}
        onHide={() => setWalkInDialog(false)}
      >
        <div className="flex flex-column gap-3">
          <div>
            <label htmlFor="patientName" className="block mb-2">Patient Name</label>
            <InputText
              id="patientName"
              value={walkInData.patientName}
              onChange={(e) => setWalkInData({ ...walkInData, patientName: e.target.value })}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-2">Phone Number</label>
            <InputText
              id="phone"
              value={walkInData.phone}
              onChange={(e) => setWalkInData({ ...walkInData, phone: e.target.value })}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="doctor" className="block mb-2">Select Doctor</label>
            <Dropdown
              id="doctor"
              value={walkInData.doctorId}
              options={doctors}
              onChange={(e) => setWalkInData({ ...walkInData, doctorId: e.value })}
              placeholder="Select a doctor"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="payment" className="block mb-2">Payment Method</label>
            <Dropdown
              id="payment"
              value={walkInData.paymentMethod}
              options={[
                { label: 'Cash', value: 'cash' },
                { label: 'UPI', value: 'upi' }
              ]}
              onChange={(e) => setWalkInData({ ...walkInData, paymentMethod: e.value })}
              className="w-full"
            />
          </div>
          <div className="flex justify-content-end gap-2 mt-3">
            <Button label="Cancel" outlined onClick={() => setWalkInDialog(false)} />
            <Button label="Add Patient" onClick={handleWalkInSubmit} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default StaffDashboard;