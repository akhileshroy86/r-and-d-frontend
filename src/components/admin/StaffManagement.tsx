'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toolbar } from 'primereact/toolbar';
import { useStaffManagement, StaffMember } from '../../hooks/useStaffManagement';
import { Message } from 'primereact/message';
import { checkBackendHealth, testStaffEndpoint } from '../../utils/backendHealth';

const StaffManagement: React.FC = () => {
  const toast = useRef<Toast>(null);
  const { staffList, setStaffList, loading, error, addStaff, updateStaff, toggleStaffStatus, loadStaffList, changeStaffPassword } = useStaffManagement();
  
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
  
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordChangeData, setPasswordChangeData] = useState({
    email: '',
    currentPassword: '',
    newPassword: ''
  });



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

    if (editMode && selectedStaff) {
      const result = await updateStaff(selectedStaff.id, formData);
      toast.current?.show({
        severity: result.success ? 'success' : 'error',
        summary: result.success ? 'Success' : 'Error',
        detail: result.message
      });
      if (result.success) {
        setShowDialog(false);
        setSelectedStaff(null);
        setFormData({ fullName: '', email: '', phone: '', position: 'Staff', password: '' });
      }
      return;
    }

    // Generate password
    const emailPrefix = formData.email.split('@')[0];
    const generatedPassword = emailPrefix.includes('.') ? emailPrefix.split('.')[0].toLowerCase() : emailPrefix.toLowerCase();
    
    const result = await addStaff({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      password: generatedPassword
    });
    
    toast.current?.show({
      severity: result.success ? 'success' : 'error',
      summary: result.success ? 'Staff Added Successfully' : 'Error',
      detail: result.success ? `Login: ${formData.email} | Password: ${generatedPassword}` : result.message,
      life: result.success ? 10000 : 5000
    });
    
    if (result.success) {
      setShowDialog(false);
      setFormData({ fullName: '', email: '', phone: '', position: 'Staff', password: '' });
      loadStaffList(); // Refresh from backend
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

  const changePassword = (staff: StaffMember) => {
    setPasswordChangeData({
      email: staff.email,
      currentPassword: '',
      newPassword: ''
    });
    setShowPasswordDialog(true);
  };

  const handlePasswordChange = async () => {
    if (!passwordChangeData.currentPassword || !passwordChangeData.newPassword) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please enter both current and new password' });
      return;
    }

    try {
      console.log('🔄 Making password change API call...');
      const response = await fetch('http://localhost:3002/api/v1/auth/staff/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: passwordChangeData.email,
          currentPassword: passwordChangeData.currentPassword,
          newPassword: passwordChangeData.newPassword
        })
      });

      const result = await response.json();
      console.log('📥 API Response:', result);

      toast.current?.show({
        severity: result.success ? 'success' : 'error',
        summary: result.success ? 'Success' : 'Error',
        detail: result.message || 'Password change completed'
      });

      if (result.success) {
        setShowPasswordDialog(false);
        setPasswordChangeData({ email: '', currentPassword: '', newPassword: '' });
      }
    } catch (error) {
      console.error('❌ Password change error:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to change password. Please try again.'
      });
    }
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
        icon="pi pi-key" 
        size="small" 
        severity="warning"
        onClick={() => changePassword(rowData)}
        tooltip="Change Password"
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

  const testBackend = async () => {
    const isHealthy = await checkBackendHealth();
    const staffEndpointWorks = await testStaffEndpoint();
    
    toast.current?.show({
      severity: isHealthy && staffEndpointWorks ? 'success' : 'error',
      summary: 'Backend Status',
      detail: `Health: ${isHealthy ? '✅' : '❌'} | Staff API: ${staffEndpointWorks ? '✅' : '❌'}`,
      life: 5000
    });
  };

  const rightToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button 
        label="Test Backend" 
        icon="pi pi-cog" 
        onClick={testBackend}
        severity="info"
        outlined
      />
      <Button 
        label="Refresh" 
        icon="pi pi-refresh" 
        onClick={() => loadStaffList()}
        loading={loading}
      />
    </div>
  );

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
          right={rightToolbarTemplate}
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
              disabled={editMode}
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

      <Dialog
        visible={showPasswordDialog}
        style={{ width: '400px' }}
        header="Change Password"
        modal
        onHide={() => setShowPasswordDialog(false)}
      >
        <div className="flex flex-column gap-3">
          <div>
            <label htmlFor="currentPassword" className="block mb-2">Current Password *</label>
            <InputText
              id="currentPassword"
              type="password"
              value={passwordChangeData.currentPassword}
              onChange={(e) => setPasswordChangeData({ ...passwordChangeData, currentPassword: e.target.value })}
              className="w-full"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block mb-2">New Password *</label>
            <InputText
              id="newPassword"
              type="password"
              value={passwordChangeData.newPassword}
              onChange={(e) => setPasswordChangeData({ ...passwordChangeData, newPassword: e.target.value })}
              className="w-full"
              placeholder="Enter new password"
            />
          </div>
        </div>
        
        <div className="flex justify-content-end gap-2 mt-4">
          <Button 
            label="Cancel" 
            icon="pi pi-times" 
            outlined 
            onClick={() => setShowPasswordDialog(false)} 
          />
          <Button 
            label="Change Password" 
            icon="pi pi-check" 
            onClick={handlePasswordChange}
            loading={loading}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default StaffManagement;