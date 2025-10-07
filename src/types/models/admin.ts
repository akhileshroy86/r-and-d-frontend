export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lastLogin?: string;
  permissions: AdminPermission[];
}

export interface AdminPermission {
  id: string;
  name: string;
  description: string;
  module: string;
  actions: string[];
}

export interface AdminSignInRequest {
  email: string;
  password: string;
}

export interface AdminSignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  user: Admin;
  token: string;
  refreshToken: string;
  expiresIn: number;
  message: string;
}

export interface AdminProfileUpdate {
  name?: string;
  email?: string;
}

export interface AdminPasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}