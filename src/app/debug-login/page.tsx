'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

export default function DebugLogin() {
  const [result, setResult] = useState<any>(null);

  const testLogin = async () => {
    try {
      console.log('🧪 Testing staff login...');
      
      const response = await fetch('/api/auth/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'shiva@gmail.com',
          password: 'shiva'
        })
      });
      
      const data = await response.json();
      console.log('📊 Login response:', data);
      setResult(data);
      
    } catch (error) {
      console.error('❌ Login error:', error);
      setResult({ error: error.message });
    }
  };

  const checkDatabase = async () => {
    try {
      console.log('🔍 Checking database...');
      
      const response = await fetch('/api/staff');
      const data = await response.json();
      
      console.log('📊 Database staff:', data);
      if (data.success && data.data) {
        data.data.forEach((staff: any, index: number) => {
          console.log(`Staff ${index + 1}:`, {
            email: staff.email,
            password: staff.password,
            fullName: staff.fullName,
            isActive: staff.isActive
          });
        });
      }
      
    } catch (error) {
      console.error('❌ Database error:', error);
    }
  };

  return (
    <div className="p-4">
      <Card title="Debug Staff Login">
        <div className="flex gap-2 mb-4">
          <Button 
            label="Check Database" 
            onClick={checkDatabase}
            className="p-button-info"
          />
          <Button 
            label="Test Login (shiva@gmail.com / shiva)" 
            onClick={testLogin}
            className="p-button-success"
          />
        </div>
        
        {result && (
          <div className="mt-4">
            <h4>Result:</h4>
            <pre className="bg-gray-100 p-3 border-round">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-blue-50 border-round">
          <h4>Instructions:</h4>
          <ol>
            <li>Click "Check Database" first to see what staff are stored</li>
            <li>Check browser console (F12) for detailed logs</li>
            <li>Click "Test Login" to test authentication</li>
            <li>Check console for authentication debug logs</li>
          </ol>
        </div>
      </Card>
    </div>
  );
}