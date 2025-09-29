import { apiClient } from './apiClient';
import { Review } from '../../types/models';

export const reviewService = {
  submitReview: async (reviewData: Partial<Review>): Promise<Review> => {
    const response = await apiClient.post('/reviews', reviewData);
    return response.data;
  },

  getDoctorReviews: async (doctorId: string): Promise<Review[]> => {
    const response = await apiClient.get(`/reviews/doctor/${doctorId}`);
    return response.data;
  },

  getHospitalReviews: async (hospitalId: string): Promise<Review[]> => {
    const response = await apiClient.get(`/reviews/hospital/${hospitalId}`);
    return response.data;
  },

  getUserReviews: async (userId: string): Promise<Review[]> => {
    const response = await apiClient.get(`/reviews/user/${userId}`);
    return response.data;
  },
};