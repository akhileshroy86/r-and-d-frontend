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
import LoadingSpinner from '../common/LoadingSpinner';
import AppointmentsSection from './AppointmentsSection';
import PaymentsSection from './PaymentsSection';
import ReviewsSection from './ReviewsSection';
import ShortcutsSection from './ShortcutsSection';

const AdminDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [staff, setStaff] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff`);
      if (response.ok) {
        const data = await response.json();
        setStaff(data.data || data);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      let allAppointmentsData = [];
      
      // Get appointments from API
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`);
        if (response.ok) {
          const data = await response.json();
          allAppointmentsData = [...allAppointmentsData, ...(data.data || data)];
        }
      } catch (error) {
        console.log('API not available, using localStorage only');
      }
      
      // Get all user appointments from localStorage
      const allUsers = ['patient_1', 'patient_2', 'patient_3'];
      allUsers.forEach(userId => {
        const stored = localStorage.getItem(`userAppointments_${userId}`);
        if (stored) {
          try {
            const userAppointments = JSON.parse(stored);
            allAppointmentsData = [...allAppointmentsData, ...userAppointments];
          } catch (e) {
            console.error('Error parsing appointments for user:', userId);
          }
        }
      });
      
      // Remove duplicates
      const uniqueAppointments = allAppointmentsData.filter((apt, index, self) => 
        index === self.findIndex(a => a.id === apt.id)
      );
      
      setAllAppointments(uniqueAppointments);
      setAppointments(uniqueAppointments.slice(0, 10));
      
      // Create payments for all appointments that don't have payments yet
      if (uniqueAppointments.length > 0) {
        const existingPayments = JSON.parse(localStorage.getItem('mockPayments') || '[]');
        const existingPaymentBookingIds = existingPayments.map(p => p.bookingId);
        let newPaymentsCreated = 0;
        
        uniqueAppointments.forEach(appointment => {
          if (!existingPaymentBookingIds.includes(appointment.id)) {
            // Find the doctor for this appointment to get real consultation fee
            const doctor = doctors.find(d => d.id === appointment.doctorId);
            const consultationFee = doctor?.consultationFee || 500;
            
            const payment = {
              id: `PAY_${appointment.id}`,
              bookingId: appointment.id,
              amount: consultationFee,
              status: 'completed',
              method: 'online',
              date: appointment.date || new Date().toISOString()
            };
            existingPayments.push(payment);
            newPaymentsCreated++;
            console.log(`Created payment for appointment ${appointment.id}: ₹${consultationFee}`);
          }
        });
        
        if (newPaymentsCreated > 0) {
          localStorage.setItem('mockPayments', JSON.stringify(existingPayments));
          console.log(`Created ${newPaymentsCreated} new payments for appointments`);
          // Refresh payments after creating new ones
          setTimeout(() => fetchPayments(), 100);
        }
      }
      
      // If no appointments found, create mock data
      if (uniqueAppointments.length === 0) {
        const mockAppointments = [
          { id: 'APT001', date: new Date().toISOString(), timeRange: '09:00-09:30', duration: 30, notes: 'Regular checkup' },
          { id: 'APT002', date: new Date().toISOString(), timeRange: '10:00-10:30', duration: 30, notes: 'Follow-up visit' },
          { id: 'APT003', date: new Date().toISOString(), timeRange: '11:00-11:30', duration: 30, notes: 'Consultation' }
        ];
        setAllAppointments(mockAppointments);
        setAppointments(mockAppointments.slice(0, 10));
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      const mockAppointments = [
        { id: 'APT001', date: new Date().toISOString(), timeRange: '09:00-09:30', duration: 30, notes: 'Regular checkup' },
        { id: 'APT002', date: new Date().toISOString(), timeRange: '10:00-10:30', duration: 30, notes: 'Follow-up visit' },
        { id: 'APT003', date: new Date().toISOString(), timeRange: '11:00-11:30', duration: 30, notes: 'Consultation' }
      ];
      setAllAppointments(mockAppointments);
      setAppointments(mockAppointments.slice(0, 10));
    }
  };

  const fetchPayments = async () => {
    try {
      console.log('Fetching payments from:', `${process.env.NEXT_PUBLIC_API_URL}/payments`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`);
      console.log('Payments response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Payments data received:', data);
        setPayments(data.data || data);
      } else {
        console.log('Payments endpoint not available, using localStorage payments');
        // Use localStorage payments when API is not available
        const storedPayments = localStorage.getItem('mockPayments');
        console.log('Raw localStorage mockPayments:', storedPayments);
        if (storedPayments) {
          const payments = JSON.parse(storedPayments);
          console.log('Using stored payments:', payments);
          setPayments(payments);
        } else {
          console.log('No payments found in localStorage');
          // Add a test payment to see if the system works
          const testPayment = {
            id: 'TEST001',
            amount: 500,
            date: new Date().toISOString(),
            status: 'completed'
          };
          localStorage.setItem('mockPayments', JSON.stringify([testPayment]));
          console.log('Added test payment to localStorage');
          setPayments([testPayment]);
        }
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      console.log('API error, using localStorage payments');
      // Use localStorage payments on error
      const storedPayments = localStorage.getItem('mockPayments');
      if (storedPayments) {
        const payments = JSON.parse(storedPayments);
        console.log('Using stored payments on error:', payments);
        setPayments(payments);
      } else {
        setPayments([]);
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchDoctors(), fetchStaff(), fetchAppointments(), fetchPayments()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Calculate real stats from data
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  
  const todayAppointments = allAppointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const aptDay = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate());
    return aptDay.getTime() === today.getTime();
  }).length;
  
  const yesterdayAppointments = allAppointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const aptDay = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate());
    return aptDay.getTime() === yesterday.getTime();
  }).length;
  
  const appointmentsDiff = todayAppointments - yesterdayAppointments;
  
  const todayRevenue = payments
    .filter(payment => {
      const paymentDate = new Date(payment.date);
      const paymentDay = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), paymentDate.getDate());
      const isToday = paymentDay.getTime() === today.getTime();
      const isCompleted = payment.status === 'completed';
      return isToday && isCompleted;
    })
    .reduce((total, payment) => total + (payment.amount || 0), 0);
  
  const yesterdayRevenue = payments
    .filter(payment => {
      const paymentDate = new Date(payment.date);
      const paymentDay = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), paymentDate.getDate());
      const isYesterday = paymentDay.getTime() === yesterday.getTime();
      const isCompleted = payment.status === 'completed';
      return isYesterday && isCompleted;
    })
    .reduce((total, payment) => total + (payment.amount || 0), 0);
  
  const revenueDiff = todayRevenue - yesterdayRevenue;
  const revenuePercentage = yesterdayRevenue > 0 ? Math.round((revenueDiff / yesterdayRevenue) * 100) : (todayRevenue > 0 ? 100 : 0);
  
  const stats = {
    totalDoctors: doctors.length,
    totalStaff: staff.length,
    todayAppointments,
    yesterdayAppointments,
    appointmentsDiff,
    todayRevenue,
    revenuePercentage
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

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />
      <div className="p-4 bg-gray-50">



      {/* Detailed Stats Cards */}
      <div className="grid mb-4" style={{ paddingLeft: '70px', paddingRight: '70px' }}>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="border-none shadow-2">
            <div className="flex align-items-center justify-content-between mb-3">
              <div className="w-3rem h-3rem bg-blue-100 border-circle flex align-items-center justify-content-center">
                <i className="pi pi-calendar text-blue-500 text-xl"></i>
              </div>
              <div className="w-0.5rem h-0.5rem bg-green-500 border-circle"></div>
            </div>
            <div className="text-3xl font-bold text-900 mb-1">{stats.todayAppointments}</div>
            <div className={`text-sm font-medium mb-1 ${
              stats.appointmentsDiff >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {stats.appointmentsDiff >= 0 ? '+' : ''}{stats.appointmentsDiff} vs yesterday
            </div>
            <div className="text-900 font-medium mb-1">Appointments Today</div>
            <div className="text-600 text-sm">Database appointments</div>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="border-none shadow-2">
            <div className="flex align-items-center justify-content-between mb-3">
              <div className="w-3rem h-3rem bg-green-100 border-circle flex align-items-center justify-content-center">
                <i className="pi pi-users text-green-500 text-xl"></i>
              </div>
              <div className="w-0.5rem h-0.5rem bg-green-500 border-circle"></div>
            </div>
            <div className="text-3xl font-bold text-900 mb-1">51</div>
            <div className="text-green-500 text-sm font-medium mb-1">+8 vs yesterday</div>
            <div className="text-900 font-medium mb-1">Patients Served</div>
            <div className="text-600 text-sm">Completed visits</div>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="border-none shadow-2">
            <div className="flex align-items-center justify-content-between mb-3">
              <div className="w-3rem h-3rem bg-orange-100 border-circle flex align-items-center justify-content-center">
                <i className="pi pi-money-bill text-orange-500 text-xl"></i>
              </div>
              <div className="w-0.5rem h-0.5rem bg-green-500 border-circle"></div>
            </div>
            <div className="text-3xl font-bold text-900 mb-1">₹{stats.todayRevenue.toLocaleString()}</div>
            <div className={`text-sm font-medium mb-1 ${
              stats.revenuePercentage >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {stats.revenuePercentage >= 0 ? '+' : ''}{stats.revenuePercentage}% vs yesterday
            </div>
            <div className="text-900 font-medium mb-1">Revenue Today</div>
            <div className="text-600 text-sm">From patient payments</div>
          </Card>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="border-none shadow-2">
            <div className="flex align-items-center justify-content-between mb-3">
              <div className="w-3rem h-3rem bg-purple-100 border-circle flex align-items-center justify-content-center">
                <i className="pi pi-clock text-purple-500 text-xl"></i>
              </div>
              <div className="w-0.5rem h-0.5rem bg-green-500 border-circle"></div>
            </div>
            <div className="text-3xl font-bold text-900 mb-1">18</div>
            <div className="text-red-500 text-sm font-medium mb-1">+3 vs yesterday</div>
            <div className="text-900 font-medium mb-1">Avg Wait (mins)</div>
            <div className="text-600 text-sm">Across active queues</div>
          </Card>
        </div>
      </div>

      {/* Appointments and Payments Section */}
      <div className="flex gap-3 mt-4">
        <div style={{ width: '75%', paddingLeft: '70px' }}>
          <AppointmentsSection />
        </div>
        <div style={{ width: '25%', paddingRight: '70px' }}>
          <PaymentsSection />
        </div>
      </div>

      {/* Doctors and Staff Cards */}
      <div className="flex gap-3 mt-4">
        {/* Doctors Card */}
        <div style={{ width: '50%', paddingLeft: '70px' }}>
          <Card title="Doctors">
            {/* Doctors List */}
            <div className="flex flex-column gap-3 mb-4">
              {loading ? (
                <div className="text-center p-4">Loading doctors...</div>
              ) : doctors.length === 0 ? (
                <div className="text-center p-4 text-600">No doctors found</div>
              ) : (
                doctors.slice(0, 6).map((doctor: any, index) => (
                  <div key={index} className="flex align-items-center justify-content-between p-2 border-round surface-50">
                    <div className="flex align-items-center gap-3">
                      <img 
                        src={`https://randomuser.me/api/portraits/men/${index + 1}.jpg`}
                        alt={doctor.name}
                        className="w-3rem h-3rem border-circle"
                        style={{ objectFit: 'cover' }}
                      />
                      <div>
                        <div className="font-medium text-900">Dr. {doctor.name}</div>
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
        <div style={{ width: '50%', paddingRight: '70px' }}>
          <Card title="Staff / Reception">
            {/* Staff List */}
            <div className="flex flex-column gap-3 mb-4">
              {loading ? (
                <div className="text-center p-4">Loading staff...</div>
              ) : staff.length === 0 ? (
                <div className="text-center p-4 text-600">No staff found</div>
              ) : (
                staff.slice(0, 6).map((staffMember: any, index) => (
                  <div key={index} className="flex align-items-center justify-content-between p-2 border-round surface-50">
                    <div className="flex align-items-center gap-3">
                      <img 
                        src={`https://randomuser.me/api/portraits/women/${index + 1}.jpg`}
                        alt={staffMember.fullName}
                        className="w-3rem h-3rem border-circle"
                        style={{ objectFit: 'cover' }}
                      />
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

      {/* Reviews Section */}
      <div className="mt-4" style={{ paddingLeft: '70px', paddingRight: '70px' }}>
        <ReviewsSection />
      </div>

      {/* Shortcuts Section */}
      <div className="mt-4" style={{ paddingLeft: '70px', paddingRight: '70px' }}>
        <ShortcutsSection />
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