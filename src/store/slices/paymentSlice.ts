import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Payment } from '../../types/models';
import { paymentService } from '../../services/api/paymentService';

interface PaymentState {
  payments: Payment[];
  currentPayment: Payment | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  currentPayment: null,
  loading: false,
  error: null,
};

export const createPaymentOrder = createAsyncThunk(
  'payment/createOrder',
  async (paymentData: { bookingId: string; amount: number }) => {
    return await paymentService.createPaymentOrder(paymentData);
  }
);

export const verifyPayment = createAsyncThunk(
  'payment/verify',
  async (verificationData: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) => {
    return await paymentService.verifyPayment(verificationData);
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  'payment/fetchHistory',
  async (userId: string) => {
    return await paymentService.getPaymentHistory(userId);
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setCurrentPayment: (state, action: PayloadAction<Payment>) => {
      state.currentPayment = action.payload;
    },
    updatePaymentStatus: (state, action: PayloadAction<{ paymentId: string; status: Payment['status'] }>) => {
      const payment = state.payments.find(p => p.id === action.payload.paymentId);
      if (payment) {
        payment.status = action.payload.status;
      }
      if (state.currentPayment?.id === action.payload.paymentId) {
        state.currentPayment.status = action.payload.status;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create payment order';
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        if (state.currentPayment) {
          state.currentPayment.status = 'completed';
          state.currentPayment.razorpayPaymentId = action.payload.razorpayPaymentId;
        }
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.payments = action.payload;
      });
  },
});

export const { setCurrentPayment, updatePaymentStatus, clearError } = paymentSlice.actions;
export default paymentSlice.reducer;