import { apiClient } from './apiClient';
import { Payment } from '../../types/models';

export const paymentService = {
  createPaymentOrder: async (paymentData: { bookingId: string; amount: number }): Promise<Payment> => {
    const response = await apiClient.post('/payments/create-order', paymentData);
    return response.data;
  },

  verifyPayment: async (verificationData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<Payment> => {
    const response = await apiClient.post('/payments/verify', verificationData);
    return response.data;
  },

  getPaymentHistory: async (userId: string): Promise<Payment[]> => {
    const response = await apiClient.get(`/payments/user/${userId}`);
    return response.data;
  },

  getPaymentByBooking: async (bookingId: string): Promise<Payment> => {
    const response = await apiClient.get(`/payments/booking/${bookingId}`);
    return response.data;
  },

  processOfflinePayment: async (paymentData: {
    bookingId: string;
    amount: number;
    method: 'cash' | 'upi';
  }): Promise<Payment> => {
    const response = await apiClient.post('/payments/offline', paymentData);
    return response.data;
  },
};