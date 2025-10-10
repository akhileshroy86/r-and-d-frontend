'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const CredentialsDebug: React.FC = () => {
  const [credentials, setCredentials] = useState<any[]>([]);

  const loadCredentials = () => {
    const stored = localStorage.getItem('staffCredentials');
    if (stored) {
      setCredentials(JSON.parse(stored));
    }
  };

  useEffect(() => {
    loadCredentials();
  }, []);

  const clearCredentials = () => {
    localStorage.removeItem('staffCredentials');
    setCredentials([]);
  };

  return (
    <Card title="Staff Credentials Debug" className="m-4">
      <div className="flex gap-2 mb-4">
        <Button label="Refresh" icon="pi pi-refresh" onClick={loadCredentials} />
        <Button label="Clear All" icon="pi pi-trash" severity="danger" onClick={clearCredentials} />
      </div>
      
      <DataTable value={credentials} emptyMessage="No credentials found">
        <Column field="email" header="Email" />
        <Column field="password" header="Password" />
        <Column field="name" header="Name" />
        <Column field="role" header="Role" />
        <Column field="id" header="ID" />
      </DataTable>
      
      <div className="mt-4 p-3 bg-gray-100 border-round">
        <h4>Raw Data:</h4>
        <pre>{JSON.stringify(credentials, null, 2)}</pre>
      </div>
    </Card>
  );
};

export default CredentialsDebug;