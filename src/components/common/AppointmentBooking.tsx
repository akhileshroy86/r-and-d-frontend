'use client';

import { useState } from 'react';

const AppointmentBooking = () => {
  const [result, setResult] = useState('');

  const bookAppointment = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientId: 'temp_patient_id',
          doctorId: 'cmgf0hfqw0002gye0q20izr0b',
          date: new Date('2025-10-22').toISOString(),
          timeRange: '10:00 AM - 10:30 AM',
          notes: 'Test booking',
          duration: 30
        })
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
      
      if (response.ok) {
        alert('Appointment booked successfully!');
      }
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-4">
      <button 
        onClick={bookAppointment}
        className="bg-green-500 text-white px-6 py-3 rounded text-lg"
      >
        Book Appointment
      </button>
      <pre className="mt-4 p-4 bg-gray-100 rounded text-sm">{result}</pre>
    </div>
  );
};

export default AppointmentBooking;