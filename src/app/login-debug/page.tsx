'use client';

import React from 'react';
import LoginTest from '../../components/debug/LoginTest';
import CredentialsDebug from '../../components/debug/CredentialsDebug';
import QuickTest from '../../components/debug/QuickTest';

const LoginDebugPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Login Debug Page</h1>
        <QuickTest />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LoginTest />
          <CredentialsDebug />
        </div>
      </div>
    </div>
  );
};

export default LoginDebugPage;