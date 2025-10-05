import { useState, useCallback } from 'react';

export interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface StaffFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export const useStaffManagement = () => {
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);

  const addStaff = useCallback(async (formData: StaffFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStaff: StaffMember = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setStaffList(prev => [...prev, newStaff]);
      return { success: true, message: 'Staff added successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to add staff' };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStaff = useCallback(async (id: string, formData: Partial<StaffFormData>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setStaffList(prev => prev.map(staff => 
        staff.id === id 
          ? { ...staff, ...formData, updatedAt: new Date().toISOString() }
          : staff
      ));
      
      return { success: true, message: 'Staff updated successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to update staff' };
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleStaffStatus = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStaffList(prev => prev.map(staff => 
        staff.id === id ? { ...staff, isActive: !staff.isActive } : staff
      ));
      
      return { success: true, message: 'Staff status updated successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to update staff status' };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStaff = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setStaffList(prev => prev.filter(staff => staff.id !== id));
      return { success: true, message: 'Staff deleted successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to delete staff' };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    staffList,
    setStaffList,
    loading,
    addStaff,
    updateStaff,
    toggleStaffStatus,
    deleteStaff
  };
};