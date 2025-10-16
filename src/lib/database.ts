// Database utility functions for password management
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
}

// Simulate database operations for development
export class DatabaseService {
  private static getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    const adminUsers = JSON.parse(localStorage.getItem('dev_admin_accounts') || '[]');
    const staffUsers = JSON.parse(localStorage.getItem('dev_staff_accounts') || '[]');
    return [...adminUsers, ...staffUsers];
  }

  private static saveUsers(users: User[]): void {
    if (typeof window === 'undefined') return;
    const adminUsers = users.filter(user => user.role === 'admin');
    const staffUsers = users.filter(user => user.role === 'staff');
    localStorage.setItem('dev_admin_accounts', JSON.stringify(adminUsers));
    localStorage.setItem('dev_staff_accounts', JSON.stringify(staffUsers));
  }

  static async findUserById(id: string): Promise<User | null> {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  static async updateUserPassword(id: string, newPassword: string): Promise<boolean> {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) return false;

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    users[userIndex].password = hashedPassword;
    users[userIndex].updatedAt = new Date().toISOString();
    
    this.saveUsers(users);
    return true;
  }

  static async verifyPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.find(user => user.email === userData.email)) {
      throw new Error('Email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    
    return newUser;
  }
}