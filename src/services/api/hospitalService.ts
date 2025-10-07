import { apiClient } from './apiClient';
import { Hospital, Department } from '../../types/models';

export const hospitalService = {
  getAllHospitals: async (): Promise<Hospital[]> => {
    const response = await apiClient.get('/hospitals');
    return response.data;
  },

  getNearbyHospitals: async (location: { latitude: number; longitude: number }): Promise<Hospital[]> => {
    const response = await apiClient.get('/hospitals/nearby', {
      params: { lat: location.latitude, lng: location.longitude }
    });
    return response.data;
  },

  getHospitalById: async (id: string): Promise<Hospital> => {
    const response = await apiClient.get(`/hospitals/${id}`);
    return response.data;
  },

  getDepartments: async (hospitalId: string): Promise<Department[]> => {
    const response = await apiClient.get(`/hospitals/${hospitalId}/departments`);
    return response.data;
  },

  searchHospitals: async (query: string, filters?: any): Promise<Hospital[]> => {
    const response = await apiClient.get('/hospitals/search', {
      params: { q: query, ...filters }
    });
    return response.data;
  },
};