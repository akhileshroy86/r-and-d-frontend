import { LoginCredentials, RegisterData, PatientRegisterData } from './authService';

// Static mock users database
const staticMockUsers = [
  { id: '1', email: 'admin@hospital.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { id: '2', email: 'doctor@hospital.com', password: 'doctor123', role: 'doctor', name: 'Dr. Smith' },
  { id: '3', email: 'staff@hospital.com', password: 'staff123', role: 'staff', name: 'Staff Member' },
  { id: '4', email: 'patient@hospital.com', password: 'patient123', role: 'patient', name: 'Patient User' }
];

// Function to get registered patients from localStorage
const getRegisteredPatients = () => {
  try {
    const stored = localStorage.getItem('registeredPatients');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error parsing registered patients:', error);
    return [];
  }
};

// Function to save registered patient to localStorage
const saveRegisteredPatient = (patient: any) => {
  try {
    const existing = getRegisteredPatients();
    const updated = [...existing, patient];
    localStorage.setItem('registeredPatients', JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving registered patient:', error);
  }
};

// Function to get all users (static + registered patients + staff)
const getAllUsers = () => {
  const registeredPatients = getRegisteredPatients();
  const staffCredentials = getStaffCredentials();
  return [...staticMockUsers, ...registeredPatients, ...staffCredentials];
};

// Function to get dynamic staff credentials - DISABLED FOR DATABASE USAGE
const getStaffCredentials = () => {
  console.log('Staff credentials loading DISABLED - using database only');
  return [];
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  login: async (credentials: LoginCredentials) => {
    throw new Error('Mock service disabled - use real backend database');
  },

  changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // For staff users, use staffAuthService which connects to the database
      if (user.role === 'staff' || user.role === 'STAFF') {
        const { staffAuthService } = await import('./staffAuthService');
        return await staffAuthService.changePassword({
          email: user.email,
          currentPassword,
          newPassword
        });
      }
      
      // For other users, use the API endpoint
      const token = localStorage.getItem('token');
      const endpoint = user.role === 'admin' ? '/api/admin/change-password' : '/api/staff/change-password';
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-id': user.id,
          'x-user-email': user.email
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
      
      return { success: true, message: data.message };
    } catch (error: any) {
      throw new Error(error.message || 'Password change failed');
    }
  },

  registerPatient: async (userData: PatientRegisterData) => {
    await delay(500);
    
    if (userData.password !== userData.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Check if user already exists in any user list
    const allUsers = getAllUsers();
    const existingUser = allUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: `patient_${Date.now()}`,
      email: userData.email,
      password: userData.password,
      role: 'patient',
      name: userData.name
    };

    // Save to localStorage instead of in-memory array
    saveRegisteredPatient(newUser);

    return {
      success: true,
      message: 'Patient registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    };
  },

  register: async (userData: RegisterData) => {
    await delay(500);
    
    // Check if user already exists in any user list
    const allUsers = getAllUsers();
    const existingUser = allUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      name: userData.name
    };

    // Save to appropriate storage based on role
    if (userData.role === 'patient') {
      saveRegisteredPatient(newUser);
    } else {
      // For other roles, you might want to save to staffCredentials or handle differently
      const staffCredentials = getStaffCredentials();
      const updated = [...staffCredentials, newUser];
      localStorage.setItem('staffCredentials', JSON.stringify(updated));
    }

    return {
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    };
  },

  logout: async () => {
    await delay(200);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true, message: 'Logged out successfully' };
  },

  refreshToken: async () => {
    await delay(200);
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    return { success: true, token };
  },

  getProfile: async () => {
    await delay(200);
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('No user found');
    }
    return { success: true, user: JSON.parse(userStr) };
  },


};