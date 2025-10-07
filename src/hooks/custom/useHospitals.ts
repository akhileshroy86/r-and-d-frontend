import { useState, useEffect } from 'react';
import { hospitalService } from '../../services/api/hospitalService';
import { Hospital } from '../../types/models';

export const useHospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllHospitals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await hospitalService.getAllHospitals();
      setHospitals(data);
    } catch (err) {
      setError('Failed to fetch hospitals');
      console.error('Error fetching hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitalById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const hospital = await hospitalService.getHospitalById(id);
      return hospital;
    } catch (err) {
      setError('Failed to fetch hospital');
      console.error('Error fetching hospital:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllHospitals();
  }, []);

  return {
    hospitals,
    loading,
    error,
    fetchAllHospitals,
    fetchHospitalById,
    refetch: fetchAllHospitals
  };
};