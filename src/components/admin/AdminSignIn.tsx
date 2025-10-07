'use client';

import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useAdminAuth } from '../../hooks/custom/useAdminAuth';
import { useRouter } from 'next/navigation';

const AdminSignIn = () => {
  const { signIn, loading } = useAdminAuth();
  const router = useRouter();
  const toast = useRef<Toast>(null);
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all fields'
      });
      return;
    }

    try {
      await signIn(credentials.email, credentials.password);
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Signed in successfully'
      });
      router.push('/');
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Sign In Failed',
        detail: error.message || 'Invalid credentials'
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Card title="Admin Sign In" className="w-full max-w-md">
        <form onSubmit={handleSignIn} className="flex flex-column gap-4">
          <div className="field">
            <label className="block text-900 font-medium mb-2">Email</label>
            <InputText
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
              className="w-full"
              type="email"
              required
            />
          </div>

          <div className="field">
            <label className="block text-900 font-medium mb-2">Password</label>
            <Password
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter your password"
              className="w-full"
              feedback={false}
              toggleMask
              required
            />
          </div>

          <Button
            type="submit"
            label="Sign In"
            loading={loading}
            className="w-full"
            severity="danger"
          />
        </form>
      </Card>
    </>
  );
};

export default AdminSignIn;