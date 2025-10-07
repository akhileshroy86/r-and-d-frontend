'use client';

import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '../../store';
import AdminHeader from './AdminHeader';

const AdminDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [staff, setStaff] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDialog, setViewDialog] = useState({ visible: false, appointment: null });
  const [editDialog, setEditDialog] = useState({ visible: false, appointment: null });

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors`);
      if (response.ok) {
        const data = await response.json();
        setDoctors(data.data || data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      console.log('Fetching staff from:', `${process.env.NEXT_PUBLIC_API_URL}/staff`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff`);
      console.log('Staff response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Staff data received:', data);
        setStaff(data.data || data);
      } else {
        console.error('Staff API error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/appointments');
      if (response.ok) {
        const data = await response.json();
        console.log('Appointments data:', data);
        console.log('First appointment:', data[0]);
        setAppointments(data.slice(0, 10)); // Show only recent 10 appointments
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchDoctors(), fetchStaff(), fetchAppointments()]);
      setLoading(false);
    };
    loadData();
  }, []);

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
    <div className="min-h-screen bg-white">
      <AdminHeader />
      <div className="p-4 bg-gray-50">

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

      {/* Doctors and Staff Cards */}
      <div className="grid">
        {/* Doctors Card */}
        <div className="col-12 lg:col-6">
          <Card title="Doctors">
            {/* Doctors List */}
            <div className="flex flex-column gap-3 mb-4">
              {loading ? (
                <div className="text-center p-4">Loading doctors...</div>
              ) : doctors.length === 0 ? (
                <div className="text-center p-4 text-600">No doctors found</div>
              ) : (
                doctors.slice(0, 3).map((doctor: any, index) => (
                  <div key={index} className="flex align-items-center justify-content-between p-2 border-round surface-50">
                    <div className="flex align-items-center gap-3">
                      <div className="w-3rem h-3rem bg-blue-500 border-circle flex align-items-center justify-content-center text-white font-bold">
                        {doctor.name?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <div className="font-medium text-900">{doctor.name}</div>
                        <div className="text-sm text-600">{doctor.specialization}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{doctor.consultationFee}</div>
                      <div className="flex align-items-center gap-1 justify-content-end">
                        <span className="w-0.5rem h-0.5rem border-circle bg-green-500"></span>
                        <span className="text-sm text-green-600">Available</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                label="Manage Doctors" 
                className="flex-1 bg-blue-500 border-blue-500" 
                onClick={() => router.push('/admin/doctors')}
              />
              <Button label="Add Doctor" className="flex-1" outlined />
            </div>
          </Card>
        </div>
        
        {/* Staff Card */}
        <div className="col-12 lg:col-6">
          <Card title="Staff / Reception">
            {/* Staff List */}
            <div className="flex flex-column gap-3 mb-4">
              {loading ? (
                <div className="text-center p-4">Loading staff...</div>
              ) : staff.length === 0 ? (
                <div className="text-center p-4 text-600">No staff found</div>
              ) : (
                staff.slice(0, 3).map((staffMember: any, index) => (
                  <div key={index} className="flex align-items-center justify-content-between p-2 border-round surface-50">
                    <div className="flex align-items-center gap-3">
                      <div className="w-3rem h-3rem bg-green-500 border-circle flex align-items-center justify-content-center text-white font-bold">
                        {staffMember.fullName?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <div className="font-medium text-900">{staffMember.fullName}</div>
                        <div className="text-sm text-600">{staffMember.position}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{staffMember.email}</div>
                      <div className={`text-sm ${
                        staffMember.isActive ? 'text-green-600' : 'text-red-600'
                      }`}>{staffMember.isActive ? 'Active' : 'Inactive'}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                label="Manage Staff" 
                className="flex-1 bg-blue-500 border-blue-500" 
                onClick={() => router.push('/admin/staff')}
              />
              <Button label="Add Staff" className="flex-1" outlined />
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="mt-4">
        <Card title="Recent Appointments">
          <DataTable value={appointments} responsiveLayout="scroll" loading={loading}>
            <Column field="id" header="Appointment ID" />
            <Column field="timeRange" header="Time" />
            <Column 
              field="date" 
              header="Date" 
              body={(rowData) => new Date(rowData.date).toLocaleDateString()}
            />
            <Column
              header="Actions"
              body={(rowData) => (
                <div className="flex gap-2">
                  <Button 
                    icon="pi pi-eye" 
                    className="p-button-rounded p-button-text" 
                    onClick={() => setViewDialog({ visible: true, appointment: rowData })}
                    tooltip="View Details"
                  />
                  <Button 
                    icon="pi pi-pencil" 
                    className="p-button-rounded p-button-text" 
                    onClick={() => setEditDialog({ visible: true, appointment: rowData })}
                    tooltip="Edit Appointment"
                  />
                  <Button 
                    icon="pi pi-trash" 
                    className="p-button-rounded p-button-text p-button-danger" 
                    onClick={() => {
                      confirmDialog({
                        message: `Are you sure you want to delete appointment ${rowData.id}?`,
                        header: 'Delete Confirmation',
                        icon: 'pi pi-exclamation-triangle',
                        accept: () => {
                          console.log(`Deleting appointment ${rowData.id}`);
                        }
                      });
                    }}
                    tooltip="Delete Appointment"
                  />
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
      
      {/* View Dialog */}
      <Dialog 
        header="Appointment Details" 
        visible={viewDialog.visible} 
        onHide={() => setViewDialog({ visible: false, appointment: null })}
        style={{ width: '450px' }}
      >
        {viewDialog.appointment && (
          <div className="flex flex-column gap-3">
            <div><strong>ID:</strong> {viewDialog.appointment.id}</div>
            <div><strong>Date:</strong> {new Date(viewDialog.appointment.date).toLocaleDateString()}</div>
            <div><strong>Time:</strong> {viewDialog.appointment.timeRange}</div>
            <div><strong>Duration:</strong> {viewDialog.appointment.duration} minutes</div>
            <div><strong>Notes:</strong> {viewDialog.appointment.notes || 'No notes'}</div>
          </div>
        )}
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog 
        header="Edit Appointment" 
        visible={editDialog.visible} 
        onHide={() => setEditDialog({ visible: false, appointment: null })}
        style={{ width: '450px' }}
      >
        {editDialog.appointment && (
          <div className="flex flex-column gap-3">
            <p>Edit functionality for appointment {editDialog.appointment.id} will be implemented here.</p>
            <Button 
              label="Save Changes" 
              onClick={() => {
                console.log('Saving changes for appointment', editDialog.appointment.id);
                setEditDialog({ visible: false, appointment: null });
              }}
            />
          </div>
        )}
      </Dialog>
      
      <ConfirmDialog />
    </div>
  );
};

export default AdminDashboard;