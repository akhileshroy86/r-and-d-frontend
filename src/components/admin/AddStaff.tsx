'use client';

import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { InputSwitch } from 'primereact/inputswitch';
import { Dropdown } from 'primereact/dropdown';
import AdminHeader from './AdminHeader';

const AddStaff: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  
  const positionOptions = [
    { label: 'Reception', value: 'reception' },
    { label: 'Queue Management', value: 'queue_management' },
    { label: 'Lab Assistant', value: 'lab_assistant' },
    { label: 'Pharmacy', value: 'pharmacy' },
    { label: 'Billing', value: 'billing' }
  ];
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    position: '',
    isActive: true
  });

  const validateForm = (): boolean => {
    const required = ['fullName', 'email', 'phoneNumber', 'position'];
    
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast.current?.show({ 
          severity: 'error', 
          summary: 'Validation Error', 
          detail: `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required` 
        });
        return false;
      }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Validation Error', 
        detail: 'Please enter a valid email address' 
      });
      return false;
    }
    
    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Validation Error', 
        detail: 'Please enter a valid 10-digit phone number' 
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Generate password from first name
      const generatedPassword = formData.fullName.split(' ')[0].toLowerCase();
      
      // Store in localStorage using same format as StaffManagement
      const existingStaff = JSON.parse(localStorage.getItem('staffCredentials') || '[]');
      const newStaff = {
        id: `staff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: formData.email,
        password: generatedPassword,
        name: formData.fullName,
        phone: formData.phoneNumber,
        position: formData.position,
        role: 'staff',
        isActive: formData.isActive
      };
      
      // Call backend directly
      const response = await fetch('http://localhost:3002/api/v1/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.fullName.split(' ')[0],
          lastName: formData.fullName.split(' ').slice(1).join(' ') || formData.fullName.split(' ')[0],
          fullName: formData.fullName,
          email: formData.email,
          password: generatedPassword,
          phone: formData.phoneNumber,
          position: formData.position
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Staff creation failed:', errorData);
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: Failed to save to database`);
      }
      
      // Also save to localStorage for immediate display
      const filteredStaff = existingStaff.filter((s: any) => s.email !== formData.email);
      filteredStaff.push(newStaff);
      localStorage.setItem('staffCredentials', JSON.stringify(filteredStaff));
      
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: `Staff member added successfully! Login: ${formData.email} | Password: ${generatedPassword}`,
        life: 8000
      });
      handleReset();
    } catch (error: any) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: error.message || 'Failed to add staff member' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      position: '',
      isActive: true
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
              <i className="pi pi-users text-3xl text-blue-500"></i>
              <div>
                <h2 className="text-2xl font-bold text-900 m-0">Add New Staff</h2>
                <p className="text-600 m-0">Add reception staff member details</p>
              </div>
            </div>

            <Divider />

            <div className="grid">
              {/* Staff Information */}
              <div className="col-12">
                <h3 className="text-lg font-semibold text-blue-600 mb-3">
                  <i className="pi pi-user mr-2"></i>Staff Information
                </h3>
              </div>

              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Full Name *</label>
                <InputText
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full"
                  placeholder="Enter staff member's full name"
                />
              </div>

              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Email Address (Login ID) *</label>
                <InputText
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full"
                  placeholder="Enter email address"
                  type="email"
                />
              </div>

              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Phone Number *</label>
                <InputText
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full"
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                />
              </div>

              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Position *</label>
                <Dropdown
                  value={formData.position}
                  options={positionOptions}
                  onChange={(e) => setFormData({...formData, position: e.value})}
                  className="w-full"
                  placeholder="Select position"
                />
              </div>

              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Account Status</label>
                <div className="flex align-items-center gap-3 p-3 border-1 surface-border border-round">
                  <InputSwitch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.value})}
                    className="mr-2"
                  />
                  <div className="flex align-items-center gap-2">
                    <i className={`pi ${formData.isActive ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'}`}></i>
                    <span className={`font-medium ${formData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <small className="text-500 ml-2">
                    {formData.isActive ? 'Staff can login and access system' : 'Staff login is disabled'}
                  </small>
                </div>
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
                    label="Save Staff"
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

export default AddStaff;