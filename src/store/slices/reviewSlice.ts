import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Review } from '../../types/models';
import { reviewService } from '../../services/api/reviewService';

interface ReviewState {
  reviews: Review[];
  doctorReviews: Review[];
  hospitalReviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  doctorReviews: [],
  hospitalReviews: [],
  loading: false,
  error: null,
};

export const submitReview = createAsyncThunk(
  'review/submit',
  async (reviewData: Partial<Review>) => {
    return await reviewService.submitReview(reviewData);
  }
);

export const fetchDoctorReviews = createAsyncThunk(
  'review/fetchDoctorReviews',
  async (doctorId: string) => {
    return await reviewService.getDoctorReviews(doctorId);
  }
);

export const fetchHospitalReviews = createAsyncThunk(
  'review/fetchHospitalReviews',
  async (hospitalId: string) => {
    return await reviewService.getHospitalReviews(hospitalId);
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to submit review';
      })
      .addCase(fetchDoctorReviews.fulfilled, (state, action) => {
        state.doctorReviews = action.payload;
      })
      .addCase(fetchHospitalReviews.fulfilled, (state, action) => {
        state.hospitalReviews = action.payload;
      });
  },
});

export const { clearError } = reviewSlice.actions;
export default reviewSlice.reducer;