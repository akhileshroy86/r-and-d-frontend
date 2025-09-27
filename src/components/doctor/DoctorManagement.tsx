import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';

const DoctorManagement: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: ''
  });

  const { doctors, loading } = useSelector((state: RootState) => state.doctor);
  const dispatch = useDispatch();

  const specializations = [
    { label: 'Cardiology', value: 'cardiology' },
    { label: 'Neurology', value: 'neurology' },
    { label: 'Orthopedics', value: 'orthopedics' },
    { label: 'Pediatrics', value: 'pediatrics' }
  ];

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" />
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-content-between align-items-center mb-4">
        <h1>Doctor Management</h1>
        <Button 
          label="Add Doctor" 
          icon="pi pi-plus" 
          onClick={() => setVisible(true)}
        />
      </div>

      <DataTable value={doctors} loading={loading} paginator rows={10}>
        <Column field="name" header="Name" sortable />
        <Column field="specialization" header="Specialization" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="phone" header="Phone" />
        <Column body={actionBodyTemplate} header="Actions" />
      </DataTable>

      <Dialog 
        header="Add Doctor" 
        visible={visible} 
        onHide={() => setVisible(false)}
        style={{ width: '450px' }}
      >
        <div className="grid">
          <div className="col-12">
            <label htmlFor="name">Name</label>
            <InputText 
              id="name" 
              value={doctorForm.name}
              onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
              className="w-full"
            />
          </div>
          <div className="col-12">
            <label htmlFor="specialization">Specialization</label>
            <Dropdown 
              value={doctorForm.specialization}
              options={specializations}
              onChange={(e) => setDoctorForm({...doctorForm, specialization: e.value})}
              className="w-full"
            />
          </div>
          <div className="col-12">
            <label htmlFor="email">Email</label>
            <InputText 
              id="email" 
              value={doctorForm.email}
              onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
              className="w-full"
            />
          </div>
          <div className="col-12">
            <label htmlFor="phone">Phone</label>
            <InputText 
              id="phone" 
              value={doctorForm.phone}
              onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
              className="w-full"
            />
          </div>
          <div className="col-12 flex justify-content-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setVisible(false)} />
            <Button label="Save" onClick={() => setVisible(false)} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DoctorManagement;