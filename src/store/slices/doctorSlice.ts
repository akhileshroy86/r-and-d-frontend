import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  schedule: any[];
}

interface DoctorState {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  loading: boolean;
}

const initialState: DoctorState = {
  doctors: [],
  selectedDoctor: null,
  loading: false,
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDoctors: (state, action: PayloadAction<Doctor[]>) => {
      state.doctors = action.payload;
    },
    setSelectedDoctor: (state, action: PayloadAction<Doctor>) => {
      state.selectedDoctor = action.payload;
    },
    addDoctor: (state, action: PayloadAction<Doctor>) => {
      state.doctors.push(action.payload);
    },
    updateDoctor: (state, action: PayloadAction<Doctor>) => {
      const index = state.doctors.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.doctors[index] = action.payload;
      }
    },
  },
});

export const { setLoading, setDoctors, setSelectedDoctor, addDoctor, updateDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;