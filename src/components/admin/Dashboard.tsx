import React from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';

const AdminDashboard: React.FC = () => {
  const chartData = {
    labels: ['Patients', 'Appointments', 'Doctors', 'Staff'],
    datasets: [
      {
        data: [300, 50, 25, 40],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }
    ]
  };

  return (
    <div className="grid">
      <div className="col-12">
        <h1>Admin Dashboard</h1>
      </div>
      
      <div className="col-12 md:col-6 lg:col-3">
        <Card title="Total Patients" className="text-center">
          <div className="text-6xl font-bold text-blue-500">1,234</div>
        </Card>
      </div>
      
      <div className="col-12 md:col-6 lg:col-3">
        <Card title="Today's Appointments" className="text-center">
          <div className="text-6xl font-bold text-green-500">45</div>
        </Card>
      </div>
      
      <div className="col-12 md:col-6 lg:col-3">
        <Card title="Active Doctors" className="text-center">
          <div className="text-6xl font-bold text-orange-500">25</div>
        </Card>
      </div>
      
      <div className="col-12 md:col-6 lg:col-3">
        <Card title="Staff Members" className="text-center">
          <div className="text-6xl font-bold text-purple-500">67</div>
        </Card>
      </div>
      
      <div className="col-12 md:col-6">
        <Card title="Overview">
          <Chart type="doughnut" data={chartData} />
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;