import { apiClient } from './apiClient';
import { Doctor, Appointment } from '../../types/models';

export interface CreateAppointmentData {
  patientId: string;
  doctorId: string;
  date: string;
  timeRange: string;
  notes?: string;
  duration: number;
}

export const appointmentService = {
  // Fetch all doctors
  getDoctors: async (): Promise<Doctor[]> => {
    try {
      const response = await apiClient.get('/doctors');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return [];
    }
  },

  // Create new appointment
  createAppointment: async (appointmentData: CreateAppointmentData) => {
    try {
      const response = await apiClient.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Get all appointments
  getAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await apiClient.get('/appointments');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  },

  // Get appointments for a specific patient
  getPatientAppointments: async (patientId: string): Promise<Appointment[]> => {
    try {
      const response = await apiClient.get(`/appointments/patient/${patientId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
      return [];
    }
  }
};