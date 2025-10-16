'use client';

import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';

const BackendTest: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      const response = await fetch('http://localhost:3002/api/v1/auth/staff/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@test.com',
          currentPassword: 'test',
          newPassword: 'newtest'
        })
      });
      
      const result = await response.json();
      setTestResult({ 
        status: response.status, 
        connected: true,
        data: result 
      });
      
      toast.current?.show({
        severity: 'success',
        summary: 'Backend Connected',
        detail: `Backend is reachable at localhost:3002`,
        life: 4000
      });
    } catch (error: any) {
      setTestResult({ 
        connected: false,
        error: error.message 
      });
      
      toast.current?.show({
        severity: 'error',
        summary: 'Backend Connection Failed',
        detail: 'Make sure backend server is running on localhost:3002',
        life: 4000
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
          email: 'john.smith@gmail.com',
          password: 'john'
        })
      });
      
      const result = await response.json();
      
      toast.current?.show({
        severity: result.success ? 'success' : 'warn',
        summary: 'Login Test',
        detail: result.message || 'Login test completed',
        life: 4000
      });
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Login Test Failed',
        detail: 'Cannot reach backend login endpoint',
        life: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backend-test p-4">
      <Toast ref={toast} />
      
      <Card title="🔗 Backend Connection Test" className="max-w-2xl mx-auto">
        <div className="flex flex-column gap-4">
          <Message 
            severity="info" 
            text="Test connection to backend server at localhost:3002" 
          />

          <div className="flex gap-2">
            <Button
              label="Test Backend Connection"
              icon="pi pi-wifi"
              onClick={testBackendConnection}
              loading={loading}
              className="flex-1"
            />
            <Button
              label="Test Login Endpoint"
              icon="pi pi-sign-in"
              onClick={testLogin}
              loading={loading}
              outlined
              className="flex-1"
            />
          </div>

          {testResult && (
            <div className="p-3 border-round surface-100">
              <h4 className="mt-0 mb-2">Test Result:</h4>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}

          <div className="p-3 border-round bg-yellow-50 border-yellow-200">
            <h4 className="mt-0 mb-2 text-yellow-900">⚠️ Backend Requirements:</h4>
            <ul className="text-yellow-800 pl-3 mb-0">
              <li>Backend server must be running on <code>localhost:3002</code></li>
              <li>Password change endpoint: <code>/api/v1/auth/staff/change-password</code></li>
              <li>Login endpoint: <code>/api/v1/auth/staff/login</code></li>
              <li>Staff accounts must exist in backend database</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BackendTest;