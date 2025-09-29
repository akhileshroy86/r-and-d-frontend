import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Booking, Queue } from '../../types/models';
import { bookingService } from '../../services/api/bookingService';

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  queue: Queue | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  queue: null,
  loading: false,
  error: null,
};

export const createBooking = createAsyncThunk(
  'booking/create',
  async (bookingData: Partial<Booking>) => {
    return await bookingService.createBooking(bookingData);
  }
);

export const fetchUserBookings = createAsyncThunk(
  'booking/fetchUserBookings',
  async (userId: string) => {
    return await bookingService.getUserBookings(userId);
  }
);

export const fetchQueueStatus = createAsyncThunk(
  'booking/fetchQueue',
  async (doctorId: string) => {
    return await bookingService.getQueueStatus(doctorId);
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancel',
  async (bookingId: string) => {
    return await bookingService.cancelBooking(bookingId);
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentBooking: (state, action: PayloadAction<Booking>) => {
      state.currentBooking = action.payload;
    },
    updateQueuePosition: (state, action: PayloadAction<{ bookingId: string; position: number; estimatedTime: number }>) => {
      const booking = state.bookings.find(b => b.id === action.payload.bookingId);
      if (booking) {
        booking.queuePosition = action.payload.position;
        booking.estimatedWaitTime = action.payload.estimatedTime;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create booking';
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
      })
      .addCase(fetchQueueStatus.fulfilled, (state, action) => {
        state.queue = action.payload;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(b => b.id !== action.payload.id);
      });
  },
});

export const { setCurrentBooking, updateQueuePosition, clearError } = bookingSlice.actions;
export default bookingSlice.reducer;