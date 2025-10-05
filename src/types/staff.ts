// Staff Dashboard Types
export interface StaffDashboardStats {
  totalCash: number;
  totalOnline: number;
  totalPatients: number;
  pendingPayments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  walkInPatients: number;
  avgWaitTime: number;
}

export interface EnhancedAppointment {
  id: string;
  patientName: string;
  phone: string;
  doctorName: string;
  department: string;
  time: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
  priority: 'normal' | 'high' | 'urgent';
  symptoms: string;
  estimatedDuration: number;
  queuePosition: number;
  patientId?: string;
  doctorId?: string;
  bookingId?: string;
}

export interface QueueData {
  doctorId: string;
  doctorName: string;
  department: string;
  currentPatient: string | null;
  waitingCount: number;
  avgWaitTime: string;
  status: 'active' | 'break' | 'offline';
  nextPatient: string | null;
  completedToday: number;
  efficiency: number;
}

export interface WalkInData {
  patientName: string;
  phone: string;
  doctorId: string;
  paymentMethod: 'cash' | 'upi' | 'card';
  symptoms: string;
  emergencyLevel: 'normal' | 'high' | 'urgent';
}

export interface SearchFilters {
  phone: string;
  name: string;
  doctorId: string;
  dateRange: Date[] | null;
  status: string[];
}

export interface ReportFilters {
  dateRange: Date[];
  reportType: 'daily' | 'weekly' | 'monthly' | 'custom';
  departments: string[];
}

export interface TimelineEvent {
  status: string;
  date: string;
  icon: string;
  color: string;
  patient: string;
  description?: string;
}

export interface DoctorOption {
  label: string;
  value: string;
  department: string;
  isAvailable?: boolean;
  currentLoad?: number;
}

export interface DepartmentOption {
  label: string;
  value: string;
  color?: string;
  icon?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }[];
}

export interface VoiceRecordingState {
  isRecording: boolean;
  transcript: string;
  confidence: number;
  suggestedDepartment?: string;
  error?: string;
}

export interface NotificationData {
  id: string;
  type: 'appointment' | 'payment' | 'emergency' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionRequired?: boolean;
}

export interface StaffPermissions {
  canManageAppointments: boolean;
  canManagePayments: boolean;
  canViewReports: boolean;
  canManageQueue: boolean;
  canAddWalkIns: boolean;
  canCancelAppointments: boolean;
  canViewPatientDetails: boolean;
}

export interface StaffProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'receptionist' | 'nurse' | 'admin_staff';
  department?: string;
  shift: 'morning' | 'afternoon' | 'night';
  permissions: StaffPermissions;
  isActive: boolean;
  lastLogin?: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form Validation Types
export interface FormErrors {
  [key: string]: string | undefined;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | undefined;
}

// Dashboard State Types
export interface DashboardState {
  loading: boolean;
  error: string | null;
  lastUpdated: Date;
  realTimeEnabled: boolean;
  selectedDate: Date;
  activeFilters: SearchFilters;
}

// Socket Event Types
export interface SocketEvents {
  'queue-updated': QueueData[];
  'appointment-created': EnhancedAppointment;
  'appointment-updated': EnhancedAppointment;
  'payment-received': { appointmentId: string; amount: number; method: string };
  'emergency-alert': { message: string; level: 'warning' | 'critical' };
  'doctor-status-changed': { doctorId: string; status: string };
}

// Export utility types
export type AppointmentStatus = EnhancedAppointment['status'];
export type PaymentStatus = EnhancedAppointment['paymentStatus'];
export type Priority = EnhancedAppointment['priority'];
export type QueueStatus = QueueData['status'];
export type PaymentMethod = WalkInData['paymentMethod'];
export type EmergencyLevel = WalkInData['emergencyLevel'];
export type ReportType = ReportFilters['reportType'];