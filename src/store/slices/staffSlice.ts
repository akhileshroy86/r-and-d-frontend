import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  department: string;
}

interface StaffState {
  staff: Staff[];
  selectedStaff: Staff | null;
  loading: boolean;
}

const initialState: StaffState = {
  staff: [],
  selectedStaff: null,
  loading: false,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setStaff: (state, action: PayloadAction<Staff[]>) => {
      state.staff = action.payload;
    },
    setSelectedStaff: (state, action: PayloadAction<Staff>) => {
      state.selectedStaff = action.payload;
    },
    addStaff: (state, action: PayloadAction<Staff>) => {
      state.staff.push(action.payload);
    },
    updateStaff: (state, action: PayloadAction<Staff>) => {
      const index = state.staff.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.staff[index] = action.payload;
      }
    },
  },
});

export const { setLoading, setStaff, setSelectedStaff, addStaff, updateStaff } = staffSlice.actions;
export default staffSlice.reducer;