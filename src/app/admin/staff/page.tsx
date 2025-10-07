'use client';

import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useRouter } from 'next/navigation';
import AdminHeader from '../../../components/admin/AdminHeader';

const StaffPage: React.FC = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCell, setEditingCell] = useState<{rowId: string, field: string} | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const toast = useRef<Toast>(null);
  const router = useRouter();

  const positions = [
    { label: 'Receptionist', value: 'receptionist' },
    { label: 'Nurse', value: 'nurse' },
    { label: 'Technician', value: 'technician' },
    { label: 'Administrator', value: 'administrator' },
    { label: 'Manager', value: 'manager' }
  ];

  const fetchStaff = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff`);
      if (response.ok) {
        const data = await response.json();
        // Remove password field from data
        const staffData = (data.data || data).map((member: any) => {
          const { password, ...staffWithoutPassword } = member;
          return staffWithoutPassword;
        });
        setStaff(staffData);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      // Add mock data when API fails
      setStaff([
        {
          id: '1',
          fullName: 'John Smith',
          email: 'john.smith@hospital.com',
          phone: '+91 9876543210',
          position: 'receptionist',
          isActive: true
        },
        {
          id: '2',
          fullName: 'Sarah Johnson',
          email: 'sarah.j@hospital.com',
          phone: '+91 9876543211',
          position: 'nurse',
          isActive: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const updateStaff = async (staffId: string, field: string, value: any) => {
    console.log('Updating staff field:', staffId, field, value);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/${staffId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
      
      console.log('API Response:', response.status, response.statusText);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Update successful:', result);
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Updated successfully' });
        fetchStaff();
      } else {
        const error = await response.text();
        console.error('API Error:', response.status, error);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to update: ${response.status}` });
      }
    } catch (error: any) {
      console.error('Network Error:', error);
      toast.current?.show({ severity: 'error', summary: 'Network Error', detail: 'Could not connect to server' });
    }
  };

  const createEditableCell = (rowData: any, field: string, type: 'text' | 'dropdown' = 'text', options?: any[]) => {
    const isEditing = editingCell?.rowId === rowData.id && editingCell?.field === field;
    const value = rowData[field];
    
    const handleSave = (newValue: any) => {
      setEditingCell(null);
      if (newValue !== value) {
        updateStaff(rowData.id, field, newValue);
      }
    };
    
    if (isEditing) {
      if (type === 'dropdown') {
        return (
          <Dropdown
            value={value}
            options={options}
            onChange={(e) => handleSave(e.value)}
            onHide={() => setEditingCell(null)}
            autoFocus
            className="w-full p-inputtext-sm"
          />
        );
      } else {
        return (
          <InputText
            value={value || ''}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave(e.currentTarget.value);
              } else if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            onBlur={(e) => handleSave(e.target.value)}
            autoFocus
            className="w-full p-inputtext-sm"
          />
        );
      }
    }
    
    return (
      <div 
        className="cursor-pointer hover:bg-blue-50 p-2 border-round transition-colors min-h-2rem flex align-items-center"
        onClick={(e) => {
          e.stopPropagation();
          setEditingCell({rowId: rowData.id, field});
        }}
        title="Click to edit"
      >
        {value || 'Not set'}
      </div>
    );
  };

  const viewStaff = (staff: any) => {
    console.log('View staff clicked:', staff);
    setSelectedStaff(staff);
    setViewDialog(true);
  };

  const editStaff = (staff: any) => {
    console.log('Edit staff clicked:', staff);
    setSelectedStaff(staff);
    setEditFormData({
      fullName: staff.fullName,
      email: staff.email,
      phone: staff.phone,
      position: staff.position
    });
    setEditDialog(true);
  };

  const saveStaffEdit = async () => {
    console.log('Saving staff edit:', selectedStaff.id, editFormData);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/${selectedStaff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      
      console.log('API Response:', response.status, response.statusText);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Update successful:', result);
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Updated successfully' });
        fetchStaff();
        setEditDialog(false);
      } else {
        const error = await response.text();
        console.error('API Error:', response.status, error);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to update: ${response.status}` });
      }
    } catch (error: any) {
      console.error('Network Error:', error);
      toast.current?.show({ severity: 'error', summary: 'Network Error', detail: 'Could not connect to server' });
    }
  };

  const deleteStaff = (staff: any) => {
    console.log('Delete staff clicked:', staff);
    confirmDialog({
      message: `Are you sure you want to delete ${staff.fullName}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/${staff.id}`, {
            method: 'DELETE'
          });
          
          if (response.ok) {
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Staff deleted from database' });
            fetchStaff();
          } else {
            throw new Error('Failed to delete');
          }
        } catch (error: any) {
          console.log('API delete failed, using local delete:', error.message);
          
          // Fallback: Remove from local state only
          setStaff(prev => prev.filter((member: any) => member.id !== staff.id));
          
          toast.current?.show({ 
            severity: 'info', 
            summary: 'Local Delete', 
            detail: 'Staff removed from view only (database unchanged)' 
          });
        }
      }
    });
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <Button 
          icon="pi pi-eye" 
          className="p-button-rounded p-button-info p-button-sm" 
          tooltip="View Details"
          onClick={() => viewStaff(rowData)}
        />
        <Button 
          icon="pi pi-pencil" 
          className="p-button-rounded p-button-success p-button-sm" 
          tooltip="Edit Staff"
          onClick={() => editStaff(rowData)}
        />
        <Button 
          icon="pi pi-trash" 
          className="p-button-rounded p-button-danger p-button-sm" 
          tooltip="Delete Staff"
          onClick={() => deleteStaff(rowData)}
        />
      </div>
    );
  };

  const statusBodyTemplate = (rowData: any) => {
    return (
      <div className="flex align-items-center gap-2">
        <InputSwitch
          checked={rowData.isActive}
          onChange={(e) => {
            updateStaff(rowData.id, 'isActive', e.value);
          }}
          className="p-inputswitch-sm"
        />
        <Tag 
          value={rowData.isActive ? 'Active' : 'Inactive'} 
          severity={rowData.isActive ? 'success' : 'danger'} 
        />
      </div>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <AdminHeader />
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="max-w-full mx-auto">
          <Card className="shadow-3">
            <div className="flex align-items-center gap-3 mb-4">
              <i className="pi pi-users text-3xl text-green-500"></i>
              <div>
                <h2 className="text-2xl font-bold text-900 m-0">Staff Management</h2>
                <p className="text-600 m-0">Manage all staff members in the healthcare system</p>
              </div>
            </div>

            <Divider />

            <div className="flex justify-content-between align-items-center mb-4">
              <div className="flex align-items-center gap-2">
                <i className="pi pi-info-circle text-green-500"></i>
                <span className="text-600">Total Staff: {staff.length}</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  label="Back to Dashboard" 
                  icon="pi pi-arrow-left" 
                  className="p-button-outlined"
                  onClick={() => router.push('/')}
                />
                <Button 
                  label="Add New Staff" 
                  icon="pi pi-plus" 
                  className="bg-green-500 border-green-500"
                  onClick={() => router.push('/admin/add-staff')}
                />
              </div>
            </div>

            <DataTable 
              value={staff} 
              loading={loading} 
              paginator 
              rows={10}
              responsiveLayout="scroll"
              emptyMessage="No staff found in the system"
              className="p-datatable-gridlines"
              stripedRows
              showGridlines
            >
              <Column 
                field="fullName" 
                header="Full Name" 
                sortable 
                style={{ minWidth: '150px' }} 
                body={(rowData) => createEditableCell(rowData, 'fullName', 'text')}
              />
              <Column 
                field="email" 
                header="Email" 
                sortable 
                style={{ minWidth: '200px' }} 
                body={(rowData) => createEditableCell(rowData, 'email', 'text')}
              />
              <Column 
                field="phone" 
                header="Phone" 
                style={{ minWidth: '120px' }} 
                body={(rowData) => createEditableCell(rowData, 'phone', 'text')}
              />
              <Column 
                field="position" 
                header="Position" 
                sortable 
                style={{ minWidth: '130px' }} 
                body={(rowData) => createEditableCell(rowData, 'position', 'dropdown', positions)}
              />
              <Column 
                field="isActive" 
                header="Status" 
                body={statusBodyTemplate} 
                sortable 
                style={{ minWidth: '150px' }} 
              />
              <Column body={actionBodyTemplate} header="Actions" style={{ minWidth: '150px' }} />
            </DataTable>
          </Card>
        </div>
      </div>

      <ConfirmDialog />
      
      {/* View Staff Dialog */}
      <Dialog
        header="Staff Details"
        visible={viewDialog}
        onHide={() => setViewDialog(false)}
        style={{ width: '500px' }}
        modal
      >
        {selectedStaff && (
          <div className="grid">
            <div className="col-12">
              <div className="field">
                <label className="block text-600 font-medium mb-1">Full Name</label>
                <p className="text-900 m-0">{selectedStaff.fullName}</p>
              </div>
              <div className="field">
                <label className="block text-600 font-medium mb-1">Email</label>
                <p className="text-900 m-0">{selectedStaff.email}</p>
              </div>
              <div className="field">
                <label className="block text-600 font-medium mb-1">Phone</label>
                <p className="text-900 m-0">{selectedStaff.phone}</p>
              </div>
              <div className="field">
                <label className="block text-600 font-medium mb-1">Position</label>
                <p className="text-900 m-0">{selectedStaff.position}</p>
              </div>
              <div className="field">
                <label className="block text-600 font-medium mb-1">Status</label>
                <p className="text-900 m-0">{selectedStaff.isActive ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog
        header="Edit Staff"
        visible={editDialog}
        onHide={() => setEditDialog(false)}
        style={{ width: '500px' }}
        modal
      >
        <div className="flex flex-column gap-3">
          <div className="field">
            <label className="block text-900 font-medium mb-2">Full Name</label>
            <InputText
              value={editFormData.fullName || ''}
              onChange={(e) => setEditFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className="w-full"
            />
          </div>
          
          <div className="field">
            <label className="block text-900 font-medium mb-2">Email</label>
            <InputText
              value={editFormData.email || ''}
              onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full"
              type="email"
            />
          </div>
          
          <div className="field">
            <label className="block text-900 font-medium mb-2">Phone</label>
            <InputText
              value={editFormData.phone || ''}
              onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full"
            />
          </div>
          
          <div className="field">
            <label className="block text-900 font-medium mb-2">Position</label>
            <Dropdown
              value={editFormData.position}
              options={positions}
              onChange={(e) => setEditFormData(prev => ({ ...prev, position: e.value }))}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex justify-content-end gap-2 mt-4">
          <Button 
            label="Cancel" 
            icon="pi pi-times" 
            outlined 
            onClick={() => setEditDialog(false)} 
          />
          <Button 
            label="Save" 
            icon="pi pi-check" 
            onClick={saveStaffEdit}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default StaffPage;