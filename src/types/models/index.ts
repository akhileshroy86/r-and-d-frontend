export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'staff' | 'patient';
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  schedule: Schedule[];
  patients: Patient[];
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  medicalHistory: MedicalRecord[];
  appointments: Appointment[];
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  department: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  type: 'consultation' | 'follow-up' | 'emergency';
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  medications: Medication[];
  notes: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Schedule {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Analytics {
  totalPatients: number;
  totalAppointments: number;
  totalDoctors: number;
  totalStaff: number;
  todayAppointments: number;
  monthlyRevenue: number;
}