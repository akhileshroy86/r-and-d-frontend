import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import doctorSlice from './slices/doctorSlice';
import patientSlice from './slices/patientSlice';
import appointmentSlice from './slices/appointmentSlice';
import staffSlice from './slices/staffSlice';
import hospitalSlice from './slices/hospitalSlice';
import bookingSlice from './slices/bookingSlice';
import paymentSlice from './slices/paymentSlice';
import reviewSlice from './slices/reviewSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    doctor: doctorSlice,
    patient: patientSlice,
    appointment: appointmentSlice,
    staff: staffSlice,
    hospital: hospitalSlice,
    booking: bookingSlice,
    payment: paymentSlice,
    review: reviewSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;