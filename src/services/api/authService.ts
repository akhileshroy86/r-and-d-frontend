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

export const authService = {
  // Login for all user types
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Patient registration
  registerPatient: async (userData: PatientRegisterData) => {
    const response = await apiClient.post('/auth/patient/register', userData);
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
  }
};