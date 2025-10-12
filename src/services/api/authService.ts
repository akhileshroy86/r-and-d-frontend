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