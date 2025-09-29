import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Hospital, Department } from '../../types/models';
import { hospitalService } from '../../services/api/hospitalService';

interface HospitalState {
  hospitals: Hospital[];
  nearbyHospitals: Hospital[];
  selectedHospital: Hospital | null;
  departments: Department[];
  loading: boolean;
  error: string | null;
}

const initialState: HospitalState = {
  hospitals: [],
  nearbyHospitals: [],
  selectedHospital: null,
  departments: [],
  loading: false,
  error: null,
};

export const fetchNearbyHospitals = createAsyncThunk(
  'hospital/fetchNearby',
  async (location: { latitude: number; longitude: number }) => {
    return await hospitalService.getNearbyHospitals(location);
  }
);

export const fetchHospitalById = createAsyncThunk(
  'hospital/fetchById',
  async (id: string) => {
    return await hospitalService.getHospitalById(id);
  }
);

export const fetchDepartments = createAsyncThunk(
  'hospital/fetchDepartments',
  async (hospitalId: string) => {
    return await hospitalService.getDepartments(hospitalId);
  }
);

const hospitalSlice = createSlice({
  name: 'hospital',
  initialState,
  reducers: {
    setSelectedHospital: (state, action: PayloadAction<Hospital>) => {
      state.selectedHospital = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearbyHospitals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyHospitals.fulfilled, (state, action) => {
        state.loading = false;
        state.nearbyHospitals = action.payload;
      })
      .addCase(fetchNearbyHospitals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch nearby hospitals';
      })
      .addCase(fetchHospitalById.fulfilled, (state, action) => {
        state.selectedHospital = action.payload;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload;
      });
  },
});

export const { setSelectedHospital, clearError } = hospitalSlice.actions;
export default hospitalSlice.reducer;