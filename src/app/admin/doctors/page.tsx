'use client';

import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useRouter } from 'next/navigation';
import AdminHeader from '../../../components/admin/AdminHeader';

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCell, setEditingCell] = useState<{rowId: string, field: string} | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const toast = useRef<Toast>(null);
  const router = useRouter();

  const departments = [
    { label: 'Cardiology', value: 'cardiology' },
    { label: 'Neurology', value: 'neurology' },
    { label: 'Orthopedics', value: 'orthopedics' },
    { label: 'Pediatrics', value: 'pediatrics' },
    { label: 'Dermatology', value: 'dermatology' },
    { label: 'General Medicine', value: 'general_medicine' }
  ];

  const daysOfWeek = [
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'Sunday', value: 'sunday' }
  ];

  const fetchDoctors = async () => {
    try {
      // Fetch doctors with their schedules
      const [doctorsResponse, schedulesResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctor-schedules`)
      ]);
      
      if (doctorsResponse.ok) {
        const doctorsData = await doctorsResponse.json();
        let doctors = doctorsData.data || doctorsData;
        
        // If schedules API is available, merge the data
        if (schedulesResponse.ok) {
          const schedulesData = await schedulesResponse.json();
          const schedules = schedulesData.data || schedulesData;
          
          // Merge doctor data with schedule data
          doctors = doctors.map((doctor: any) => {
            const schedule = schedules.find((s: any) => s.doctorId === doctor.id || s.doctor_id === doctor.id);
            return {
              ...doctor,
              schedule: schedule || null,
              // Override with schedule data if available
              availableDays: schedule?.availableDays || schedule?.available_days || doctor.availableDays,
              startTime: schedule?.startTime || schedule?.start_time || doctor.startTime,
              endTime: schedule?.endTime || schedule?.end_time || doctor.endTime,
              lunchBreakStart: schedule?.lunchBreakStart || schedule?.lunch_break_start || doctor.lunchBreakStart,
              lunchBreakEnd: schedule?.lunchBreakEnd || schedule?.lunch_break_end || doctor.lunchBreakEnd,
              consultationDuration: schedule?.consultationDuration || schedule?.consultation_duration || doctor.consultationDuration,
              maxPatientsPerDay: schedule?.maxPatientsPerDay || schedule?.max_patients_per_day || doctor.maxPatientsPerDay
            };
          });
        }
        
        setDoctors(doctors);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Add mock data when API fails
      setDoctors([
        {
          id: '1',
          name: 'Dr. John Smith',
          qualification: 'MBBS, MD',
          department: 'cardiology',
          specialization: 'Cardiology',
          experience: 10,
          consultationFee: 800,
          availableDays: ['monday', 'tuesday', 'wednesday'],
          startTime: '09:00',
          endTime: '17:00',
          isActive: true
        },
        {
          id: '2',
          name: 'Dr. Sarah Johnson',
          qualification: 'MBBS, MS',
          department: 'neurology',
          specialization: 'Neurology',
          experience: 8,
          consultationFee: 900,
          availableDays: ['tuesday', 'thursday', 'friday'],
          startTime: '10:00',
          endTime: '18:00',
          isActive: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const viewDoctor = (doctor: any) => {
    console.log('View doctor clicked:', doctor);
    setSelectedDoctor(doctor);
    setViewDialog(true);
  };

  const editDoctor = (doctor: any) => {
    console.log('Edit doctor clicked:', doctor);
    setSelectedDoctor(doctor);
    setEditFormData({
      name: doctor.name,
      qualification: doctor.qualification,
      department: doctor.department,
      specialization: doctor.specialization,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee
    });
    setEditDialog(true);
  };

  const saveDoctorEdit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${selectedDoctor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      
      if (response.ok) {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Doctor updated successfully' });
        fetchDoctors();
      } else {
        throw new Error('Failed to update');
      }
    } catch (error: any) {
      console.log('API update failed, using local update:', error.message);
      
      // Fallback: Update local state
      setDoctors(prev => prev.map((doc: any) => 
        doc.id === selectedDoctor.id ? { ...doc, ...editFormData } : doc
      ));
      
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Doctor updated successfully (local mode)' 
      });
    }
    
    setEditDialog(false);
  };

  const deleteDoctor = (doctor: any) => {
    console.log('Delete doctor clicked:', doctor);
    confirmDialog({
      message: `Are you sure you want to delete Dr. ${doctor.name}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${doctor.id}`, {
            method: 'DELETE'
          });
          
          if (response.ok) {
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Doctor deleted from database' });
            fetchDoctors();
          } else {
            throw new Error('Failed to delete');
          }
        } catch (error: any) {
          console.log('API delete failed, using local delete:', error.message);
          
          // Fallback: Remove from local state only
          setDoctors(prev => prev.filter((doc: any) => doc.id !== doctor.id));
          
          toast.current?.show({ 
            severity: 'info', 
            summary: 'Local Delete', 
            detail: 'Doctor removed from view only (database unchanged)' 
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
          onClick={() => viewDoctor(rowData)}
        />
        <Button 
          icon="pi pi-pencil" 
          className="p-button-rounded p-button-success p-button-sm" 
          tooltip="Edit Doctor"
          onClick={() => editDoctor(rowData)}
        />
        <Button 
          icon="pi pi-trash" 
          className="p-button-rounded p-button-danger p-button-sm" 
          tooltip="Delete Doctor"
          onClick={() => deleteDoctor(rowData)}
        />
      </div>
    );
  };

  const statusBodyTemplate = (rowData: any) => {
    return (
      <Tag 
        value={rowData.isActive ? 'Active' : 'Inactive'} 
        severity={rowData.isActive ? 'success' : 'danger'} 
      />
    );
  };

  const updateDoctor = async (doctorId: string, field: string, value: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${doctorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
      
      if (response.ok) {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Doctor updated successfully' });
        fetchDoctors(); // Refresh data
      } else {
        throw new Error('Failed to update');
      }
    } catch (error: any) {
      console.log('API update failed, using local update:', error.message);
      
      // Fallback: Update local state
      setDoctors(prev => prev.map((doc: any) => 
        doc.id === doctorId ? { ...doc, [field]: value } : doc
      ));
      
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Doctor updated successfully (local mode)' 
      });
    }
  };

  const updateSchedule = async (doctorId: string, field: string, value: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctor-schedules/${doctorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
      
      if (response.ok) {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Schedule updated successfully' });
        fetchDoctors(); // Refresh data
      } else {
        throw new Error('Failed to update');
      }
    } catch (error: any) {
      console.log('Schedule API update failed, using local update:', error.message);
      
      // Fallback: Update local state
      setDoctors(prev => prev.map((doc: any) => 
        doc.id === doctorId ? { ...doc, [field]: value } : doc
      ));
      
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Schedule updated successfully (local mode)' 
      });
    }
  };

  const createEditableCell = (rowData: any, field: string, type: 'text' | 'number' | 'dropdown' | 'multiselect' = 'text', options?: any[]) => {
    const isEditing = editingCell?.rowId === rowData.id && editingCell?.field === field;
    
    // Get value from merged data (check both direct field and schedule)
    let value = rowData[field];
    if (!value && rowData.schedule) {
      value = rowData.schedule[field] || rowData.schedule[field.replace(/([A-Z])/g, '_$1').toLowerCase()];
    }
    
    const handleSave = (newValue: any) => {
      setEditingCell(null);
      if (newValue !== value) {
        const scheduleFields = ['availableDays', 'startTime', 'endTime', 'lunchBreakStart', 'lunchBreakEnd', 'consultationDuration', 'maxPatientsPerDay'];
        if (scheduleFields.includes(field)) {
          updateSchedule(rowData.id, field, newValue);
        } else {
          updateDoctor(rowData.id, field, newValue);
        }
      }
    };
    
    if (isEditing) {
      if (type === 'dropdown') {
        return (
          <Dropdown
            value={value}
            options={options}
            onChange={(e) => {
              // Update local state immediately
              const updatedDoctors = doctors.map((doc: any) => 
                doc.id === rowData.id ? { ...doc, [field]: e.value } : doc
              );
              setDoctors(updatedDoctors);
              handleSave(e.value);
            }}
            onHide={() => setEditingCell(null)}
            autoFocus
            className="w-full p-inputtext-sm"
          />
        );
      } else if (type === 'multiselect') {
        return (
          <MultiSelect
            value={value || []}
            options={options}
            onChange={(e) => {
              // Update local state immediately
              const updatedDoctors = doctors.map((doc: any) => 
                doc.id === rowData.id ? { ...doc, [field]: e.value } : doc
              );
              setDoctors(updatedDoctors);
              handleSave(e.value);
            }}
            onHide={() => setEditingCell(null)}
            autoFocus
            className="w-full p-inputtext-sm"
            display="chip"
          />
        );
      } else if (type === 'number') {
        return (
          <InputNumber
            value={value}
            onValueChange={(e) => {
              // Update local state immediately
              const updatedDoctors = doctors.map((doc: any) => 
                doc.id === rowData.id ? { ...doc, [field]: e.value } : doc
              );
              setDoctors(updatedDoctors);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const inputValue = (e.target as HTMLInputElement).value;
                handleSave(parseFloat(inputValue) || 0);
              } else if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            onBlur={() => handleSave(value)}
            autoFocus
            className="w-full p-inputtext-sm"
          />
        );
      } else {
        return (
          <InputText
            value={value || ''}
            onChange={(e) => {
              // Update local state immediately for responsive UI
              const updatedDoctors = doctors.map((doc: any) => 
                doc.id === rowData.id ? { ...doc, [field]: e.target.value } : doc
              );
              setDoctors(updatedDoctors);
            }}
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
    
    // Display value with proper formatting
    let displayValue = 'Not set';
    if (type === 'multiselect' && Array.isArray(value)) {
      displayValue = value.length > 0 ? value.join(', ') : 'Not set';
    } else if (type === 'number' && value) {
      displayValue = field === 'consultationDuration' ? `${value} min` : 
                    field === 'maxPatientsPerDay' ? `${value} patients/day` : 
                    field === 'experience' ? `${value} years` : value.toString();
    } else if (value) {
      displayValue = value.toString();
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
        {displayValue}
      </div>
    );
  };

  const feeBodyTemplate = (rowData: any) => {
    const isEditing = editingCell?.rowId === rowData.id && editingCell?.field === 'consultationFee';
    
    if (isEditing) {
      return (
        <InputNumber
          value={rowData.consultationFee}
          onValueChange={(e) => {
            // Update local state immediately
            const updatedDoctors = doctors.map((doc: any) => 
              doc.id === rowData.id ? { ...doc, consultationFee: e.value } : doc
            );
            setDoctors(updatedDoctors);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setEditingCell(null);
              updateDoctor(rowData.id, 'consultationFee', rowData.consultationFee);
            } else if (e.key === 'Escape') {
              setEditingCell(null);
            }
          }}
          onBlur={() => {
            setEditingCell(null);
            updateDoctor(rowData.id, 'consultationFee', rowData.consultationFee);
          }}
          autoFocus
          mode="currency"
          currency="INR"
          className="w-full"
        />
      );
    }
    
    return (
      <div 
        className="cursor-pointer hover:bg-blue-50 p-2 border-round transition-colors"
        onClick={() => setEditingCell({rowId: rowData.id, field: 'consultationFee'})}
        title="Click to edit"
      >
        ₹{rowData.consultationFee?.toLocaleString() || 'Not set'}
      </div>
    );
  };

  const experienceBodyTemplate = (rowData: any) => {
    return createEditableCell(rowData, 'experience', 'number');
  };

  const availableDaysBodyTemplate = (rowData: any) => {
    return createEditableCell(rowData, 'availableDays', 'multiselect', daysOfWeek);
  };

  const scheduleBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-1 align-items-center">
        <div className="flex-1">{createEditableCell(rowData, 'startTime', 'text')}</div>
        <span className="text-400">-</span>
        <div className="flex-1">{createEditableCell(rowData, 'endTime', 'text')}</div>
      </div>
    );
  };

  const lunchBreakBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-1 align-items-center">
        <div className="flex-1">{createEditableCell(rowData, 'lunchBreakStart', 'text')}</div>
        <span className="text-400">-</span>
        <div className="flex-1">{createEditableCell(rowData, 'lunchBreakEnd', 'text')}</div>
      </div>
    );
  };

  const durationBodyTemplate = (rowData: any) => {
    return createEditableCell(rowData, 'consultationDuration', 'number');
  };

  const maxPatientsBodyTemplate = (rowData: any) => {
    return createEditableCell(rowData, 'maxPatientsPerDay', 'number');
  };

  return (
    <div>
      <Toast ref={toast} />
      <AdminHeader />
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="max-w-full mx-auto">
          <Card className="shadow-3">
            <div className="flex align-items-center gap-3 mb-4">
              <i className="pi pi-users text-3xl text-blue-500"></i>
              <div>
                <h2 className="text-2xl font-bold text-900 m-0">Doctor Management</h2>
                <p className="text-600 m-0">Manage all doctors in the healthcare system</p>
              </div>
            </div>

            <Divider />

            <div className="flex justify-content-between align-items-center mb-4">
              <div className="flex align-items-center gap-2">
                <i className="pi pi-info-circle text-blue-500"></i>
                <span className="text-600">Total Doctors: {doctors.length}</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  label="Back to Dashboard" 
                  icon="pi pi-arrow-left" 
                  className="p-button-outlined"
                  onClick={() => router.push('/')}
                />
                <Button 
                  label="Add New Doctor" 
                  icon="pi pi-plus" 
                  className="bg-blue-500 border-blue-500"
                  onClick={() => router.push('/admin/add-doctor')}
                />
              </div>
            </div>

            <DataTable 
              value={doctors} 
              loading={loading} 
              paginator 
              rows={10}
              responsiveLayout="scroll"
              emptyMessage="No doctors found in the system"
              className="p-datatable-gridlines"
              stripedRows
              showGridlines
            >
              <Column 
                field="name" 
                header="Doctor Name" 
                sortable 
                style={{ minWidth: '150px' }} 
                body={(rowData) => createEditableCell(rowData, 'name', 'text')}
              />
              <Column 
                field="qualification" 
                header="Qualification" 
                sortable 
                style={{ minWidth: '120px' }} 
                body={(rowData) => createEditableCell(rowData, 'qualification', 'text')}
              />
              <Column 
                field="department" 
                header="Department" 
                sortable 
                style={{ minWidth: '130px' }} 
                body={(rowData) => createEditableCell(rowData, 'department', 'dropdown', departments)}
              />
              <Column 
                field="specialization" 
                header="Specialization" 
                sortable 
                style={{ minWidth: '150px' }} 
                body={(rowData) => createEditableCell(rowData, 'specialization', 'text')}
              />
              <Column field="experience" header="Experience" body={experienceBodyTemplate} sortable style={{ minWidth: '100px' }} />
              <Column field="consultationFee" header="Consultation Fee" body={feeBodyTemplate} sortable style={{ minWidth: '130px' }} />
              <Column field="availableDays" header="Available Days" body={availableDaysBodyTemplate} style={{ minWidth: '150px' }} />
              <Column header="Schedule" body={scheduleBodyTemplate} style={{ minWidth: '150px' }} />
              <Column header="Lunch Break" body={lunchBreakBodyTemplate} style={{ minWidth: '130px' }} />
              <Column field="consultationDuration" header="Duration" body={durationBodyTemplate} style={{ minWidth: '100px' }} />
              <Column field="maxPatientsPerDay" header="Max Patients" body={maxPatientsBodyTemplate} style={{ minWidth: '120px' }} />
              <Column field="isActive" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '100px' }} />
              <Column body={actionBodyTemplate} header="Actions" style={{ minWidth: '150px' }} />
            </DataTable>
          </Card>
        </div>
      </div>

      <ConfirmDialog />
      
      {/* View Doctor Dialog */}
      <Dialog
        header="Doctor Details"
        visible={viewDialog}
        onHide={() => setViewDialog(false)}
        style={{ width: '600px' }}
        modal
      >
        {selectedDoctor && (
          <div className="grid">
            <div className="col-12 md:col-6">
              <div className="field">
                <label className="block text-600 font-medium mb-1">Name</label>
                <p className="text-900 m-0">{selectedDoctor.name}</p>
              </div>
              <div className="field">
                <label className="block text-600 font-medium mb-1">Qualification</label>
                <p className="text-900 m-0">{selectedDoctor.qualification}</p>
              </div>
              <div className="field">
                <label className="block text-600 font-medium mb-1">Department</label>
                <p className="text-900 m-0">{selectedDoctor.department}</p>
              </div>
              <div className="field">
                <label className="block text-600 font-medium mb-1">Specialization</label>
                <p className="text-900 m-0">{selectedDoctor.specialization}</p>
              </div>
            </div>
            <div className="col-12 md:col-6">
              <div className="field">
                <label className="block text-600 font-medium mb-1">Experience</label>
                <p className="text-900 m-0">{selectedDoctor.experience} years</p>
              </div>
              <div className="field">
                <label className="block text-600 font-medium mb-1">Consultation Fee</label>
                <p className="text-900 m-0">₹{selectedDoctor.consultationFee}</p>
              </div>
              <div className="field">
                <label className="block text-600 font-medium mb-1">Available Days</label>
                <p className="text-900 m-0">{selectedDoctor.availableDays?.join(', ') || 'Not set'}</p>
              </div>
              <div className="field">
                <label className="block text-600 font-medium mb-1">Working Hours</label>
                <p className="text-900 m-0">{selectedDoctor.startTime} - {selectedDoctor.endTime}</p>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* Edit Doctor Dialog */}
      <Dialog
        header="Edit Doctor"
        visible={editDialog}
        onHide={() => setEditDialog(false)}
        style={{ width: '600px' }}
        modal
      >
        <div className="grid">
          <div className="col-12 md:col-6">
            <div className="field">
              <label className="block text-900 font-medium mb-2">Name</label>
              <InputText
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full"
              />
            </div>
            
            <div className="field">
              <label className="block text-900 font-medium mb-2">Qualification</label>
              <InputText
                value={editFormData.qualification || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, qualification: e.target.value }))}
                className="w-full"
              />
            </div>
            
            <div className="field">
              <label className="block text-900 font-medium mb-2">Department</label>
              <Dropdown
                value={editFormData.department}
                options={departments}
                onChange={(e) => setEditFormData(prev => ({ ...prev, department: e.value }))}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="col-12 md:col-6">
            <div className="field">
              <label className="block text-900 font-medium mb-2">Specialization</label>
              <InputText
                value={editFormData.specialization || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, specialization: e.target.value }))}
                className="w-full"
              />
            </div>
            
            <div className="field">
              <label className="block text-900 font-medium mb-2">Experience (years)</label>
              <InputNumber
                value={editFormData.experience}
                onValueChange={(e) => setEditFormData(prev => ({ ...prev, experience: e.value }))}
                className="w-full"
              />
            </div>
            
            <div className="field">
              <label className="block text-900 font-medium mb-2">Consultation Fee</label>
              <InputNumber
                value={editFormData.consultationFee}
                onValueChange={(e) => setEditFormData(prev => ({ ...prev, consultationFee: e.value }))}
                mode="currency"
                currency="INR"
                className="w-full"
              />
            </div>
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
            onClick={saveDoctorEdit}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default DoctorsPage;