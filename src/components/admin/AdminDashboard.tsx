'use client';

import React, { useEffect } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const AdminDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Mock data - replace with actual data from Redux store
  const stats = {
    totalDoctors: 25,
    totalStaff: 15,
    totalPatients: 1250,
    todayAppointments: 45,
    todayRevenue: 35000,
    monthlyRevenue: 850000,
    onlinePayments: 28000,
    offlinePayments: 7000
  };

  const recentAppointments = [
    {
      id: '1',
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
      time: '10:00 AM',
      status: 'completed',
      amount: 800
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      doctorName: 'Dr. Johnson',
      time: '11:30 AM',
      status: 'in-progress',
      amount: 600
    },
    {
      id: '3',
      patientName: 'Mike Wilson',
      doctorName: 'Dr. Brown',
      time: '2:00 PM',
      status: 'scheduled',
      amount: 750
    }
  ];

  const topDepartments = [
    { name: 'Cardiology', revenue: 125000, patients: 85 },
    { name: 'Orthopedics', revenue: 98000, patients: 72 },
    { name: 'Neurology', revenue: 87000, patients: 58 }
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [65000, 59000, 80000, 81000, 56000, 85000],
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.4
      },
      {
        label: 'Appointments',
        data: [280, 248, 340, 390, 200, 380],
        fill: false,
        borderColor: '#FFA726',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  };

  const statusBodyTemplate = (rowData: any) => {
    const getSeverity = (status: string) => {
      switch (status) {
        case 'completed': return 'success';
        case 'in-progress': return 'warning';
        case 'scheduled': return 'info';
        default: return 'secondary';
      }
    };

    return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
  };

  const amountBodyTemplate = (rowData: any) => {
    return `₹${rowData.amount}`;
  };

  return (
    <div className="p-4">
      {/* Welcome Section */}
      <div className="mb-4">
        <h1>Welcome back, {user?.name}!</h1>
        <p className="text-600">Here's what's happening at your hospital today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid mb-4">
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-blue-100">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-blue-600 font-medium mb-1">Total Doctors</div>
                <div className="text-3xl font-bold text-blue-900">{stats.totalDoctors}</div>
              </div>
              <i className="pi pi-users text-blue-500 text-4xl"></i>
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-green-100">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-green-600 font-medium mb-1">Today's Revenue</div>
                <div className="text-3xl font-bold text-green-900">₹{stats.todayRevenue.toLocaleString()}</div>
              </div>
              <i className="pi pi-dollar text-green-500 text-4xl"></i>
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-orange-100">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-orange-600 font-medium mb-1">Today's Appointments</div>
                <div className="text-3xl font-bold text-orange-900">{stats.todayAppointments}</div>
              </div>
              <i className="pi pi-calendar text-orange-500 text-4xl"></i>
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-purple-100">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-purple-600 font-medium mb-1">Total Patients</div>
                <div className="text-3xl font-bold text-purple-900">{stats.totalPatients}</div>
              </div>
              <i className="pi pi-heart text-purple-500 text-4xl"></i>
            </div>
          </Card>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid">
        <div className="col-12 lg:col-8">
          <Card title="Revenue & Appointments Trend">
            <Chart type="line" data={chartData} options={chartOptions} height="300px" />
          </Card>
        </div>
        <div className="col-12 lg:col-4">
          <Card title="Top Departments">
            <div className="flex flex-column gap-3">
              {topDepartments.map((dept, index) => (
                <div key={index} className="flex justify-content-between align-items-center p-2 border-round surface-100">
                  <div>
                    <div className="font-medium">{dept.name}</div>
                    <div className="text-sm text-600">{dept.patients} patients</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{dept.revenue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="mt-4">
        <Card title="Recent Appointments">
          <DataTable value={recentAppointments} responsiveLayout="scroll">
            <Column field="patientName" header="Patient" />
            <Column field="doctorName" header="Doctor" />
            <Column field="time" header="Time" />
            <Column field="status" header="Status" body={statusBodyTemplate} />
            <Column field="amount" header="Amount" body={amountBodyTemplate} />
            <Column
              header="Actions"
              body={() => (
                <div className="flex gap-2">
                  <Button icon="pi pi-eye" className="p-button-rounded p-button-text" />
                  <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" />
                </div>
              )}
            />
          </DataTable>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid mt-4">
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="text-center cursor-pointer hover:shadow-3">
            <i className="pi pi-user-plus text-4xl text-blue-500 mb-3"></i>
            <h4>Add Doctor</h4>
            <p className="text-600">Register new doctor</p>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="text-center cursor-pointer hover:shadow-3">
            <i className="pi pi-users text-4xl text-green-500 mb-3"></i>
            <h4>Manage Staff</h4>
            <p className="text-600">Add or edit staff members</p>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="text-center cursor-pointer hover:shadow-3">
            <i className="pi pi-chart-bar text-4xl text-orange-500 mb-3"></i>
            <h4>View Reports</h4>
            <p className="text-600">Generate detailed reports</p>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="text-center cursor-pointer hover:shadow-3">
            <i className="pi pi-cog text-4xl text-purple-500 mb-3"></i>
            <h4>Settings</h4>
            <p className="text-600">Configure system settings</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;