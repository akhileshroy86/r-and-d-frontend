'use client';

import React from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const QuickTest: React.FC = () => {
  const testCredentialStorage = () => {
    // Clear existing
    localStorage.removeItem('staffCredentials');
    
    // Add test credential
    const testCred = {
      email: 'rakesh@gmail.com',
      password: 'rakesh',
      name: 'Rakesh Kumar',
      role: 'staff',
      id: 'test-123'
    };
    
    localStorage.setItem('staffCredentials', JSON.stringify([testCred]));
    
    // Verify storage
    const stored = localStorage.getItem('staffCredentials');
    const parsed = JSON.parse(stored || '[]');
    
    console.log('=== CREDENTIAL TEST ===');
    console.log('Stored raw:', stored);
    console.log('Parsed:', parsed);
    console.log('First item:', parsed[0]);
    console.log('Email match test:', parsed[0]?.email === 'rakesh@gmail.com');
    console.log('Password match test:', parsed[0]?.password === 'rakesh');
  };

  const testLogin = async () => {
    try {
      const { mockAuthService } = await import('../../services/api/mockAuthService');
      const result = await mockAuthService.login({
        email: 'rakesh@gmail.com',
        password: 'rakesh'
      });
      console.log('Login success:', result);
      alert('Login successful!');
    } catch (error) {
      console.log('Login failed:', error);
      alert('Login failed: ' + (error as Error).message);
    }
  };

  const clearAndSetup = () => {
    localStorage.clear();
    const testCred = {
      email: 'rakesh@gmail.com',
      password: 'rakesh',
      name: 'Rakesh Kumar',
      role: 'staff',
      id: 'test-123'
    };
    localStorage.setItem('staffCredentials', JSON.stringify([testCred]));
    console.log('Fresh credentials set:', [testCred]);
  };

  return (
    <Card title="Quick Test" className="m-4">
      <div className="flex gap-2">
        <Button label="Clear & Setup" onClick={clearAndSetup} severity="danger" />
        <Button label="Test Login" onClick={testLogin} />
      </div>
    </Card>
  );
};

export default QuickTest;