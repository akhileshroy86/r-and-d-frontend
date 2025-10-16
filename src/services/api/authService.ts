import { apiClient } from './apiClient';

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
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Patient registration
  registerPatient: async (userData: PatientRegisterData) => {
    const response = await apiClient.post('/auth/register', {
      ...userData,
      role: 'patient'
    });
    return response.data;
  },

  register: async (userData: RegisterData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    const response = await apiClient.post('/auth/change-password', {
      userId,
      currentPassword,
      newPassword
    });
    return response.data;
  }
};