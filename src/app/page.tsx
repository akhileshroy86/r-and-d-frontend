'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../store';
import HomePage from '../components/patient/HomePage';
import AdminDashboard from '../components/admin/AdminDashboard';
import DoctorDashboard from '../components/doctor/DoctorDashboard';
import StaffDashboard from '../components/staff/StaffDashboard';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export default function Home() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex align-items-center justify-content-center bg-gray-50">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-4">
              Healthcare Management System
            </h1>
            <p className="text-600 mb-4">
              Your comprehensive healthcare solution
            </p>
            <div className="flex flex-column gap-3">
              <Button 
                label="Patient Login" 
                icon="pi pi-user" 
                className="w-full"
              />
              <Button 
                label="Doctor Login" 
                icon="pi pi-user-md" 
                className="w-full"
                outlined
              />
              <Button 
                label="Staff Login" 
                icon="pi pi-users" 
                className="w-full"
                outlined
              />
              <Button 
                label="Admin Login" 
                icon="pi pi-cog" 
                className="w-full"
                outlined
              />
            </div>
          </div>
        </Card>
      </div>
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