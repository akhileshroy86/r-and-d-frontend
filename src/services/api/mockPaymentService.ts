import { Payment } from '../../types/models';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock payments database
let mockPayments: Payment[] = [
  {
    id: '1',
    bookingId: '1',
    amount: 500,
    status: 'completed',
    method: 'cash',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  }
];

export const mockPaymentService = {
  createPaymentOrder: async (paymentData: { bookingId: string; amount: number }): Promise<Payment> => {
    await delay(500);
    
    const payment: Payment = {
      id: String(mockPayments.length + 1),
      bookingId: paymentData.bookingId,
      amount: paymentData.amount,
      status: 'pending',
      method: 'online',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockPayments.push(payment);
    return payment;
  },

  verifyPayment: async (verificationData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<Payment> => {
    await delay(500);
    
    const payment = mockPayments.find(p => p.id === verificationData.razorpayOrderId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    payment.status = 'completed';
    payment.updatedAt = new Date().toISOString();
    return payment;
  },

  getPaymentHistory: async (userId: string): Promise<Payment[]> => {
    await delay(300);
    return mockPayments.filter(p => p.bookingId === userId);
  },

  getPaymentByBooking: async (bookingId: string): Promise<Payment> => {
    await delay(300);
    const payment = mockPayments.find(p => p.bookingId === bookingId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment;
  },

  processOfflinePayment: async (paymentData: {
    bookingId: string;
    amount: number;
    method: 'cash' | 'upi';
  }): Promise<Payment> => {
    await delay(500);
    
    const payment: Payment = {
      id: String(mockPayments.length + 1),
      bookingId: paymentData.bookingId,
      amount: paymentData.amount,
      status: 'completed',
      method: paymentData.method,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockPayments.push(payment);
    return payment;
  }
};