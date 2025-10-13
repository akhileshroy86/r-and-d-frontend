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
    const response = await fetch('/api/auth/staff/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
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