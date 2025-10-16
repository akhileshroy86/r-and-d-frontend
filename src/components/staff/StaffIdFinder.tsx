import React, { useState } from 'react';

const StaffIdFinder: React.FC = () => {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const getStaffList = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/v1/staff');
      const data = await response.json();
      setStaffList(Array.isArray(data) ? data : data.data || []);
      setResult(`Found ${Array.isArray(data) ? data.length : (data.data || []).length} staff members`);
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  const testPasswordChange = async () => {
    if (!selectedId) {
      setResult('Please select a staff member first');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3002/api/v1/staff/${selectedId}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: 'verifyEndpoint456',
          newPassword: 'newTest123'
        })
      });

      const data = await response.json();
      setResult(`Status: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={getStaffList} style={{ marginRight: '10px' }}>Get Staff List</button>
      
      {staffList.length > 0 && (
        <div style={{ margin: '10px 0' }}>
          <select 
            value={selectedId} 
            onChange={(e) => setSelectedId(e.target.value)}
            style={{ padding: '5px', marginRight: '10px' }}
          >
            <option value="">Select Staff Member</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.fullName || staff.firstName} - {staff.email} (ID: {staff.id})
              </option>
            ))}
          </select>
          <button onClick={testPasswordChange}>Test Password Change</button>
        </div>
      )}

      <pre style={{ marginTop: '10px', background: '#f5f5f5', padding: '10px' }}>
        {result}
      </pre>
    </div>
  );
};

export default StaffIdFinder;