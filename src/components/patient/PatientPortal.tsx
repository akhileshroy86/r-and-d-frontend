import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from 'primereact/rating';

const PatientPortal: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const appointments = [
    { id: 1, doctor: 'Dr. Smith', date: '2024-01-15', time: '10:00 AM', status: 'Scheduled' },
    { id: 2, doctor: 'Dr. Johnson', date: '2024-01-20', time: '2:00 PM', status: 'Completed' }
  ];

  const doctors = [
    { id: 1, name: 'Dr. Smith', specialization: 'Cardiology', rating: 4.5, available: true },
    { id: 2, name: 'Dr. Johnson', specialization: 'Neurology', rating: 4.8, available: false }
  ];

  const ratingTemplate = (rowData: any) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  };

  const statusTemplate = (rowData: any) => {
    return (
      <span className={`p-tag ${rowData.available ? 'p-tag-success' : 'p-tag-danger'}`}>
        {rowData.available ? 'Available' : 'Busy'}
      </span>
    );
  };

  return (
    <div className="grid">
      <div className="col-12">
        <h1>Patient Portal 🏥</h1>
      </div>

      {/* Search Doctors */}
      <div className="col-12 md:col-6">
        <Card title="Find Doctors">
          <DataTable value={doctors} className="p-datatable-sm">
            <Column field="name" header="Doctor" />
            <Column field="specialization" header="Specialization" />
            <Column body={ratingTemplate} header="Rating" />
            <Column body={statusTemplate} header="Status" />
          </DataTable>
        </Card>
      </div>

      {/* Book Appointment */}
      <div className="col-12 md:col-6">
        <Card title="Book Appointment 📅">
          <div className="grid">
            <div className="col-12">
              <label>Select Date</label>
              <Calendar 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.value as Date)}
                className="w-full"
                minDate={new Date()}
              />
            </div>
            <div className="col-12">
              <Button label="Book Appointment" className="w-full" />
            </div>
          </div>
        </Card>
      </div>

      {/* My Appointments */}
      <div className="col-12">
        <Card title="My Appointments">
          <DataTable value={appointments}>
            <Column field="doctor" header="Doctor" />
            <Column field="date" header="Date" />
            <Column field="time" header="Time" />
            <Column field="status" header="Status" />
          </DataTable>
        </Card>
      </div>

      {/* Profile Section */}
      <div className="col-12 md:col-6">
        <Card title="My Profile">
          <div className="grid">
            <div className="col-12">
              <p><strong>Name:</strong> John Doe</p>
              <p><strong>Email:</strong> john.doe@email.com</p>
              <p><strong>Phone:</strong> +1 234 567 8900</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PatientPortal;