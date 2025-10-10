'use client';

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { authService } from '../../services/api/authService';

const LoginTest: React.FC = () => {
  const [email, setEmail] = useState('rakesh@gmail.com');
  const [password, setPassword] = useState('rakesh');
  const [result, setResult] = useState<any>(null);

  const testLogin = async () => {
    try {
      console.log('Testing login with:', { email, password });
      const response = await authService.login({ email, password });
      setResult({ success: true, data: response });
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    }
  };

  const checkCredentials = () => {
    const stored = localStorage.getItem('staffCredentials');
    console.log('Stored credentials:', stored);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Parsed credentials:', parsed);
      const match = parsed.find((c: any) => c.email === email && c.password === password);
      console.log('Found match:', match);
    }
  };

  return (
    <Card title="Login Test" className="m-4">
      <div className="flex flex-column gap-3">
        <InputText 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email"
        />
        <Password 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password"
          feedback={false}
        />
        <div className="flex gap-2">
          <Button label="Test Login" onClick={testLogin} />
          <Button label="Check Credentials" onClick={checkCredentials} />
        </div>
        
        {result && (
          <div className="mt-3 p-3 border-round" style={{ backgroundColor: result.success ? '#d4edda' : '#f8d7da' }}>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LoginTest;