import { apiClient } from './apiClient';

export interface AdminSignInCredentials {
  email: string;
  password: string;
}

export interface AdminSignUpData {
  name: string;
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  createdAt: string;
  isActive: boolean;
}

export interface AuthResponse {
  user: AdminUser;
  token: string;
  message: string;
}

export const adminAuthService = {
  signIn: async (credentials: AdminSignInCredentials): Promise<AuthResponse> => {
    // Always use mock for development
    console.log('AdminAuthService signIn called with:', credentials);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // Check test account
    console.log('Checking credentials:', credentials.email === 'admin@test.com', credentials.password === 'admin123');
    if (credentials.email === 'admin@test.com' && credentials.password === 'admin123') {
      const user = {
        id: '1',
        name: 'Admin User',
        email: credentials.email,
        role: 'admin' as const,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      const token = 'dev-token-' + Date.now();
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        user,
        token,
        message: 'Development login successful'
      };
    }
    
    // Check created accounts
    const accounts = JSON.parse(localStorage.getItem('dev_admin_accounts') || '[]');
    const account = accounts.find((acc: any) => 
      acc.email === credentials.email && acc.password === credentials.password
    );
    
    if (account) {
      const user = {
        id: account.id,
        name: account.name,
        email: account.email,
        role: 'admin' as const,
        createdAt: account.createdAt,
        isActive: account.isActive
      };
      const token = 'dev-token-' + Date.now();
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        user,
        token,
        message: 'Development login successful'
      };
    }
    
    const error = new Error('Invalid credentials');
    (error as any).response = {
      data: { message: 'Invalid email or password' }
    };
    throw error;
  },

  signUp: async (userData: AdminSignUpData): Promise<{ message: string }> => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      // Fallback for development - store account locally
      console.log('Signup API failed, using local storage:', error.message);
      
      const accounts = JSON.parse(localStorage.getItem('dev_admin_accounts') || '[]');
      
      // Check if email already exists
      if (accounts.find((acc: any) => acc.email === userData.email)) {
        throw new Error('Email already exists');
      }
      
      // Add new account
      accounts.push({
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'admin',
        createdAt: new Date().toISOString(),
        isActive: true
      });
      
      localStorage.setItem('dev_admin_accounts', JSON.stringify(accounts));
      return { message: 'Admin account created successfully (development mode)' };
    }
  },

  verifyToken: async (): Promise<AdminUser> => {
    try {
      const response = await apiClient.get('/admin/auth/verify');
      return response.data.user;
    } catch (error: any) {
      // Fallback for development
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          return JSON.parse(storedUser);
        }
      }
      throw error;
    }
  },

  refreshToken: async (): Promise<{ token: string }> => {
    try {
      const response = await apiClient.post('/admin/auth/refresh');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  signOut: async (): Promise<void> => {
    try {
      await apiClient.post('/admin/auth/signout');
    } catch (error) {
      // Ignore API errors for signout
      console.log('API signout failed, clearing local storage');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Password change failed');
      }
      
      // Password is updated on the server side, no need to update localStorage here
      
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Password change failed');
    }
  },

  getProfile: async (): Promise<AdminUser> => {
    try {
      const response = await apiClient.get('/admin/auth/profile');
      return response.data.user;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (profileData: Partial<AdminUser>): Promise<AdminUser> => {
    try {
      const response = await apiClient.put('/admin/auth/profile', profileData);
      return response.data.user;
    } catch (error: any) {
      // Fallback for development
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const updatedUser = { ...user, ...profileData };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          return updatedUser;
        }
      }
      throw error;
    }
  }
};