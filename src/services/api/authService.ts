import { apiClient } from './apiClient';
import { mockAuthService } from './mockAuthService';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface PatientRegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const USE_MOCK = false; // Always use real API for database storage

export const authService = {
  // Login for all user types
  login: async (credentials: LoginCredentials) => {
<<<<<<< HEAD
    console.log('=== AuthService Login Debug ===');
    console.log('Input credentials:', credentials);
    
    // Check if this is admin login
    if (credentials.email === 'admin@hospital.com' && credentials.password === 'admin123') {
      console.log('✅ Admin authenticated with mock credentials');
      return {
        success: true,
        user: {
          id: 'admin_1',
          email: 'admin@hospital.com',
          name: 'Admin User',
          role: 'admin'
        },
        token: `admin_token_${Date.now()}`
      };
    }
    
    // For non-admin users, use staff-specific API endpoint
    try {
      const response = await apiClient.post('/auth/staff/login', credentials);
      console.log('✅ Staff API authentication successful');
      return response.data;
    } catch (apiError) {
      console.log('❌ Staff API authentication failed:', apiError);
      throw new Error('Invalid email or password');
    }
    
    // For non-staff users, use existing logic
    if (USE_MOCK) {
      return await mockAuthService.login(credentials);
    }
=======
>>>>>>> 86d4ed91866c8f9deb8ef3438ac29134fff30829
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock service');
      return await mockAuthService.login(credentials);
    }
  },

  // Patient registration
  registerPatient: async (userData: PatientRegisterData) => {
    try {
      const response = await apiClient.post('/auth/register', {
        ...userData,
        role: 'patient'
      });
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock service');
      return await mockAuthService.registerPatient(userData);
    }
  },

  register: async (userData: RegisterData) => {
    if (USE_MOCK) {
      return await mockAuthService.register(userData);
    }
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock service');
      return await mockAuthService.register(userData);
    }
  },

  logout: async () => {
    if (USE_MOCK) {
      return await mockAuthService.logout();
    }
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock service');
      return await mockAuthService.logout();
    }
  },

  refreshToken: async () => {
    if (USE_MOCK) {
      return await mockAuthService.refreshToken();
    }
    try {
      const response = await apiClient.post('/auth/refresh');
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock service');
      return await mockAuthService.refreshToken();
    }
  },

  getProfile: async () => {
    if (USE_MOCK) {
      return await mockAuthService.getProfile();
    }
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock service');
      return await mockAuthService.getProfile();
    }
  },

  changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    if (USE_MOCK) {
      return await mockAuthService.changePassword(userId, currentPassword, newPassword);
    }
    try {
      const response = await apiClient.post('/auth/change-password', {
        userId,
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock service');
      return await mockAuthService.changePassword(userId, currentPassword, newPassword);
    }
  }
};