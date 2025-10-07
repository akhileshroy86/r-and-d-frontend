'use client';

import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import AdminHeader from './AdminHeader';
import { doctorService, DoctorData } from '../../services/api/doctorService';

const AddDoctor: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    qualification: '',
    department: '',
    specialization: '',
    experience: null,
    consultationFee: null,
    availableDays: [],
    startTime: null,
    endTime: null,
    lunchBreakStart: null,
    lunchBreakEnd: null,
    consultationDuration: null,
    maxPatientsPerDay: null
  });

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

  const validateForm = (): boolean => {
    const required = ['name', 'qualification', 'department', 'specialization', 'experience', 'consultationFee', 'startTime', 'endTime', 'consultationDuration', 'maxPatientsPerDay'];
    
    for (const field of required) {
      if (!formData[field as keyof typeof formData] || (Array.isArray(formData[field as keyof typeof formData]) && (formData[field as keyof typeof formData] as any[])?.length === 0)) {
        toast.current?.show({ severity: 'error', summary: 'Validation Error', detail: `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required` });
        return false;
      }
    }
    
    if (formData.availableDays.length === 0) {
      toast.current?.show({ severity: 'error', summary: 'Validation Error', detail: 'Please select at least one available day' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const doctorData: DoctorData = {
        name: formData.name,
        qualification: formData.qualification,
        department: formData.department,
        specialization: formData.specialization,
        experience: formData.experience!,
        consultationFee: formData.consultationFee!,
        availableDays: formData.availableDays,
        startTime: formData.startTime?.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) || '',
        endTime: formData.endTime?.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) || '',
        lunchBreakStart: formData.lunchBreakStart?.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        lunchBreakEnd: formData.lunchBreakEnd?.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        consultationDuration: formData.consultationDuration!,
        maxPatientsPerDay: formData.maxPatientsPerDay!
      };
      
      const response = await doctorService.addDoctor(doctorData);
      
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Doctor added successfully!' 
      });
      
      handleReset();
    } catch (error: any) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: error.response?.data?.message || 'Failed to add doctor' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      qualification: '',
      department: '',
      specialization: '',
      experience: null,
      consultationFee: null,
      availableDays: [],
      startTime: null,
      endTime: null,
      lunchBreakStart: null,
      lunchBreakEnd: null,
      consultationDuration: null,
      maxPatientsPerDay: null
    });
  };

  return (
    <div>
      <Toast ref={toast} />
      <AdminHeader />
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-3">
            <div className="flex align-items-center gap-3 mb-4">
              <i className="pi pi-user-plus text-3xl text-blue-500"></i>
              <div>
                <h2 className="text-2xl font-bold text-900 m-0">Add New Doctor</h2>
                <p className="text-600 m-0">Fill in the doctor's information and schedule details</p>
              </div>
            </div>

            <Divider />

            <div className="grid">
              {/* Personal Information */}
              <div className="col-12">
                <h3 className="text-lg font-semibold text-blue-600 mb-3">
                  <i className="pi pi-user mr-2"></i>Personal Information
                </h3>
              </div>

              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Full Name *</label>
                <InputText
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full"
                  placeholder="Enter doctor's full name"
                />
              </div>

              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Qualification *</label>
                <InputText
                  value={formData.qualification}
                  onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                  className="w-full"
                  placeholder="e.g., MBBS, MD, MS"
                />
              </div>

              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Department *</label>
                <Dropdown
                  value={formData.department}
                  options={departments}
                  onChange={(e) => setFormData({...formData, department: e.value})}
                  className="w-full"
                  placeholder="Select department"
                />
              </div>

              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Specialization *</label>
                <InputText
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  className="w-full"
                  placeholder="Enter specialization"
                />
              </div>

              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Years of Experience *</label>
                <InputNumber
                  value={formData.experience}
                  onValueChange={(e) => setFormData({...formData, experience: e.value})}
                  className="w-full"
                  placeholder="Enter years of experience"
                  min={0}
                  max={50}
                />
              </div>

              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Consultation Fee (₹) *</label>
                <InputNumber
                  value={formData.consultationFee}
                  onValueChange={(e) => setFormData({...formData, consultationFee: e.value})}
                  className="w-full"
                  placeholder="Enter consultation fee"
                  min={0}
                  mode="currency"
                  currency="INR"
                />
              </div>

              {/* Schedule Information */}
              <div className="col-12 mt-4">
                <h3 className="text-lg font-semibold text-green-600 mb-3">
                  <i className="pi pi-calendar mr-2"></i>Schedule Information
                </h3>
              </div>

              <div className="col-12">
                <label className="block text-900 font-medium mb-2">Available Days *</label>
                <MultiSelect
                  value={formData.availableDays}
                  options={daysOfWeek}
                  onChange={(e) => setFormData({...formData, availableDays: e.value})}
                  className="w-full"
                  placeholder="Select available days"
                  display="chip"
                />
              </div>

              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Start Time *</label>
                <Calendar
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.value})}
                  className="w-full"
                  timeOnly
                  placeholder="Select start time"
                />
              </div>

              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">End Time *</label>
                <Calendar
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.value})}
                  className="w-full"
                  timeOnly
                  placeholder="Select end time"
                />
              </div>

              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Lunch Break Start</label>
                <Calendar
                  value={formData.lunchBreakStart}
                  onChange={(e) => setFormData({...formData, lunchBreakStart: e.value})}
                  className="w-full"
                  timeOnly
                  placeholder="Select lunch break start"
                />
              </div>

              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Lunch Break End</label>
                <Calendar
                  value={formData.lunchBreakEnd}
                  onChange={(e) => setFormData({...formData, lunchBreakEnd: e.value})}
                  className="w-full"
                  timeOnly
                  placeholder="Select lunch break end"
                />
              </div>

              {/* Consultation Settings */}
              <div className="col-12 mt-4">
                <h3 className="text-lg font-semibold text-orange-600 mb-3">
                  <i className="pi pi-clock mr-2"></i>Consultation Settings
                </h3>
              </div>

              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Consultation Duration (minutes) *</label>
                <InputNumber
                  value={formData.consultationDuration}
                  onValueChange={(e) => setFormData({...formData, consultationDuration: e.value})}
                  className="w-full"
                  placeholder="Enter duration in minutes"
                  min={5}
                  max={120}
                  suffix=" min"
                />
              </div>

              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Maximum Patients per Day *</label>
                <InputNumber
                  value={formData.maxPatientsPerDay}
                  onValueChange={(e) => setFormData({...formData, maxPatientsPerDay: e.value})}
                  className="w-full"
                  placeholder="Enter max patients per day"
                  min={1}
                  max={100}
                />
              </div>

              {/* Action Buttons */}
              <div className="col-12 mt-5">
                <Divider />
                <div className="flex gap-3 justify-content-end">
                  <Button
                    label="Reset"
                    icon="pi pi-refresh"
                    className="p-button-outlined"
                    onClick={handleReset}
                  />
                  <Button
                    label="Save Doctor"
                    icon="pi pi-check"
                    className="bg-blue-500 border-blue-500"
                    onClick={handleSubmit}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;