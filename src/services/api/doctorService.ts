export interface DoctorData {
  name: string;
  qualification: string;
  department: string;
  specialization: string;
  experience: number;
  consultationFee: number;
  availableDays: string[];
  startTime: string;
  endTime: string;
  lunchBreakStart?: string;
  lunchBreakEnd?: string;
  consultationDuration: number;
  maxPatientsPerDay: number;
}

export const doctorService = {
  addDoctor: async (doctorData: DoctorData): Promise<{ message: string; doctor: any }> => {
    try {
      const response = await fetch('http://localhost:3002/api/doctors', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(doctorData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};