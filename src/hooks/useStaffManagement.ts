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
    console.log('🔄 Loading staff list from backend...');
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3002/api/v1/staff');
      console.log('📥 Staff API response:', response.status, response.ok);
      const result = await response.json();
      console.log('📋 Staff data received:', result);
      
      if (response.ok && result) {
        const staffData = Array.isArray(result) ? result : result.data || [];
        setStaffList(staffData.map((s: any) => ({
          id: s.id,
          fullName: s.fullName,
          email: s.email,
          phone: s.phone,
          position: s.position,
          isActive: s.isActive !== false,
          createdAt: s.createdAt ? s.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          lastLogin: s.lastLogin
        })));
      }
    } catch (error: any) {
      setError('Failed to load staff list - Backend server may not be running');
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
      
      const response = await fetch('http://localhost:3002/api/v1/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          position: formData.position,
          password: generatedPassword
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        await loadStaffList();
        
        return { 
          success: true, 
          message: `Staff added successfully. Login: ${formData.email} | Password: ${generatedPassword}`,
          password: generatedPassword
        };
      } else {
        return { success: false, message: result.message || result.error || 'Failed to add staff' };
      }
    } catch (error: any) {
      setError('Failed to add staff - Backend server may not be running');
      return { success: false, message: 'Failed to add staff - Backend server may not be running' };
    } finally {
      setLoading(false);
    }
  }, [loadStaffList]);

  const updateStaff = useCallback(async (id: string, formData: Partial<StaffFormData>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3002/api/v1/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          position: formData.position
        })
      });
      
      const result = await response.json();
      
      if (result.success || response.ok) {
        await loadStaffList();
        return { success: true, message: 'Staff updated successfully' };
      } else {
        return { success: false, message: result.error || 'Failed to update staff' };
      }
    } catch (error: any) {
      setError('Failed to update staff');
      return { success: false, message: 'Failed to update staff' };
    } finally {
      setLoading(false);
    }
  }, [loadStaffList]);

  const toggleStaffStatus = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3002/api/v1/staff/${id}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success || response.ok) {
        await loadStaffList();
        return { success: true, message: 'Staff status updated successfully' };
      } else {
        return { success: false, message: result.error || 'Failed to update staff status' };
      }
    } catch (error: any) {
      setError('Failed to update staff status');
      return { success: false, message: 'Failed to update staff status' };
    } finally {
      setLoading(false);
    }
  }, [loadStaffList]);

  const deleteStaff = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3002/api/v1/staff/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success || response.ok) {
        await loadStaffList();
        return { success: true, message: 'Staff deleted successfully' };
      } else {
        return { success: false, message: result.error || 'Failed to delete staff' };
      }
    } catch (error: any) {
      setError('Failed to delete staff');
      return { success: false, message: 'Failed to delete staff' };
    } finally {
      setLoading(false);
    }
  }, [loadStaffList]);

  const changeStaffPassword = useCallback(async (email: string, currentPassword: string, newPassword: string) => {
    alert('Password change function called!');
    console.log('🔥 PASSWORD CHANGE FUNCTION CALLED!');
    console.log('🔥 Parameters:', { email, currentPassword, newPassword });
    setLoading(true);
    setError(null);
    try {
      console.log('🚀 Making API request to backend...');
      console.log('🚀 Frontend sending:', { email, currentPassword, newPassword });
      
      const response = await fetch('http://localhost:3002/api/v1/auth/staff/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          currentPassword,
          newPassword
        })
      });
      
      const result = await response.json();
      console.log('🚀 Backend response:', result);
      
      return {
        success: result.success || response.ok,
        message: result.message || 'Password changed successfully'
      };
    } catch (error: any) {
      console.error('🚀 Error:', error);
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