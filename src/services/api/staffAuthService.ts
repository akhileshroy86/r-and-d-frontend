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
    // Get staff credentials from localStorage to pass to API
    const staffCredentials = localStorage.getItem('staffCredentials') || '[]';
    
    const response = await fetch('/api/auth/staff/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-staff-credentials': staffCredentials
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  changePassword: async (data: ChangePasswordData) => {
    const token = localStorage.getItem('staffToken');
    const response = await fetch('/api/auth/staff/change-password', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ...data, token })
    });
    return response.json();
  },

  getProfile: async () => {
    const token = localStorage.getItem('staffToken');
    const response = await fetch('/api/staff/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};