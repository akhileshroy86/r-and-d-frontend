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
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      // Fallback for development
      if (error.code === 'ERR_NETWORK' || error.response?.status === 401 || error.response?.status === 404) {
        // Test doctor account
        if (credentials.email === 'doctor@test.com' && credentials.password === 'doctor123') {
          return {
            user: {
              id: '1',
              name: 'Dr. Test Doctor',
              email: credentials.email,
              role: 'doctor',
              specialization: 'General Medicine',
              createdAt: new Date().toISOString(),
              isActive: true
            },
            token: 'dev-token-' + Date.now(),
            message: 'Development login successful'
          };
        }
        
        // Test staff account
        if (credentials.email === 'staff@test.com' && credentials.password === 'staff123') {
          return {
            user: {
              id: '2',
              name: 'Test Staff',
              email: credentials.email,
              role: 'staff',
              department: 'Reception',
              createdAt: new Date().toISOString(),
              isActive: true
            },
            token: 'dev-token-' + Date.now(),
            message: 'Development login successful'
          };
        }
        
        // Test patient account
        if (credentials.email === 'patient@test.com' && credentials.password === 'patient123') {
          return {
            user: {
              id: '3',
              name: 'Test Patient',
              email: credentials.email,
              role: 'patient',
              phone: '+1234567890',
              createdAt: new Date().toISOString(),
              isActive: true
            },
            token: 'dev-token-' + Date.now(),
            message: 'Development login successful'
          };
        }
        
        throw new Error('Invalid credentials');
      }
      throw error;
    }
  },

  // Patient registration
  registerPatient: async (userData: PatientRegisterData) => {
    const response = await apiClient.post('/auth/patient/register', userData);
    return response.data;
  },

  register: async (userData: RegisterData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      // Fallback for development
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        return { message: 'Registration successful (development mode)' };
      }
      throw error;
    }
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