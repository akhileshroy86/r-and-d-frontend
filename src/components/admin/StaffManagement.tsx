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

const StaffManagement: React.FC = () => {
  const toast = useRef<Toast>(null);
  const { staffList, setStaffList, loading, addStaff, updateStaff, toggleStaffStatus } = useStaffManagement();
  
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  // Initialize with mock data
  useEffect(() => {
    setStaffList([
      {
        id: '1',
        fullName: 'John Smith',
        email: 'john.smith@hospital.com',
        phone: '+91 9876543210',
        isActive: true,
        createdAt: '2024-01-15',
        lastLogin: '2024-01-20 09:30'
      },
      {
        id: '2',
        fullName: 'Sarah Johnson',
        email: 'sarah.j@hospital.com',
        phone: '+91 9876543211',
        isActive: false,
        createdAt: '2024-01-10',
        lastLogin: '2024-01-18 14:20'
      }
    ]);
  }, [setStaffList]);

  const openNew = () => {
    setFormData({ fullName: '', email: '', phone: '', password: '' });
    setEditMode(false);
    setShowDialog(true);
  };

  const editStaff = (staff: StaffMember) => {
    setFormData({
      fullName: staff.fullName,
      email: staff.email,
      phone: staff.phone,
      password: ''
    });
    setSelectedStaff(staff);
    setEditMode(true);
    setShowDialog(true);
  };

  const saveStaff = async () => {
    if (!formData.fullName || !formData.email || !formData.phone || (!editMode && !formData.password)) {
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
      detail: result.message
    });

    if (result.success) {
      setShowDialog(false);
      setSelectedStaff(null);
      setFormData({ fullName: '', email: '', phone: '', password: '' });
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

  const exportToExcel = () => {
    const exportData = staffList.map(staff => ({
      'Full Name': staff.fullName,
      'Email': staff.email,
      'Phone': staff.phone,
      'Status': staff.isActive ? 'Active' : 'Inactive',
      'Created Date': staff.createdAt,
      'Last Login': staff.lastLogin || 'Never'
    }));

    const worksheet = {
      'A1': { v: 'Full Name', t: 's' },
      'B1': { v: 'Email', t: 's' },
      'C1': { v: 'Phone', t: 's' },
      'D1': { v: 'Status', t: 's' },
      'E1': { v: 'Created Date', t: 's' },
      'F1': { v: 'Last Login', t: 's' }
    };

    exportData.forEach((row, index) => {
      const rowNum = index + 2;
      worksheet[`A${rowNum}`] = { v: row['Full Name'], t: 's' };
      worksheet[`B${rowNum}`] = { v: row['Email'], t: 's' };
      worksheet[`C${rowNum}`] = { v: row['Phone'], t: 's' };
      worksheet[`D${rowNum}`] = { v: row['Status'], t: 's' };
      worksheet[`E${rowNum}`] = { v: row['Created Date'], t: 's' };
      worksheet[`F${rowNum}`] = { v: row['Last Login'], t: 's' };
    });

    worksheet['!ref'] = `A1:F${exportData.length + 1}`;

    const workbook = {
      Sheets: { 'Staff List': worksheet },
      SheetNames: ['Staff List']
    };

    const excelBuffer = writeXLSX(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `staff-list-${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);

    toast.current?.show({
      severity: 'success',
      summary: 'Export Successful',
      detail: 'Staff list exported to Excel',
      life: 3000
    });
  };

  const writeXLSX = (workbook: any, options: any) => {
    const s2ab = (s: string) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    };

    const wbout = JSON.stringify(workbook);
    return s2ab(wbout);
  };

  const rightToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button 
        label="Export Excel" 
        icon="pi pi-file-excel" 
        className="p-button-success" 
        outlined
        onClick={exportToExcel}
        disabled={staffList.length === 0}
      />
    </div>
  );

  return (
    <div className="staff-management p-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <Card title="Staff Management">
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
            <label htmlFor="password" className="block mb-2">
              Password {!editMode && '*'}
            </label>
            <Password
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full"
              placeholder={editMode ? "Leave blank to keep current password" : "Enter password"}
              toggleMask
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
    </div>
  );
};

export default StaffManagement;