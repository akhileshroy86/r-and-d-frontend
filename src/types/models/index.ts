export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'staff' | 'patient';
  phone: string;
  language: 'en' | 'te' | 'hi' | 'mr' | 'gu';
  createdAt: string;
  updatedAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  status: 'open' | 'closed';
  departments: Department[];
  location: {
    latitude: number;
    longitude: number;
  };
  operatingHours: {
    open: string;
    close: string;
  };
}

export interface Department {
  id: string;
  name: string;
  hospitalId: string;
  description: string;
  symptoms: string[];
}

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  departmentId: string;
  specialization: string;
  email: string;
  phone: string;
  experience: number;
  consultationFee: number;
  rating: number;
  schedule: DoctorSchedule;
  maxPatientsPerDay: number;
  consultationDuration: number;
}

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  availableDays: string[];
  startTime: string;
  endTime: string;
  lunchBreak: {
    start: string;
    end: string;
  };
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  language: string;
  medicalHistory: MedicalRecord[];
  appointments: Appointment[];
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  hospitalId: string;
  isActive: boolean;
}

export interface Booking {
  id: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  timeRange: {
    start: string;
    end: string;
  };
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentId?: string;
  queuePosition?: number;
  estimatedWaitTime?: number;
  symptoms?: string;
  isWalkIn: boolean;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'online' | 'cash' | 'upi';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  transactionId: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  bookingId: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  date: string;
  timeRange: {
    start: string;
    end: string;
  };
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  type: 'consultation' | 'follow-up' | 'revisit';
  queuePosition: number;
  estimatedWaitTime: number;
}

export interface Queue {
  id: string;
  doctorId: string;
  date: string;
  patients: QueuePatient[];
  currentPosition: number;
  averageConsultationTime: number;
}

export interface QueuePatient {
  bookingId: string;
  patientName: string;
  position: number;
  estimatedTime: string;
  status: 'waiting' | 'in-consultation' | 'completed';
}

export interface Review {
  id: string;
  patientId: string;
  doctorId?: string;
  hospitalId?: string;
  bookingId: string;
  rating: number;
  comment: string;
  isAnonymous: boolean;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  medications: Medication[];
  notes: string;
  followUpRequired: boolean;
  followUpDate?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Analytics {
  totalPatients: number;
  totalAppointments: number;
  totalDoctors: number;
  totalStaff: number;
  todayAppointments: number;
  todayRevenue: number;
  monthlyRevenue: number;
  onlinePayments: number;
  offlinePayments: number;
  topDepartments: { name: string; revenue: number }[];
}

export interface SearchFilters {
  type: 'all' | 'hospitals' | 'doctors' | 'symptoms';
  department?: string;
  language?: string;
  feeRange?: { min: number; max: number };
  rating?: number;
  availability?: boolean;
  sortBy: 'relevance' | 'rating' | 'fee' | 'popularity';
}

export interface VoiceRecording {
  id: string;
  audioBlob: Blob;
  transcription?: string;
  suggestedDepartment?: string;
  confidence?: number;
}