'use client';

import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { QueuePatient } from '../../types/models';

interface QueueTrackerProps {
  bookingId: string;
  doctorName: string;
}

const QueueTracker: React.FC<QueueTrackerProps> = ({ bookingId, doctorName }) => {
  const [queueData, setQueueData] = useState<{
    currentPosition: number;
    totalPatients: number;
    estimatedWaitTime: number;
    status: 'waiting' | 'next' | 'in-consultation';
    patients: QueuePatient[];
  }>({
    currentPosition: 3,
    totalPatients: 8,
    estimatedWaitTime: 45,
    status: 'waiting',
    patients: [
      { bookingId: '1', patientName: 'Patient 1', position: 1, estimatedTime: '10:30 AM', status: 'in-consultation' },
      { bookingId: '2', patientName: 'Patient 2', position: 2, estimatedTime: '10:45 AM', status: 'waiting' },
      { bookingId: bookingId, patientName: 'You', position: 3, estimatedTime: '11:00 AM', status: 'waiting' },
      { bookingId: '4', patientName: 'Patient 4', position: 4, estimatedTime: '11:15 AM', status: 'waiting' },
    ]
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setQueueData(prev => ({
        ...prev,
        estimatedWaitTime: Math.max(0, prev.estimatedWaitTime - 1)
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case 'in-consultation': return 'info';
      case 'next': return 'warning';
      case 'waiting': return 'secondary';
      default: return 'secondary';
    }
  };

  const progress = ((queueData.totalPatients - queueData.currentPosition) / queueData.totalPatients) * 100;

  return (
    <Card className="queue-tracker">
      <div className="text-center mb-4">
        <h3>Queue Status - {doctorName}</h3>
        <div className="flex justify-content-center align-items-center gap-3 mb-3">
          <div className="text-4xl font-bold text-primary">#{queueData.currentPosition}</div>
          <div>
            <div className="text-sm text-600">Your position</div>
            <div className="text-sm text-600">of {queueData.totalPatients} patients</div>
          </div>
        </div>
        
        <ProgressBar 
          value={progress} 
          className="mb-3"
          style={{ height: '8px' }}
        />
        
        <div className="flex justify-content-center gap-4 mb-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{queueData.estimatedWaitTime}</div>
            <div className="text-sm text-600">minutes left</div>
          </div>
          <div className="text-center">
            <Tag 
              value={queueData.status} 
              severity={getStatusSeverity(queueData.status)}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="queue-list">
        <h4 className="mb-3">Current Queue</h4>
        <div className="flex flex-column gap-2">
          {queueData.patients.map((patient, index) => (
            <div 
              key={patient.bookingId}
              className={`flex justify-content-between align-items-center p-2 border-round ${
                patient.bookingId === bookingId ? 'bg-blue-50 border-blue-200' : 'surface-100'
              }`}
            >
              <div className="flex align-items-center gap-3">
                <div className={`w-2rem h-2rem border-circle flex align-items-center justify-content-center text-sm font-bold ${
                  patient.status === 'in-consultation' ? 'bg-blue-500 text-white' :
                  patient.status === 'waiting' ? 'bg-gray-300 text-gray-700' : 'bg-orange-300 text-orange-700'
                }`}>
                  {patient.position}
                </div>
                <div>
                  <div className={`font-medium ${patient.bookingId === bookingId ? 'text-blue-600' : ''}`}>
                    {patient.patientName}
                  </div>
                  <div className="text-sm text-600">Est. {patient.estimatedTime}</div>
                </div>
              </div>
              <Tag 
                value={patient.status} 
                severity={getStatusSeverity(patient.status)}
                className="text-xs"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <Button 
          label="Refresh Queue" 
          icon="pi pi-refresh" 
          outlined 
          className="flex-1"
        />
        <Button 
          label="Cancel Appointment" 
          icon="pi pi-times" 
          severity="danger" 
          outlined 
          className="flex-1"
        />
      </div>

      {/* Notifications */}
      {queueData.currentPosition <= 2 && (
        <div className="mt-3 p-3 bg-orange-50 border-orange-200 border-round">
          <div className="flex align-items-center gap-2">
            <i className="pi pi-bell text-orange-500"></i>
            <span className="text-orange-700 font-medium">
              You're next! Please be ready for your consultation.
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default QueueTracker;