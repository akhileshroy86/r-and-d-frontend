export interface StaffLoginData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const staffAuthService = {
  login: async (data: StaffLoginData) => {
    try {
      const response = await fetch('http://localhost:3002/api/v1/auth/staff/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      console.error('Backend login error:', error);
      return { success: false, message: 'Cannot connect to backend server' };
    }
  },

  changePassword: async (data: ChangePasswordData & { email: string }) => {
    try {
      console.log('🔄 Password change request:', {
        email: data.email,
        hasCurrentPassword: !!data.currentPassword,
        hasNewPassword: !!data.newPassword,
        url: 'http://localhost:3002/api/v1/auth/staff/change-password'
      });
      
      const requestBody = {
        email: data.email,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      };
      
      console.log('📤 Request body:', requestBody);
      
      const response = await fetch('http://localhost:3002/api/v1/auth/staff/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);
      
      const result = await response.json();
      console.log('📥 Response body:', result);
      
      if (!response.ok) {
        console.error('❌ HTTP Error:', response.status, result);
        
        // Handle specific error cases
        if (response.status === 404 || (result.message && result.message.includes('User not found'))) {
          return { 
            success: false, 
            message: 'User not found in database. Please contact administrator to create your account.' 
          };
        }
        
        return { 
          success: false, 
          message: result.message || `HTTP ${response.status}: ${result.error || 'Password change failed'}` 
        };
      }
      
      return { 
        success: result.success || false, 
        message: result.message || 'Password changed successfully' 
      };
    } catch (error) {
      console.error('❌ Network error:', error);
      
      // Check if it's a connection error
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_INTERNET_DISCONNECTED')) {
        return { 
          success: false, 
          message: 'Cannot connect to backend server. Please ensure the server is running on localhost:3002' 
        };
      }
      
      return { success: false, message: `Network error: ${error.message}` };
    }
  },

  getProfile: async () => {
    const token = localStorage.getItem('staffToken');
    const response = await fetch('/api/staff/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};