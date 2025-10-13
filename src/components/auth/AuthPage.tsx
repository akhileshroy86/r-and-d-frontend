'use client';

import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { TabView, TabPanel } from 'primereact/tabview';
import { useRouter } from 'next/navigation';

const AuthPage: React.FC = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [resetData, setResetData] = useState({ email: '', oldPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const router = useRouter();

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please fill all fields' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3002/api/v1/auth/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const result = await response.json();
      console.log('Login response:', { status: response.status, result });

      if (response.ok && result.access_token) {
        console.log('Login successful, storing data and redirecting...');
        localStorage.setItem('token', result.access_token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        toast.current?.show({
          severity: 'success',
          summary: 'Login Successful',
          detail: `Welcome ${result.user.email}!`
        });
        
        console.log('Redirecting to /staff');
        router.push('/staff');
      } else {
        console.log('Login failed:', result);
        toast.current?.show({
          severity: 'error',
          summary: 'Login Failed',
          detail: result.message || 'Invalid credentials'
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Login failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetData.email || !resetData.oldPassword || !resetData.newPassword) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please fill all fields' });
      return;
    }

    setLoading(true);
    try {
      // First find staff by email to get staff ID
      const staffResponse = await fetch(`http://localhost:3002/api/v1/staff/login-info/${resetData.email}`);
      const staffInfo = await staffResponse.json();
      
      if (staffInfo.error) {
        throw new Error('Staff not found with this email');
      }
      
      // Get all staff to find the staff ID by userId
      const allStaffResponse = await fetch('http://localhost:3002/api/v1/staff');
      const allStaff = await allStaffResponse.json();
      const staff = allStaff.find((s: any) => s.userId === staffInfo.userId);
      
      if (!staff) {
        throw new Error('Staff record not found');
      }
      
      // Use staff change-password endpoint with staff ID
      const response = await fetch(`http://localhost:3002/api/v1/staff/${staff.id}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: resetData.oldPassword,
          newPassword: resetData.newPassword
        })
      });

      const result = await response.json();

      if (response.ok && result.message) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: result.message
        });
        setResetData({ email: '', oldPassword: '', newPassword: '' });
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: result.message || 'Current password is incorrect'
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Password reset failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex align-items-center justify-content-center bg-gray-50">
      <Toast ref={toast} />
      
      <Card className="w-full max-w-md shadow-4">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-900 mb-2">Staff Portal</h2>
          <p className="text-600">Login or reset your password</p>
        </div>
        
        <TabView>
          <TabPanel header="Login">
            <div className="flex flex-column gap-3">
              <div>
                <label htmlFor="email" className="block mb-2 font-medium">Email</label>
                <InputText
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block mb-2 font-medium">Password</label>
                <Password
                  id="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full"
                  feedback={false}
                  toggleMask
                />
              </div>
              
              <Button
                label="Login"
                icon="pi pi-sign-in"
                onClick={handleLogin}
                loading={loading}
                className="w-full mt-3"
              />
            </div>
          </TabPanel>
          
          <TabPanel header="Reset Password">
            <div className="flex flex-column gap-3">
              <div className="p-3 border-round bg-blue-50 border-blue-200 mb-3">
                <h4 className="mt-0 mb-2 text-blue-900">🔑 Password Reset</h4>
                <p className="m-0 text-blue-800 text-sm">
                  Your old password is your first name (from your profile).
                  <br />
                  Enter it to set a new password.
                </p>
              </div>
              
              <div>
                <label htmlFor="resetEmail" className="block mb-2 font-medium">Email</label>
                <InputText
                  id="resetEmail"
                  type="email"
                  value={resetData.email}
                  onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="oldPassword" className="block mb-2 font-medium">Old Password (First Name)</label>
                <Password
                  id="oldPassword"
                  value={resetData.oldPassword}
                  onChange={(e) => setResetData({ ...resetData, oldPassword: e.target.value })}
                  placeholder="Enter your first name"
                  className="w-full"
                  feedback={false}
                  toggleMask
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block mb-2 font-medium">New Password</label>
                <Password
                  id="newPassword"
                  value={resetData.newPassword}
                  onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="w-full"
                  feedback={true}
                  toggleMask
                />
              </div>
              
              <Button
                label="Reset Password"
                icon="pi pi-refresh"
                onClick={handlePasswordReset}
                loading={loading}
                className="w-full mt-3"
              />
            </div>
          </TabPanel>
        </TabView>
      </Card>
    </div>
  );
};

export default AuthPage;