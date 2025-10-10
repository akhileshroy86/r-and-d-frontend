import { apiClient } from './apiClient';

export interface StaffMember {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email?: string;
  phone: string;
  position: string;
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface CreateStaffData {
  firstName: string;
  lastName: string;
  phone: string;
  position: string;
  email: string;
  password: string;
}

export interface UpdateStaffData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  position?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const staffService = {
  // Create new staff member
  createStaff: async (data: CreateStaffData): Promise<StaffMember> => {
    // First create user account
    const userResponse = await apiClient.post('/users', {
      email: data.email,
      password: data.password,
      role: 'STAFF'
    });

    // Then create staff profile
    const staffResponse = await apiClient.post('/staff', {
      userId: userResponse.data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      position: data.position
    });

    return {
      ...staffResponse.data,
      fullName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      isActive: true
    };
  },

  // Get all staff members
  getAllStaff: async (): Promise<StaffMember[]> => {
    const response = await apiClient.get('/staff');
    return response.data.map((staff: any) => ({
      ...staff,
      fullName: `${staff.firstName} ${staff.lastName}`,
      email: staff.user?.email,
      isActive: staff.user?.isActive ?? true
    }));
  },

  // Get staff by ID
  getStaffById: async (id: string): Promise<StaffMember> => {
    const response = await apiClient.get(`/staff/${id}`);
    return {
      ...response.data,
      fullName: `${response.data.firstName} ${response.data.lastName}`,
      email: response.data.user?.email,
      isActive: response.data.user?.isActive ?? true
    };
  },

  // Get staff profile by user ID
  getStaffProfile: async (userId: string): Promise<StaffMember> => {
    const response = await apiClient.get(`/staff/profile/${userId}`);
    return {
      ...response.data,
      fullName: response.data.fullName || `${response.data.firstName} ${response.data.lastName}`,
      isActive: response.data.isActive
    };
  },

  // Update staff member
  updateStaff: async (id: string, data: UpdateStaffData): Promise<StaffMember> => {
    const response = await apiClient.put(`/staff/${id}`, data);
    return {
      ...response.data,
      fullName: `${response.data.firstName} ${response.data.lastName}`
    };
  },

  // Toggle staff status (activate/deactivate)
  toggleStaffStatus: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      await apiClient.patch(`/staff/${id}/toggle-status`);
      return { success: true, message: 'Staff status updated successfully' };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update staff status' 
      };
    }
  },

  // Delete staff member
  deleteStaff: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      await apiClient.delete(`/staff/${id}`);
      return { success: true, message: 'Staff deleted successfully' };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete staff' 
      };
    }
  },

  // Change staff password
  changePassword: async (staffId: string, data: ChangePasswordData): Promise<{ success: boolean; message: string }> => {
    try {
      await apiClient.post(`/staff/${staffId}/change-password`, data);
      return { success: true, message: 'Password changed successfully' };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to change password' 
      };
    }
  }
};