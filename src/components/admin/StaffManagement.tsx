'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toolbar } from 'primereact/toolbar';
import { useStaffManagement, StaffMember } from '../../hooks/useStaffManagement';
import { Message } from 'primereact/message';

const StaffManagement: React.FC = () => {
  const toast = useRef<Toast>(null);
  const { staffList, setStaffList, loading, error, addStaff, updateStaff, toggleStaffStatus, loadStaffList } = useStaffManagement();
  
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: 'Staff',
    password: ''
  });

  // Initialize demo staff for fallback
  useEffect(() => {
    const existingStaff = JSON.parse(localStorage.getItem('staffCredentials') || '[]');
    const demoStaff = [
      {
        email: 'john.smith@gmail.com',
        password: 'john',
        name: 'John Smith',
        role: 'staff',
        id: 'demo1'
      },
      {
        email: 'sarah.johnson@gmail.com', 
        password: 'sarah',
        name: 'Sarah Johnson',
        role: 'staff',
        id: 'demo2'
      }
    ];
    
    const hasDemo = existingStaff.some((s: any) => s.id === 'demo1');
    if (!hasDemo) {
      localStorage.setItem('staffCredentials', JSON.stringify([...existingStaff, ...demoStaff]));
    }
  }, []);

  const openNew = () => {
    setFormData({ fullName: '', email: '', phone: '', position: 'Staff', password: '' });
    setEditMode(false);
    setShowDialog(true);
  };

  const editStaff = (staff: StaffMember) => {
    setFormData({
      fullName: staff.fullName,
      email: staff.email,
      phone: staff.phone,
      position: staff.position || 'Staff',
      password: ''
    });
    setSelectedStaff(staff);
    setEditMode(true);
    setShowDialog(true);
  };

  const saveStaff = async () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.position) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields' });
      return;
    }

    let result;
    if (editMode && selectedStaff) {
      result = await updateStaff(selectedStaff.id, formData);
    } else {
      result = await addStaff(formData);
    }

    toast.current?.show({
      severity: result.success ? 'success' : 'error',
      summary: result.success ? 'Success' : 'Error',
      detail: result.message,
      life: result.success && !editMode ? 10000 : 3000
    });

    if (result.success) {
      setShowDialog(false);
      setSelectedStaff(null);
      setFormData({ fullName: '', email: '', phone: '', position: 'Staff', password: '' });
    }
  };

  const handleToggleStatus = (staff: StaffMember) => {
    confirmDialog({
      message: `Are you sure you want to ${staff.isActive ? 'deactivate' : 'activate'} ${staff.fullName}?`,
      header: 'Confirm Action',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const result = await toggleStaffStatus(staff.id);
        toast.current?.show({
          severity: result.success ? 'success' : 'error',
          summary: result.success ? 'Success' : 'Error',
          detail: result.message
        });
      }
    });
  };

  const statusBodyTemplate = (rowData: StaffMember) => (
    <Tag 
      value={rowData.isActive ? 'Active' : 'Inactive'} 
      severity={rowData.isActive ? 'success' : 'danger'} 
    />
  );

  const actionBodyTemplate = (rowData: StaffMember) => (
    <div className="flex gap-2">
      <Button 
        icon="pi pi-pencil" 
        size="small" 
        outlined 
        onClick={() => editStaff(rowData)}
        tooltip="Edit Staff"
        loading={loading}
      />
      <Button 
        icon={rowData.isActive ? "pi pi-ban" : "pi pi-check"} 
        size="small" 
        severity={rowData.isActive ? "danger" : "success"}
        onClick={() => handleToggleStatus(rowData)}
        tooltip={rowData.isActive ? "Deactivate" : "Activate"}
        loading={loading}
      />
    </div>
  );

  const leftToolbarTemplate = () => (
    <Button 
      label="Add Staff" 
      icon="pi pi-plus" 
      onClick={openNew}
    />
  );

  const rightToolbarTemplate = () => null;

  return (
    <div className="staff-management p-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <Card title="Staff Management">
        {error && (
          <Message 
            severity="error" 
            text={error} 
            className="mb-3"
          />
        )}
        
        <Toolbar 
          className="mb-4" 
          left={leftToolbarTemplate}
        />
        
        <DataTable 
          value={staffList} 
          paginator 
          rows={10}
          responsiveLayout="scroll"
          emptyMessage="No staff found"
          loading={loading}
        >
          <Column field="fullName" header="Full Name" sortable />
          <Column field="email" header="Email" sortable />
          <Column field="phone" header="Phone" />
          <Column field="position" header="Position" sortable />
          <Column field="createdAt" header="Created" sortable />
          <Column field="lastLogin" header="Last Login" />
          <Column field="isActive" header="Status" body={statusBodyTemplate} sortable />
          <Column header="Actions" body={actionBodyTemplate} />
        </DataTable>
      </Card>

      <Dialog
        visible={showDialog}
        style={{ width: '450px' }}
        header={editMode ? 'Edit Staff' : 'Add New Staff'}
        modal
        onHide={() => setShowDialog(false)}
      >
        <div className="flex flex-column gap-3">
          <div className="p-3 border-round bg-blue-50 border-blue-200 mb-3">
            <h4 className="mt-0 mb-2 text-blue-900">🔑 Auto-Generated Login</h4>
            <p className="m-0 text-blue-800 text-sm">
              Password will be automatically generated from the first name in the email address.
              <br />
              Example: john.smith@gmail.com → Password: "john"
            </p>
          </div>
          <div>
            <label htmlFor="fullName" className="block mb-2">Full Name *</label>
            <InputText
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full"
              placeholder="Enter full name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block mb-2">Email Address (Login ID) *</label>
            <InputText
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full"
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block mb-2">Phone Number *</label>
            <InputText
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full"
              placeholder="+91 XXXXXXXXXX"
            />
          </div>
          
          <div>
            <label htmlFor="position" className="block mb-2">Position *</label>
            <InputText
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full"
              placeholder="Enter position/role"
            />
          </div>
          
          {!editMode && (
            <div className="p-3 border-round bg-blue-50 border-blue-200">
              <h4 className="mt-0 mb-2 text-blue-900">🔐 Login Credentials</h4>
              <p className="m-0 text-blue-800 text-sm">
                Password will be auto-generated from the first name of the Gmail address.
                <br />
                <strong>Examples:</strong> 
                <br />• john.doe@gmail.com → password: "john"
                <br />• rakesh@gmail.com → password: "rakesh"
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-content-end gap-2 mt-4">
          <Button 
            label="Cancel" 
            icon="pi pi-times" 
            outlined 
            onClick={() => setShowDialog(false)} 
          />
          <Button 
            label={editMode ? "Update" : "Save"} 
            icon="pi pi-check" 
            onClick={saveStaff}
            loading={loading}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default StaffManagement;