'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '../store';
import HomePage from '../components/patient/HomePage';
import AdminDashboard from '../components/admin/AdminDashboard';
import DoctorDashboard from '../components/doctor/DoctorDashboard';
import StaffDashboard from '../components/staff/StaffDashboard';
import LoginModal from '../components/auth/LoginModal';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export default function Home() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [loginModal, setLoginModal] = useState<{
    visible: boolean;
    userType: 'patient' | 'doctor' | 'staff' | 'admin';
  }>({ visible: false, userType: 'patient' });

  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'admin':
          router.push('/admin/staff');
          break;
        case 'staff':
          router.push('/staff');
          break;
        case 'doctor':
          router.push('/doctor');
          break;
        case 'patient':
        default:
          router.push('/patient');
          break;
      }
    }
  }, [isAuthenticated, user, router]);

  const openLoginModal = (userType: 'patient' | 'doctor' | 'staff' | 'admin') => {
    setLoginModal({ visible: true, userType });
  };

  const closeLoginModal = () => {
    setLoginModal({ visible: false, userType: 'patient' });
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex align-items-center justify-content-center bg-gray-50">
          <Card className="w-full max-w-md shadow-3">
            <div className="text-center">
              <div className="mb-4">
                <i className="pi pi-heart text-6xl text-primary mb-3"></i>
                <h1 className="text-3xl font-bold text-primary mb-2">
                  Healthcare Management
                </h1>
                <p className="text-600 text-lg">
                  Complete healthcare solution for patients, doctors & staff
                </p>
              </div>
              
              <div className="flex flex-column gap-3 mt-5">
                <Button 
                  label="Patient Login" 
                  icon="pi pi-user" 
                  className="w-full p-3 text-lg"
                  onClick={() => openLoginModal('patient')}
                />
                <Button 
                  label="Doctor Login" 
                  icon="pi pi-user-edit" 
                  className="w-full p-3 text-lg"
                  severity="secondary"
                  outlined
                  onClick={() => openLoginModal('doctor')}
                />
                <Button 
                  label="Staff Login" 
                  icon="pi pi-users" 
                  className="w-full p-3 text-lg"
                  severity="info"
                  outlined
                  onClick={() => openLoginModal('staff')}
                />
                <Button 
                  label="Admin Login" 
                  icon="pi pi-cog" 
                  className="w-full p-3 text-lg"
                  severity="danger"
                  outlined
                  onClick={() => openLoginModal('admin')}
                />
              </div>
              
              <div className="mt-5 pt-4 border-top-1 surface-border">
                <p className="text-sm text-500">
                  Multi-language support • Voice symptoms • Queue management
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        <LoginModal
          visible={loginModal.visible}
          onHide={closeLoginModal}
          userType={loginModal.userType}
        />
      </>
    );
  }

  // Render dashboard based on user role
  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'staff':
      return <StaffDashboard />;
    case 'patient':
    default:
      return <HomePage />;
  }
}