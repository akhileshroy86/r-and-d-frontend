import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import doctorSlice from './slices/doctorSlice';
import patientSlice from './slices/patientSlice';
import appointmentSlice from './slices/appointmentSlice';
import staffSlice from './slices/staffSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    doctor: doctorSlice,
    patient: patientSlice,
    appointment: appointmentSlice,
    staff: staffSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;