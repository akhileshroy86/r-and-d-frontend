'use client';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

interface LoginSectionProps {
  onOpenLoginModal: (userType: 'patient' | 'doctor' | 'staff' | 'admin') => void;
}

export default function LoginSection({ onOpenLoginModal }: LoginSectionProps) {
  return (
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
              onClick={() => onOpenLoginModal('patient')}
            />
            <Button 
              label="Doctor Login" 
              icon="pi pi-user-edit" 
              className="w-full p-3 text-lg"
              severity="secondary"
              outlined
              onClick={() => onOpenLoginModal('doctor')}
            />
            <Button 
              label="Staff Login" 
              icon="pi pi-users" 
              className="w-full p-3 text-lg"
              severity="info"
              outlined
              onClick={() => onOpenLoginModal('staff')}
            />
            <Button 
              label="Admin Login" 
              icon="pi pi-cog" 
              className="w-full p-3 text-lg"
              severity="danger"
              outlined
              onClick={() => onOpenLoginModal('admin')}
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
  );
}