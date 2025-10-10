'use client';

import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';
import { staffAuthService } from '../../services/api/staffAuthService';

const StaffLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      toast.current?.show({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please enter both email and password',
        life: 3000
      });
      return;
    }

    setLoading(true);
    try {
      const result = await staffAuthService.login(credentials);
      
      if (result.success) {
        // Store staff token
        localStorage.setItem('staffToken', result.data.token);
        localStorage.setItem('staffUser', JSON.stringify(result.data.user));
      
        dispatch(loginSuccess({
          user: result.data.user,
          token: result.data.token
        }));
        
        toast.current?.show({
          severity: 'success',
          summary: 'Login Successful',
          detail: `Welcome ${result.data.user.name}!`,
          life: 3000
        });
        
        // Redirect to staff dashboard
        router.push('/staff');
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Login Failed',
          detail: result.message || 'Invalid credentials',
          life: 3000
        });
      }
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Login Failed',
        detail: error.message || 'Invalid email or password',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex align-items-center justify-content-center bg-gray-50">
      <Toast ref={toast} />
      
      <Card className="w-full max-w-md shadow-4">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-900 mb-2">Staff Login</h2>
          <p className="text-600">Enter your credentials to access the staff dashboard</p>
        </div>
        
        <div className="flex flex-column gap-3">
          <div>
            <label htmlFor="email" className="block mb-2 font-medium">Email Address</label>
            <InputText
              id="email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full"
              onKeyPress={handleKeyPress}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block mb-2 font-medium">Password</label>
            <Password
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full"
              feedback={false}
              toggleMask
              onKeyPress={handleKeyPress}
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
        
        <div className="mt-4 p-3 border-round bg-blue-50 border-blue-200">
          <h4 className="mt-0 mb-2 text-blue-900">🔑 Test Credentials</h4>
          <p className="m-0 text-blue-800 text-sm">
            Use the credentials provided by admin when your account was created.
            <br />
            Password is typically the first name from your Gmail address.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default StaffLogin;