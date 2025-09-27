import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  medicalHistory: any[];
}

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
}

const initialState: PatientState = {
  patients: [],
  selectedPatient: null,
  loading: false,
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload;
    },
    setSelectedPatient: (state, action: PayloadAction<Patient>) => {
      state.selectedPatient = action.payload;
    },
    addPatient: (state, action: PayloadAction<Patient>) => {
      state.patients.push(action.payload);
    },
    updatePatient: (state, action: PayloadAction<Patient>) => {
      const index = state.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
    },
  },
});

export const { setLoading, setPatients, setSelectedPatient, addPatient, updatePatient } = patientSlice.actions;
export default patientSlice.reducer;