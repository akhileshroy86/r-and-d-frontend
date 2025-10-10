import { useState, useCallback, useEffect } from 'react';
import { staffService, StaffMember as ApiStaffMember } from '../services/api/staffService';

export interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  position?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  password?: string;
}

export interface StaffFormData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  password?: string;
}

export const useStaffManagement = () => {
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load staff list from API
  const loadStaffList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const staff = await staffService.getAllStaff();
      setStaffList(staff.map(s => ({
        id: s.id,
        fullName: s.fullName || `${s.firstName} ${s.lastName}`,
        email: s.email || s.user?.email || '',
        phone: s.phone,
        position: s.position,
        isActive: s.isActive ?? true,
        createdAt: s.createdAt || new Date().toISOString().split('T')[0],
        lastLogin: s.lastLogin
      })));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load staff list');
      console.error('Error loading staff:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load staff on mount
  useEffect(() => {
    loadStaffList();
  }, [loadStaffList]);

  const addStaff = useCallback(async (formData: StaffFormData) => {
    setLoading(true);
    setError(null);
    try {
      // Generate password from first name of email
      const emailParts = formData.email.split('@');
      const emailPrefix = emailParts[0];
      const firstName = emailPrefix.includes('.') ? emailPrefix.split('.')[0] : emailPrefix;
      const generatedPassword = firstName.toLowerCase();
      
      // Split full name into first and last name
      const nameParts = formData.fullName.trim().split(' ');
      const firstNameFromFull = nameParts[0];
      const lastNameFromFull = nameParts.slice(1).join(' ') || firstNameFromFull;
      
      const createData = {
        firstName: firstNameFromFull,
        lastName: lastNameFromFull,
        email: formData.email,
        phone: formData.phone,
        position: formData.position || 'Staff',
        password: generatedPassword
      };
      
      const newStaff = await staffService.createStaff(createData);
      
      // Store credentials for local login (fallback)
      const existingStaff = JSON.parse(localStorage.getItem('staffCredentials') || '[]');
      const newCredential = {
        email: formData.email,
        password: generatedPassword,
        name: formData.fullName,
        role: 'staff',
        id: newStaff.id
      };
      existingStaff.push(newCredential);
      localStorage.setItem('staffCredentials', JSON.stringify(existingStaff));
      
      // Add to local state
      const staffMember: StaffMember = {
        id: newStaff.id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        password: generatedPassword
      };
      
      setStaffList(prev => [...prev, staffMember]);
      
      return { 
        success: true, 
        message: `Staff added successfully. Login credentials - Email: ${formData.email}, Password: ${generatedPassword}`,
        password: generatedPassword
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add staff';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStaff = useCallback(async (id: string, formData: Partial<StaffFormData>) => {
    setLoading(true);
    setError(null);
    try {
      // Split full name if provided
      let updateData: any = {};
      if (formData.fullName) {
        const nameParts = formData.fullName.trim().split(' ');
        updateData.firstName = nameParts[0];
        updateData.lastName = nameParts.slice(1).join(' ') || nameParts[0];
      }
      if (formData.phone) updateData.phone = formData.phone;
      if (formData.position) updateData.position = formData.position;
      
      await staffService.updateStaff(id, updateData);
      
      // Update local state
      setStaffList(prev => prev.map(staff => {
        if (staff.id === id) {
          // Update staff credentials if email changed
          if (formData.email && formData.email !== staff.email) {
            const existingStaff = JSON.parse(localStorage.getItem('staffCredentials') || '[]');
            const updatedStaff = existingStaff.map((s: any) => 
              s.id === id ? { ...s, email: formData.email, name: formData.fullName || s.name } : s
            );
            localStorage.setItem('staffCredentials', JSON.stringify(updatedStaff));
          }
          return { ...staff, ...formData };
        }
        return staff;
      }));
      
      return { success: true, message: 'Staff updated successfully' };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update staff';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleStaffStatus = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await staffService.toggleStaffStatus(id);
      
      if (result.success) {
        // Update local state
        setStaffList(prev => prev.map(staff => 
          staff.id === id ? { ...staff, isActive: !staff.isActive } : staff
        ));
      }
      
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update staff status';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStaff = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await staffService.deleteStaff(id);
      
      if (result.success) {
        // Remove from staff credentials
        const existingStaff = JSON.parse(localStorage.getItem('staffCredentials') || '[]');
        const updatedStaff = existingStaff.filter((s: any) => s.id !== id);
        localStorage.setItem('staffCredentials', JSON.stringify(updatedStaff));
        
        // Update local state
        setStaffList(prev => prev.filter(staff => staff.id !== id));
      }
      
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete staff';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const changeStaffPassword = useCallback(async (staffId: string, currentPassword: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await staffService.changePassword(staffId, {
        currentPassword,
        newPassword
      });
      
      if (result.success) {
        // Update password in staff credentials
        const existingStaff = JSON.parse(localStorage.getItem('staffCredentials') || '[]');
        const updatedStaff = existingStaff.map((s: any) => 
          s.id === staffId ? { ...s, password: newPassword } : s
        );
        localStorage.setItem('staffCredentials', JSON.stringify(updatedStaff));
        
        // Update staff list with password change timestamp
        setStaffList(prev => prev.map(staff => 
          staff.id === staffId 
            ? { ...staff, password: newPassword, passwordChangedAt: new Date().toISOString() }
            : staff
        ));
      }
      
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    staffList,
    setStaffList,
    loading,
    error,
    addStaff,
    updateStaff,
    toggleStaffStatus,
    deleteStaff,
    changeStaffPassword,
    loadStaffList
  };
};