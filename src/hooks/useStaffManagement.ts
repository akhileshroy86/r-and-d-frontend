import { useState, useCallback, useEffect } from 'react';

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

  const loadStaffList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/staff');
      const result = await response.json();
      
      if (result.success) {
        setStaffList(result.data.map((s: any) => ({
          id: s.id,
          fullName: s.fullName,
          email: s.email,
          phone: s.phone,
          position: s.position,
          isActive: s.isActive,
          createdAt: s.createdAt.split('T')[0],
          lastLogin: s.lastLogin
        })));
      }
    } catch (error: any) {
      setError('Failed to load staff list');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStaffList();
  }, [loadStaffList]);

  const addStaff = useCallback(async (formData: StaffFormData) => {
    setLoading(true);
    setError(null);
    try {
      const emailPrefix = formData.email.split('@')[0];
      const generatedPassword = emailPrefix.includes('.') ? emailPrefix.split('.')[0].toLowerCase() : emailPrefix.toLowerCase();
      
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || firstName;
      
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: formData.email,
          phone: formData.phone,
          position: formData.position,
          password: generatedPassword
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        const existingStaff = JSON.parse(localStorage.getItem('staffCredentials') || '[]');
        existingStaff.push({
          email: formData.email,
          password: generatedPassword,
          name: formData.fullName,
          role: 'staff',
          id: result.data.id
        });
        localStorage.setItem('staffCredentials', JSON.stringify(existingStaff));
        
        await loadStaffList();
        
        return { 
          success: true, 
          message: `Staff added successfully. Login: ${formData.email} | Password: ${generatedPassword}`,
          password: generatedPassword
        };
      } else {
        return { success: false, message: result.error || 'Failed to add staff' };
      }
    } catch (error: any) {
      setError('Failed to add staff');
      return { success: false, message: 'Failed to add staff' };
    } finally {
      setLoading(false);
    }
  }, [loadStaffList]);

  const updateStaff = useCallback(async (id: string, formData: Partial<StaffFormData>) => {
    setLoading(true);
    setError(null);
    try {
      setStaffList(prev => prev.map(staff => 
        staff.id === id ? { ...staff, ...formData } : staff
      ));
      
      return { success: true, message: 'Staff updated successfully' };
    } catch (error: any) {
      setError('Failed to update staff');
      return { success: false, message: 'Failed to update staff' };
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleStaffStatus = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      setStaffList(prev => prev.map(staff => 
        staff.id === id ? { ...staff, isActive: !staff.isActive } : staff
      ));
      
      return { success: true, message: 'Staff status updated successfully' };
    } catch (error: any) {
      setError('Failed to update staff status');
      return { success: false, message: 'Failed to update staff status' };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStaff = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const existingStaff = JSON.parse(localStorage.getItem('staffCredentials') || '[]');
      const updatedStaff = existingStaff.filter((s: any) => s.id !== id);
      localStorage.setItem('staffCredentials', JSON.stringify(updatedStaff));
      
      setStaffList(prev => prev.filter(staff => staff.id !== id));
      
      return { success: true, message: 'Staff deleted successfully' };
    } catch (error: any) {
      setError('Failed to delete staff');
      return { success: false, message: 'Failed to delete staff' };
    } finally {
      setLoading(false);
    }
  }, []);

  const changeStaffPassword = useCallback(async (staffId: string, currentPassword: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      const existingStaff = JSON.parse(localStorage.getItem('staffCredentials') || '[]');
      const updatedStaff = existingStaff.map((s: any) => 
        s.id === staffId ? { ...s, password: newPassword } : s
      );
      localStorage.setItem('staffCredentials', JSON.stringify(updatedStaff));
      
      return { success: true, message: 'Password changed successfully' };
    } catch (error: any) {
      setError('Failed to change password');
      return { success: false, message: 'Failed to change password' };
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