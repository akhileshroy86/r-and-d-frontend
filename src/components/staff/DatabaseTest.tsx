'use client';

import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

const DatabaseTest: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [email, setEmail] = useState('ganesh@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testPasswordChange = async () => {
    setLoading(true);
    setResponse(null);
    
    try {
      console.log('🔄 Testing password change with backend...');
      
      const response = await fetch('http://localhost:3002/api/v1/auth/staff/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          currentPassword,
          newPassword
        })
      });

      const result = await response.json();
      
      setResponse({
        status: response.status,
        success: result.success,
        message: result.message,
        timestamp: new Date().toISOString()
      });

      console.log('📊 Backend Response:', {
        status: response.status,
        result
      });

      toast.current?.show({
        severity: result.success ? 'success' : 'error',
        summary: result.success ? 'Password Change Success' : 'Password Change Failed',
        detail: result.message,
        life: 5000
      });

    } catch (error: any) {
      console.error('❌ Request failed:', error);
      setResponse({
        error: error.message,
        timestamp: new Date().toISOString()
      });

      toast.current?.show({
        severity: 'error',
        summary: 'Connection Failed',
        detail: 'Cannot connect to backend server',
        life: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3002/api/v1/auth/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: newPassword
        })
      });

      const result = await response.json();
      
      toast.current?.show({
        severity: result.success ? 'success' : 'warn',
        summary: 'Login Test',
        detail: result.success ? 'Login successful with new password!' : 'Login failed - password not updated in database',
        life: 5000
      });
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Login Test Failed',
        detail: error.message,
        life: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="database-test p-4">
      <Toast ref={toast} />
      
      <Card title="🔍 Database Update Test" className="max-w-2xl mx-auto">
        <div className="flex flex-column gap-3">
          <div className="p-3 border-round bg-orange-50 border-orange-200">
            <h4 className="mt-0 mb-2 text-orange-900">⚠️ Direct Backend Test</h4>
            <p className="text-orange-800 text-sm mb-0">
              This tests if the backend API actually updates the database at localhost:5560
            </p>
          </div>

          <div>
            <label className="block mb-2 font-medium">Staff Email:</label>
            <InputText
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              placeholder="Enter Ganesh's email"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Current Password:</label>
            <InputText
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">New Password:</label>
            <InputText
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full"
              placeholder="Enter new password"
            />
          </div>

          <div className="flex gap-2">
            <Button
              label="Test Password Change"
              icon="pi pi-key"
              onClick={testPasswordChange}
              loading={loading}
              disabled={!email || !currentPassword || !newPassword}
              className="flex-1"
            />
            <Button
              label="Test Login with New Password"
              icon="pi pi-sign-in"
              onClick={testLogin}
              loading={loading}
              disabled={!email || !newPassword}
              outlined
              className="flex-1"
            />
          </div>

          {response && (
            <div className="p-3 border-round surface-100">
              <h4 className="mt-0 mb-2">Backend Response:</h4>
              <pre className="text-sm overflow-auto bg-white p-2 border-round">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}

          <div className="p-3 border-round bg-blue-50 border-blue-200">
            <h4 className="mt-0 mb-2 text-blue-900">🔧 Troubleshooting Steps:</h4>
            <ol className="text-blue-800 text-sm pl-3 mb-0">
              <li>Check if backend server is running on localhost:3002</li>
              <li>Verify the password change API endpoint exists</li>
              <li>Check backend logs for database update queries</li>
              <li>Manually check database at localhost:5560 after test</li>
              <li>Ensure backend is connected to the correct database</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DatabaseTest;