import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  loading: boolean;
}

const initialState: AppointmentState = {
  appointments: [],
  selectedAppointment: null,
  loading: false,
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
    },
    setSelectedAppointment: (state, action: PayloadAction<Appointment>) => {
      state.selectedAppointment = action.payload;
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
  },
});

export const { setLoading, setAppointments, setSelectedAppointment, addAppointment, updateAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;