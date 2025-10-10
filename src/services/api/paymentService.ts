import { apiClient } from './apiClient';
import { mockPaymentService } from './mockPaymentService';
import { Payment } from '../../types/models';

const USE_MOCK = process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_API_URL;

export const paymentService = {
  createPaymentOrder: async (paymentData: { bookingId: string; amount: number }): Promise<Payment> => {
    if (USE_MOCK) {
      return await mockPaymentService.createPaymentOrder(paymentData);
    }
    try {
      const response = await apiClient.post('/payments/create-order', paymentData);
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock service');
      return await mockPaymentService.createPaymentOrder(paymentData);
    }
  },

  verifyPayment: async (verificationData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<Payment> => {
    if (USE_MOCK) {
      return await mockPaymentService.verifyPayment(verificationData);
    }
    try {
      const response = await apiClient.post('/payments/verify', verificationData);
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock service');
      return await mockPaymentService.verifyPayment(verificationData);
    }
  },

  getPaymentHistory: async (userId: string): Promise<Payment[]> => {
    if (USE_MOCK) {
      return await mockPaymentService.getPaymentHistory(userId);
    }
    try {
      const response = await apiClient.get(`/payments/user/${userId}`);
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock service');
      return await mockPaymentService.getPaymentHistory(userId);
    }
  },

  getPaymentByBooking: async (bookingId: string): Promise<Payment> => {
    if (USE_MOCK) {
      return await mockPaymentService.getPaymentByBooking(bookingId);
    }
    try {
      const response = await apiClient.get(`/payments/booking/${bookingId}`);
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock service');
      return await mockPaymentService.getPaymentByBooking(bookingId);
    }
  },

  processOfflinePayment: async (paymentData: {
    bookingId: string;
    amount: number;
    method: 'cash' | 'upi';
  }): Promise<Payment> => {
    if (USE_MOCK) {
      return await mockPaymentService.processOfflinePayment(paymentData);
    }
    try {
      const response = await apiClient.post('/payments/offline', paymentData);
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock service');
      return await mockPaymentService.processOfflinePayment(paymentData);
    }
  },
};