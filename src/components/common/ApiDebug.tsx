'use client';

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { appointmentService } from '../../services/api/appointmentService';

const ApiDebug = () => {
  const [doctorsData, setDoctorsData] = useState<any>(null);
  const [appointmentsData, setAppointmentsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDoctorsApi = async () => {
    setLoading(true);
    try {
      const doctors = await appointmentService.getDoctors();
      setDoctorsData(doctors);
      console.log('Doctors API Response:', doctors);
    } catch (error) {
      console.error('Doctors API Error:', error);
      setDoctorsData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testAppointmentsApi = async () => {
    setLoading(true);
    try {
      const appointments = await appointmentService.getAppointments();
      setAppointmentsData(appointments);
      console.log('Appointments API Response:', appointments);
    } catch (error) {
      console.error('Appointments API Error:', error);
      setAppointmentsData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card title="API Debug Tool" className="mb-4">
        <div className="flex gap-2 mb-4">
          <Button 
            label="Test Doctors API" 
            onClick={testDoctorsApi}
            loading={loading}
            className="p-button-info"
          />
          <Button 
            label="Test Appointments API" 
            onClick={testAppointmentsApi}
            loading={loading}
            className="p-button-success"
          />
        </div>

        {doctorsData && (
          <Card title="Doctors API Response" className="mb-3">
            <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '300px' }}>
              {JSON.stringify(doctorsData, null, 2)}
            </pre>
          </Card>
        )}

        {appointmentsData && (
          <Card title="Appointments API Response">
            <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '300px' }}>
              {JSON.stringify(appointmentsData, null, 2)}
            </pre>
          </Card>
        )}
      </Card>
    </div>
  );
};

export default ApiDebug;