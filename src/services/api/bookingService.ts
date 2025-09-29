import { apiClient } from './apiClient';
import { Booking, Queue } from '../../types/models';

export const bookingService = {
  createBooking: async (bookingData: Partial<Booking>): Promise<Booking> => {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    const response = await apiClient.get(`/bookings/user/${userId}`);
    return response.data;
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  cancelBooking: async (id: string): Promise<Booking> => {
    const response = await apiClient.patch(`/bookings/${id}/cancel`);
    return response.data;
  },

  getQueueStatus: async (doctorId: string): Promise<Queue> => {
    const response = await apiClient.get(`/queue/doctor/${doctorId}`);
    return response.data;
  },

  addWalkInPatient: async (walkInData: any): Promise<Booking> => {
    const response = await apiClient.post('/bookings/walk-in', walkInData);
    return response.data;
  },
};