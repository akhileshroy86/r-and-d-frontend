import { Payment } from '../../types/models';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get payments from localStorage or initialize with default
const getStoredPayments = (): Payment[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('mockPayments');
  return stored ? JSON.parse(stored) : [];
};

// Save payments to localStorage
const savePayments = (payments: Payment[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockPayments', JSON.stringify(payments));
  }
};

let mockPayments: Payment[] = getStoredPayments();

export const mockPaymentService = {
  createPaymentOrder: async (paymentData: { bookingId: string; amount: number }): Promise<Payment> => {
    await delay(500);
    
    const payment: Payment = {
      id: String(Date.now()),
      bookingId: paymentData.bookingId,
      amount: paymentData.amount,
      status: 'completed',
      method: 'online',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockPayments = getStoredPayments();
    mockPayments.push(payment);
    savePayments(mockPayments);
    console.log('Payment created and saved to localStorage:', payment);
    console.log('All payments in localStorage:', getStoredPayments());
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
      id: String(Date.now()),
      bookingId: paymentData.bookingId,
      amount: paymentData.amount,
      status: 'completed',
      method: paymentData.method,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockPayments = getStoredPayments();
    mockPayments.push(payment);
    savePayments(mockPayments);
    return payment;
  },

  // Add method to get all payments for admin dashboard
  getAllPayments: async (): Promise<Payment[]> => {
    await delay(300);
    return getStoredPayments();
  }
};