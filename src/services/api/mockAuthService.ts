import { LoginCredentials, RegisterData, PatientRegisterData } from './authService';

// Mock users database
const mockUsers = [
  { id: '1', email: 'admin@hospital.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { id: '2', email: 'doctor@hospital.com', password: 'doctor123', role: 'doctor', name: 'Dr. Smith' },
  { id: '3', email: 'staff@hospital.com', password: 'staff123', role: 'staff', name: 'Staff Member' },
  { id: '4', email: 'patient@hospital.com', password: 'patient123', role: 'patient', name: 'Patient User' }
];

// Function to get dynamic staff credentials
const getStaffCredentials = () => {
  try {
    const stored = localStorage.getItem('staffCredentials');
    if (!stored) {
      console.log('No staffCredentials in localStorage');
      return [];
    }
    const parsed = JSON.parse(stored);
    console.log('Staff credentials loaded:', parsed);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error parsing staff credentials:', error);
    return [];
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  login: async (credentials: LoginCredentials) => {
    await delay(500); // Simulate network delay
    
    console.log('=== MockAuthService Login Debug ===');
    console.log('Input credentials:', credentials);
    
    // Check static mock users first
    let user = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);
    console.log('Static user found:', user);
    
    // If not found in static users, check dynamic staff credentials
    if (!user) {
      const staffCredentials = getStaffCredentials();
      console.log('All staff credentials:', staffCredentials);
      
      for (const staffUser of staffCredentials) {
        console.log(`Comparing: "${staffUser.email}" === "${credentials.email}" && "${staffUser.password}" === "${credentials.password}"`);
        console.log('Email match:', staffUser.email === credentials.email);
        console.log('Password match:', staffUser.password === credentials.password);
        if (staffUser.email === credentials.email && staffUser.password === credentials.password) {
          user = staffUser;
          console.log('MATCH FOUND:', user);
          break;
        }
      }
    }
    
    if (!user) {
      console.log('=== LOGIN FAILED - No matching user ===');
      const error = new Error('Invalid email or password');
      (error as any).response = {
        data: { message: 'Invalid email or password' }
      };
      throw error;
    }

    console.log('=== LOGIN SUCCESS ===');
    const token = `mock-token-${user.id}-${Date.now()}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  },

  registerPatient: async (userData: PatientRegisterData) => {
    await delay(500);
    
    if (userData.password !== userData.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: String(mockUsers.length + 1),
      email: userData.email,
      password: userData.password,
      role: 'patient',
      name: userData.name
    };

    mockUsers.push(newUser);

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
    
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: String(mockUsers.length + 1),
      email: userData.email,
      password: userData.password,
      role: userData.role,
      name: userData.name
    };

    mockUsers.push(newUser);

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

  changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    await delay(500);
    
    // Check if user exists in static users
    const staticUser = mockUsers.find(u => u.id === userId);
    if (staticUser) {
      if (staticUser.password !== currentPassword) {
        throw new Error('Current password is incorrect');
      }
      staticUser.password = newPassword;
      
      // Update localStorage user if it's the current user
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.id === userId) {
        localStorage.setItem('user', JSON.stringify({ ...currentUser, password: newPassword }));
      }
      
      return { success: true, message: 'Password changed successfully' };
    }
    
    // Check staff credentials
    const staffCredentials = getStaffCredentials();
    const staffUser = staffCredentials.find((u: any) => u.id === userId);
    if (staffUser) {
      if (staffUser.password !== currentPassword) {
        throw new Error('Current password is incorrect');
      }
      
      // Update staff credentials
      const updatedStaff = staffCredentials.map((u: any) => 
        u.id === userId ? { ...u, password: newPassword } : u
      );
      localStorage.setItem('staffCredentials', JSON.stringify(updatedStaff));
      
      // Update localStorage user if it's the current user
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.id === userId) {
        localStorage.setItem('user', JSON.stringify({ ...currentUser, password: newPassword }));
      }
      
      return { success: true, message: 'Password changed successfully' };
    }
    
    throw new Error('User not found');
  }
};