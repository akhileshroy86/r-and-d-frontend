'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Slider } from 'primereact/slider';
import { ToggleButton } from 'primereact/togglebutton';
import { Chip } from 'primereact/chip';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { RadioButton } from 'primereact/radiobutton';
import { Messages } from 'primereact/messages';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { apiClient } from '../../services/api/apiClient';
import { Hospital, Doctor } from '../../types/models';
import LogoutButton from '../common/LogoutButton';

const PatientDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [topDoctors, setTopDoctors] = useState<Doctor[]>([]);
  const [suggestedDoctors, setSuggestedDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>({});
  const [activeSearchTab, setActiveSearchTab] = useState(0);
  const [bookingModal, setBookingModal] = useState({ visible: false, doctor: null as Doctor | null });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [booking, setBooking] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Hyderabad, Telangana');
  const [appointmentDetailsModal, setAppointmentDetailsModal] = useState({ visible: false, appointment: null as any });
  const [hospitalDoctors, setHospitalDoctors] = useState<Doctor[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [loadingHospitalDoctors, setLoadingHospitalDoctors] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState({ visible: false, appointment: null as any });
  const [newDate, setNewDate] = useState<Date | null>(null);
  const [newTimeSlot, setNewTimeSlot] = useState('');
  
  // Filters
  const [filters, setFilters] = useState({
    type: 'all',
    department: '',
    language: '',
    feeRange: [0, 1000],
    rating: 0,
    availability: false,
    sortBy: 'relevance'
  });

  const searchTypes = [
    { label: 'All', value: 'all' },
    { label: 'Hospitals', value: 'hospitals' },
    { label: 'Doctors', value: 'doctors' },
    { label: 'Symptoms', value: 'symptoms' }
  ];

  const departments = [
    { label: 'All Departments', value: '' },
    { label: 'Cardiology', value: 'cardiology' },
    { label: 'Neurology', value: 'neurology' },
    { label: 'Orthopedics', value: 'orthopedics' },
    { label: 'Pediatrics', value: 'pediatrics' },
    { label: 'General Medicine', value: 'general' },
    { label: 'Dermatology', value: 'dermatology' },
    { label: 'Gynecology', value: 'gynecology' }
  ];

  const languages = [
    { label: 'All Languages', value: '' },
    { label: 'English', value: 'english' },
    { label: 'Hindi', value: 'hindi' },
    { label: 'Telugu', value: 'telugu' },
    { label: 'Tamil', value: 'tamil' }
  ];

  const sortOptions = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Rating', value: 'rating' },
    { label: 'Fee', value: 'fee' },
    { label: 'Popularity', value: 'popularity' }
  ];

  const ratingOptions = [
    { label: 'All Ratings', value: 0 },
    { label: '4+ Stars', value: 4 },
    { label: '3+ Stars', value: 3 },
    { label: '2+ Stars', value: 2 }
  ];

  const symptomsList = [
    'Headache', 'Fever', 'Cough', 'Chest Pain', 'Back Pain', 'Stomach Pain',
    'Shortness of Breath', 'Dizziness', 'Fatigue', 'Joint Pain', 'Skin Rash',
    'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Sleep Problems'
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const getDoctorImage = (doctorId: string) => {
    const seed = doctorId ? doctorId.slice(-3) : '001';
    return `https://randomuser.me/api/portraits/men/${parseInt(seed, 36) % 50 + 1}.jpg`;
  };

  const calculateQueuePosition = (appointment: any) => {
    console.log('Calculating queue for appointment:', appointment.id);
    console.log('All appointments:', appointments.length);
    
    // Get all appointments for the same doctor on the same date
    const sameDocSameDate = appointments.filter(apt => 
      apt.doctorId === appointment.doctorId &&
      new Date(apt.date).toDateString() === new Date(appointment.date).toDateString()
    );
    
    console.log('Same doctor same date appointments:', sameDocSameDate.length);
    
    // Sort by time
    const sortedAppointments = sameDocSameDate.sort((a, b) => {
      const timeA = convertTimeToMinutes(a.timeRange);
      const timeB = convertTimeToMinutes(b.timeRange);
      return timeA - timeB;
    });
    
    console.log('Sorted appointments:', sortedAppointments.map(a => ({ id: a.id, time: a.timeRange })));
    
    // Find position of current appointment
    const position = sortedAppointments.findIndex(apt => apt.id === appointment.id) + 1;
    console.log('Queue position:', position);
    return position || 1;
  };

  const convertTimeToMinutes = (timeRange: string) => {
    const time = timeRange.split(' ')[0]; // Get time part (e.g., "09:00" from "09:00 AM")
    const [hours, minutes] = time.split(':').map(Number);
    const isPM = timeRange.includes('PM');
    const adjustedHours = isPM && hours !== 12 ? hours + 12 : (hours === 12 && !isPM ? 0 : hours);
    return adjustedHours * 60 + minutes;
  };

  const getEstimatedWaitTime = (queuePosition: number) => {
    const avgConsultationTime = 20; // minutes per patient
    const waitTime = (queuePosition - 1) * avgConsultationTime;
    
    console.log('Queue position:', queuePosition, 'Wait time:', waitTime);
    
    if (waitTime <= 0) return "Your turn now";
    if (waitTime <= 30) return `${waitTime} minutes`;
    if (waitTime <= 60) return `${Math.round(waitTime / 30) * 30} minutes`;
    
    const hours = Math.floor(waitTime / 60);
    const mins = waitTime % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  useEffect(() => {
    getCurrentLocation();
    fetchData();
  }, []);

  const loadStoredAppointments = () => {
    try {
      const storageKey = `userAppointments_${user?.id}`;
      const stored = localStorage.getItem(storageKey);
      console.log('Loading stored appointments:', stored);
      if (stored) {
        const storedAppointments = JSON.parse(stored);
        console.log('Parsed appointments:', storedAppointments);
        setAppointments(storedAppointments);
        setUpcomingAppointments(storedAppointments.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading stored appointments:', error);
    }
  };

  const saveAppointmentToStorage = (appointment: any) => {
    try {
      const storageKey = `userAppointments_${user?.id}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updated = [appointment, ...existing];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      console.log('Saved appointment to storage:', updated);
    } catch (error) {
      console.error('Error saving appointment to storage:', error);
    }
  };

  useEffect(() => {
    if (location) {
      fetchNearbyHospitals();
    }
  }, [location]);

  // Simulate doctor approval for rejoin (in real app, this would come from doctor's action)
  useEffect(() => {
    const updateRejoinStatus = () => {
      setAppointments(prev => prev.map(apt => {
        // Simulate random doctor approval for demo
        const labsCompleted = Math.random() > 0.5;
        const doctorApproval = Math.random() > 0.3;
        const canRejoin = labsCompleted && doctorApproval;
        
        return {
          ...apt,
          labsCompleted,
          doctorApproval,
          canRejoin
        };
      }));
      
      setUpcomingAppointments(prev => prev.map(apt => {
        const labsCompleted = Math.random() > 0.5;
        const doctorApproval = Math.random() > 0.3;
        const canRejoin = labsCompleted && doctorApproval;
        
        return {
          ...apt,
          labsCompleted,
          doctorApproval,
          canRejoin
        };
      }));
    };
    
    // Update rejoin status after 3 seconds (simulate doctor action)
    const timer = setTimeout(updateRejoinStatus, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      performSearch();
    }
  }, [searchQuery, filters]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Hyderabad coordinates
          setLocation({ lat: 17.3850, lng: 78.4867 });
        }
      );
    } else {
      setLocation({ lat: 17.3850, lng: 78.4867 });
    }
  };

  const fetchData = async () => {
    try {
      const [hospitalsRes, doctorsRes, appointmentsRes] = await Promise.all([
        apiClient.get('/hospitals'),
        apiClient.get('/doctors'),
        apiClient.get('/appointments')
      ]);
      
      setHospitals(hospitalsRes.data || []);
      const allDoctors = doctorsRes.data || [];
      const affordableDoctors = allDoctors.filter(doctor => (doctor.consultationFee || 0) <= 1000);
      
      setDoctors(affordableDoctors);
      setTopDoctors(affordableDoctors.slice(0, 6));
      setSuggestedDoctors(affordableDoctors.slice(0, 4));
      
      // Get API appointments
      const apiAppointments = appointmentsRes.data || [];
      
      // Load stored appointments for current user only
      const stored = localStorage.getItem(`userAppointments_${user?.id}`);
      const storedAppointments = stored ? JSON.parse(stored) : [];
      
      // Filter API appointments for current user
      const userApiAppointments = apiAppointments.filter(apt => apt.patientId === user?.id);
      
      // Combine user-specific appointments only
      const userAppointments = [...storedAppointments, ...userApiAppointments];
      const uniqueUserAppointments = userAppointments.filter((appointment, index, self) => 
        index === self.findIndex(a => a.id === appointment.id)
      );
      
      // Set user appointments for display
      setAppointments(uniqueUserAppointments);
      setUpcomingAppointments(uniqueUserAppointments.slice(0, 3));
      
      console.log('User appointments loaded:', uniqueUserAppointments.length);
    } catch (error) {
      console.error('Error fetching data:', error);
      // If API fails, still load stored appointments
      loadStoredAppointments();
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyHospitals = async () => {
    try {
      const response = await apiClient.get(`/hospitals/nearby?lat=${location?.lat}&lng=${location?.lng}&radius=10`);
      setNearbyHospitals(response.data || hospitals.slice(0, 6));
    } catch (error) {
      console.error('Error fetching nearby hospitals:', error);
      setNearbyHospitals(hospitals.slice(0, 6));
    }
  };

  const performSearch = async () => {
    console.log('Performing search for:', searchQuery, 'Type:', filters.type);
    
    // Check if searching for symptoms
    const isSymptomSearch = filters.type === 'symptoms' || 
                           symptomsList.some(symptom => 
                             symptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             searchQuery.toLowerCase().includes(symptom.toLowerCase())
                           );
    
    console.log('Is symptom search:', isSymptomSearch);
    
    if (isSymptomSearch) {
      // Always use fallback for symptom searches since API might not exist
      const specialization = getSpecializationFromSymptom(searchQuery);
      console.log('Mapped specialization:', specialization);
      console.log('Available doctors:', doctors.length);
      
      const filteredDoctors = doctors.filter(doctor => {
        const matchesSpecialization = doctor.specialization?.toLowerCase().includes(specialization.toLowerCase()) ||
          doctor.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.lastName?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesFeeRange = (doctor.consultationFee || 0) >= filters.feeRange[0] && 
          (doctor.consultationFee || 0) <= filters.feeRange[1];
        
        return matchesSpecialization && matchesFeeRange;
      });
      
      console.log('Filtered doctors:', filteredDoctors.length);
      
      setSearchResults({
        doctors: filteredDoctors,
        hospitals: [],
        symptoms: [{ name: searchQuery }]
      });
    } else {
      // General search
      try {
        const params = new URLSearchParams();
        params.append('query', searchQuery);
        params.append('type', filters.type);
        if (filters.department) params.append('department', filters.department);
        if (filters.language) params.append('language', filters.language);
        if (filters.feeRange[0] > 0) params.append('minFee', filters.feeRange[0].toString());
        if (filters.feeRange[1] < 1000) params.append('maxFee', filters.feeRange[1].toString());
        if (filters.rating > 0) params.append('rating', filters.rating.toString());
        if (filters.availability) params.append('availability', 'true');
        params.append('sortBy', filters.sortBy);
        
        const response = await apiClient.get(`/search?${params.toString()}`);
        setSearchResults(response.data || {});
      } catch (error) {
        console.error('Error performing search:', error);
        setSearchResults({});
      }
    }
  };

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleBookAppointment = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId) || topDoctors.find(d => d.id === doctorId) || suggestedDoctors.find(d => d.id === doctorId) || hospitalDoctors.find(d => d.id === doctorId);
    if (doctor) {
      setBookingModal({ visible: true, doctor });
      setSelectedDate(null);
      setSelectedTimeSlot('');
      setSymptoms('');
    }
  };

  const closeBookingModal = () => {
    setBookingModal({ visible: false, doctor: null });
    setShowPayment(false);
    setSelectedPaymentMethod('');
    setSelectedDate(null);
    setSelectedTimeSlot('');
    setSymptoms('');
  };

  const confirmBooking = () => {
    if (!selectedDate || !selectedTimeSlot || !bookingModal.doctor) {
      alert('Please select date and time.');
      return;
    }
    setShowPayment(true);
  };

  const processPayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    setProcessing(true);
    
    const requestData = {
      patientId: user?.id,
      doctorId: bookingModal.doctor?.id,
      date: selectedDate?.toISOString(),
      timeRange: selectedTimeSlot,
      notes: symptoms,
      duration: 30,
      paymentMethod: selectedPaymentMethod,
      status: selectedPaymentMethod === 'cash' ? 'unpaid' : 'paid',
      paymentStatus: selectedPaymentMethod === 'cash' ? 'unpaid' : 'paid'
    };
    
    console.log('Booking appointment with data:', requestData);
    console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL}/appointments`);
    
    try {
      const response = await apiClient.post('/appointments', requestData);
      console.log('Appointment API response:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);
      
      // Check if the API returned an error even with 201 status
      if (response.data.success === false) {
        // If patient not found, try to create patient first
        if (response.data.error.includes('Patient with ID') && response.data.error.includes('not found')) {
          console.log('Patient not found, creating patient record...');
          try {
            await apiClient.post('/patients', {
              id: user?.id,
              name: user?.name,
              email: user?.email,
              role: 'patient'
            });
            console.log('Patient created, retrying appointment booking...');
            // Retry appointment booking
            const retryResponse = await apiClient.post('/appointments', requestData);
            if (retryResponse.data.success === false) {
              throw new Error(retryResponse.data.error || 'Failed to create appointment after patient creation');
            }
            // Continue with successful appointment creation
            response.data = retryResponse.data;
          } catch (patientError) {
            console.error('Failed to create patient:', patientError);
            throw new Error('Patient record not found and could not be created. Please contact support.');
          }
        } else {
          throw new Error(response.data.error || 'Failed to create appointment');
        }
      }
      
      // Use the appointment data returned from the API
      const apiAppointment = response.data;
      const doctorName = `${bookingModal.doctor?.firstName || ''} ${bookingModal.doctor?.lastName || ''}`.trim();
      
      const newAppointment = {
        id: apiAppointment?.id || Date.now().toString(),
        patientId: user?.id,
        doctorId: bookingModal.doctor?.id,
        doctor: {
          name: doctorName || 'Doctor',
          firstName: bookingModal.doctor?.firstName || '',
          lastName: bookingModal.doctor?.lastName || ''
        },
        specialization: bookingModal.doctor?.specialization || 'General Medicine',
        timeRange: selectedTimeSlot,
        date: selectedDate?.toISOString(),
        status: 'confirmed',
        hospitalName: bookingModal.doctor?.hospitalName || bookingModal.doctor?.hospital?.name || 'Apollo Hospital',
        notes: symptoms,
        duration: 30,
        paymentMethod: selectedPaymentMethod,
        paymentStatus: selectedPaymentMethod === 'cash' ? 'unpaid' : 'paid',
        queueStatus: 'waiting',
        canRejoin: false, // Initially false, will be enabled by doctor
        labsCompleted: false,
        doctorApproval: false
      };
      
      console.log('New appointment created:', newAppointment);
      
      // Add some mock appointments for the same doctor to demonstrate queue
      const mockAppointments = [
        {
          id: 'mock1',
          patientId: 'other1',
          doctorId: bookingModal.doctor?.id,
          timeRange: '09:00 AM',
          date: selectedDate?.toISOString(),
          paymentStatus: 'paid'
        },
        {
          id: 'mock2', 
          patientId: 'other2',
          doctorId: bookingModal.doctor?.id,
          timeRange: '09:30 AM',
          date: selectedDate?.toISOString(),
          paymentStatus: 'paid'
        }
      ];
      
      setUpcomingAppointments(prev => [newAppointment, ...prev]);
      setAppointments(prev => [newAppointment, ...prev]);
      saveAppointmentToStorage(newAppointment);
      
      setShowPayment(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        closeBookingModal();
      }, 3000);
    } catch (error: any) {
      console.error('=== APPOINTMENT BOOKING ERROR ===');
      console.error('Full error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.message);
      
      if (error.response?.status === 404) {
        alert('Appointment endpoint not found. Please check if your backend server is running on port 3002.');
      } else if (error.response?.status === 500) {
        alert('Server error. Please check your backend logs.');
      } else if (!error.response) {
        alert('Cannot connect to server. Please ensure your backend is running on http://localhost:3002');
      } else {
        const errorMessage = error.response?.data?.message || 'Payment failed. Please try again.';
        alert(errorMessage);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleSymptomClick = (symptom: string) => {
    console.log('Symptom clicked:', symptom);
    setSearchQuery(symptom);
    updateFilter('type', 'symptoms');
  };

  const getSpecializationFromSymptom = (symptom: string): string => {
    const symptomMap: { [key: string]: string } = {
      'headache': 'neurology',
      'fever': 'general',
      'cough': 'pulmonology',
      'chest pain': 'cardiology',
      'back pain': 'orthopedics',
      'stomach pain': 'gastroenterology',
      'shortness of breath': 'pulmonology',
      'dizziness': 'neurology',
      'fatigue': 'general',
      'joint pain': 'orthopedics',
      'skin rash': 'dermatology',
      'nausea': 'gastroenterology',
      'vomiting': 'gastroenterology',
      'diarrhea': 'gastroenterology',
      'constipation': 'gastroenterology',
      'sleep problems': 'neurology'
    };
    
    const lowerSymptom = symptom.toLowerCase();
    return symptomMap[lowerSymptom] || 'general';
  };

  const handleHospitalBooking = async (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setLoadingHospitalDoctors(true);
    try {
      const response = await apiClient.get(`/doctors?hospitalId=${hospital.id}`);
      setHospitalDoctors(response.data || []);
    } catch (error) {
      console.error('Error fetching hospital doctors:', error);
      // Fallback to all doctors if hospital-specific API fails
      setHospitalDoctors(doctors.slice(0, 6));
    } finally {
      setLoadingHospitalDoctors(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex align-items-center justify-content-center">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-primary mb-3"></i>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Professional Healthcare Header */}
      <div className="bg-white shadow-lg border-bottom-1 surface-border sticky top-0 z-5">
        <div className="px-6 py-4">
          <div className="flex justify-content-between align-items-center">
            <div className="flex align-items-center gap-4">
              <div className="flex align-items-center gap-3">
                <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} className="border-circle w-4rem h-4rem flex align-items-center justify-content-center">
                  <i className="pi pi-plus text-white text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-900 font-bold m-0 text-3xl" style={{ color: '#1e293b' }}>HealthCare</h1>
                  <p className="text-sm text-600 m-0 font-medium">Your Health, Our Priority</p>
                </div>
              </div>
              <Divider layout="vertical" className="mx-3" />
              <div 
                className="flex align-items-center gap-2 text-600 cursor-pointer hover:bg-blue-50 px-3 py-2 border-round transition-colors"
                onClick={() => setShowLocationModal(true)}
              >
                <i className="pi pi-map-marker text-primary"></i>
                <span className="text-sm font-medium">
                  {selectedLocation}
                </span>
                <i className="pi pi-chevron-down text-xs text-500"></i>
              </div>
            </div>
            <div className="flex align-items-center gap-4">
              <div className="flex align-items-center gap-3 bg-blue-50 px-4 py-2 border-round-lg">
                <Avatar 
                  icon="pi pi-user" 
                  className="bg-primary text-white"
                  size="normal"
                />
                <div className="text-right">
                  <p className="text-sm font-bold text-900 m-0">{user?.name}</p>
                  <p className="text-xs text-600 m-0">Patient ID: #P{user?.id}</p>
                </div>
              </div>
              <Button 
                icon="pi pi-bell" 
                className="p-button-rounded p-button-text" 
                badge="3" 
                badgeClassName="p-badge-danger"
              />
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        {/* Hero Search Section */}
        <div className="bg-white border-round-xl shadow-3 p-6 mb-6" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' }}>
          <div className="text-center mb-5">
            <h2 className="text-white font-bold text-4xl m-0 mb-3">Find Healthcare Near You</h2>
            <p className="text-white text-xl m-0 opacity-95 font-medium">Book appointments with top doctors and hospitals</p>
          </div>
          
          <div className="bg-white border-round-xl p-5 shadow-4" style={{ border: '1px solid #e5e7eb' }}>
            <div className="flex gap-3 mb-5">
              <div className="flex-1">
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon" style={{ background: '#1e40af', border: '1px solid #1e40af' }}>
                    <i className="pi pi-search text-white"></i>
                  </span>
                  <InputText
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search doctors, hospitals, symptoms, treatments..."
                    className="text-lg p-3"
                    style={{ 
                      fontSize: '16px',
                      border: '1px solid #d1d5db',
                      borderLeft: 'none'
                    }}
                  />
                </div>
              </div>
              <Button
                label="Search"
                icon="pi pi-search"
                className="p-3 px-6 text-lg font-semibold"
                onClick={performSearch}
                style={{ 
                  background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', 
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
                }}
              />
            </div>
            
            {/* Quick Filters */}
            <div className="grid gap-3" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
              <div className="col-12 md:col-2">
                <label className="block text-sm font-semibold mb-1" style={{ color: '#1e40af' }}>Search In</label>
                <Dropdown
                  value={filters.type}
                  options={searchTypes}
                  onChange={(e) => updateFilter('type', e.value)}
                  className="w-full"
                />
              </div>
              <div className="col-12 md:col-2">
                <label className="block text-sm font-semibold mb-1" style={{ color: '#1e40af' }}>Specialty</label>
                <Dropdown
                  value={filters.department}
                  options={departments}
                  onChange={(e) => updateFilter('department', e.value)}
                  className="w-full"
                />
              </div>
              <div className="col-12 md:col-2">
                <label className="block text-sm font-semibold mb-1" style={{ color: '#1e40af' }}>Language</label>
                <Dropdown
                  value={filters.language}
                  options={languages}
                  onChange={(e) => updateFilter('language', e.value)}
                  className="w-full"
                />
              </div>
              <div className="col-12 md:col-2">
                <label className="block text-sm font-semibold mb-1" style={{ color: '#1e40af' }}>Rating</label>
                <Dropdown
                  value={filters.rating}
                  options={ratingOptions}
                  onChange={(e) => updateFilter('rating', e.value)}
                  className="w-full"
                />
              </div>
              <div className="col-12 md:col-2">
                <label className="block text-sm font-semibold mb-1" style={{ color: '#1e40af' }}>Availability</label>
                <ToggleButton
                  checked={filters.availability}
                  onChange={(e) => updateFilter('availability', e.value)}
                  onLabel="Available Now"
                  offLabel="Any Time"
                  className="w-full"
                />
              </div>
              <div className="col-12 md:col-2">
                <label className="block text-sm font-semibold mb-1" style={{ color: '#1e40af' }}>Sort By</label>
                <Dropdown
                  value={filters.sortBy}
                  options={sortOptions}
                  onChange={(e) => updateFilter('sortBy', e.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Fee Range */}
            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1e40af' }}>
                Consultation Fee: ₹{filters.feeRange[0]} - ₹{filters.feeRange[1]}
              </label>
              <Slider
                value={filters.feeRange}
                onChange={(e) => updateFilter('feeRange', e.value)}
                range
                min={0}
                max={1000}
                step={50}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <Card className="mb-4">
            <h3 className="mt-0 mb-3">Search Results for "{searchQuery}"</h3>
            <TabView activeIndex={activeSearchTab} onTabChange={(e) => setActiveSearchTab(e.index)}>
              <TabPanel header="All Results">
                <div className="grid">
                  {/* Hospitals */}
                  {searchResults.hospitals?.length > 0 && (
                    <div className="col-12">
                      <h4>Hospitals</h4>
                      <div className="grid">
                        {searchResults.hospitals.slice(0, 3).map((hospital: any) => (
                          <div key={hospital.id} className="col-12 md:col-4">
                            <Card className="h-full">
                              <h5 className="mt-0">{hospital.name}</h5>
                              <div className="flex align-items-center mb-2">
                                <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                                <span>{hospital.rating}</span>
                              </div>
                              <Button label="View Details" size="small" outlined className="w-full" />
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Doctors */}
                  {searchResults.doctors?.length > 0 && (
                    <div className="col-12">
                      <h4>Doctors {filters.type === 'symptoms' ? `for "${searchQuery}"` : ''}</h4>
                      <div className="grid">
                        {searchResults.doctors.slice(0, 3).map((doctor: any) => (
                          <div key={doctor.id} className="col-12 md:col-4">
                            <Card className="h-full">
                              <div className="flex align-items-center mb-3">
                                <Avatar 
                                  image={getDoctorImage(doctor.id)}
                                  className="mr-3"
                                  size="normal"
                                  shape="circle"
                                />
                                <div>
                                  <h5 className="mt-0 mb-1">Dr. {doctor.firstName} {doctor.lastName}</h5>
                                  <p className="text-sm text-500 m-0">{doctor.specialization}</p>
                                </div>
                              </div>
                              <div className="flex align-items-center justify-content-between mb-3">
                                <div className="flex align-items-center">
                                  <Rating value={doctor.rating || 4.5} readOnly cancel={false} className="mr-2" />
                                  <span className="font-bold">{doctor.rating || 4.5}</span>
                                </div>
                                <span className="text-lg font-bold text-primary">₹{doctor.consultationFee}</span>
                              </div>
                              <Button 
                                label="Book Now" 
                                size="small" 
                                className="w-full font-semibold"
                                onClick={() => handleBookAppointment(doctor.id)}
                                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                              />
                            </Card>
                          </div>
                        ))}
                      </div>
                      {searchResults.doctors.length > 3 && (
                        <div className="text-center mt-3">
                          <Button 
                            label={`View All ${searchResults.doctors.length} Doctors`} 
                            className="p-button-text"
                            onClick={() => setActiveSearchTab(2)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Symptoms */}
                  {searchResults.symptoms?.length > 0 && (
                    <div className="col-12">
                      <h4>Related Symptoms</h4>
                      <div className="flex flex-wrap gap-2">
                        {searchResults.symptoms.map((symptom: any, index: number) => (
                          <Chip
                            key={index}
                            label={symptom.name}
                            onClick={() => handleSymptomClick(symptom.name)}
                            className="cursor-pointer"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabPanel>
              
              <TabPanel header="Hospitals">
                <div className="grid">
                  {(searchResults.hospitals || []).map((hospital: any) => (
                    <div key={hospital.id} className="col-12 md:col-6 lg:col-4">
                      <Card className="h-full">
                        <h5 className="mt-0">{hospital.name}</h5>
                        <div className="flex align-items-center mb-2">
                          <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                          <span>{hospital.rating}</span>
                        </div>
                        <Button label="View Details" outlined className="w-full" />
                      </Card>
                    </div>
                  ))}
                </div>
              </TabPanel>
              
              <TabPanel header={`Doctors ${filters.type === 'symptoms' ? `for "${searchQuery}"` : ''}`}>
                {searchResults.doctors?.length > 0 ? (
                  <div className="grid">
                    {searchResults.doctors.map((doctor: any) => (
                      <div key={doctor.id} className="col-12 md:col-6 lg:col-4">
                        <Card className="h-full border-round-lg shadow-2">
                          <div className="flex align-items-center mb-3">
                            <Avatar 
                              image={getDoctorImage(doctor.id)}
                              className="mr-3"
                              size="large"
                              shape="circle"
                            />
                            <div>
                              <h5 className="mt-0 mb-1">Dr. {doctor.firstName} {doctor.lastName}</h5>
                              <p className="text-sm text-500 m-0">{doctor.specialization}</p>
                              <p className="text-xs text-600 m-0">{doctor.experience || 10}+ years experience</p>
                            </div>
                          </div>
                          
                          <div className="flex align-items-center justify-content-between mb-3">
                            <div className="flex align-items-center">
                              <Rating value={doctor.rating || 4.5} readOnly cancel={false} className="mr-2" />
                              <span className="font-bold">{doctor.rating || 4.5}</span>
                            </div>
                            <span className="text-600 text-sm">({doctor.totalReviews || 0} reviews)</span>
                          </div>
                          
                          <div className="flex align-items-center justify-content-between mb-3">
                            <span className="text-lg font-bold text-primary">₹{doctor.consultationFee}</span>
                            <Tag value="Available Today" severity="success" className="font-semibold" />
                          </div>
                          
                          <Button 
                            label="Book Appointment" 
                            className="w-full font-semibold"
                            onClick={() => handleBookAppointment(doctor.id)}
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                          />
                        </Card>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <i className="pi pi-search text-4xl text-400 mb-3"></i>
                    <h4 className="text-600">No doctors found</h4>
                    <p className="text-500">Try adjusting your search criteria or browse our top doctors below.</p>
                  </div>
                )}
              </TabPanel>
              
              <TabPanel header="Symptoms">
                <div className="mb-4">
                  <h4 className="text-900 font-bold mt-0 mb-3">Click on a symptom to find relevant doctors</h4>
                  <p className="text-600 mb-3">Our AI will recommend the best specialists based on your symptoms</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {symptomsList.map((symptom, index) => (
                    <Chip
                      key={index}
                      label={symptom}
                      onClick={() => handleSymptomClick(symptom)}
                      className="cursor-pointer hover:shadow-2 transition-all duration-200 font-medium"
                      style={{ 
                        background: searchQuery.toLowerCase() === symptom.toLowerCase() 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                          : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                        color: searchQuery.toLowerCase() === symptom.toLowerCase() ? 'white' : '#1976d2',
                        border: 'none'
                      }}
                    />
                  ))}
                </div>
                {searchQuery && (
                  <div className="mt-4 p-3 bg-blue-50 border-round">
                    <div className="flex align-items-center gap-2">
                      <i className="pi pi-info-circle text-primary"></i>
                      <span className="text-primary font-medium">
                        Showing doctors specialized in treating "{searchQuery}"
                      </span>
                    </div>
                  </div>
                )}
              </TabPanel>
            </TabView>
          </Card>
        )}

        {/* Main Dashboard Content */}
        {!searchQuery && (
          <>
            {/* Quick Stats */}
            <div className="grid mb-6">
              <div className="col-12 md:col-3">
                <Card className="text-center border-round-xl shadow-2 h-full" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <i className="pi pi-calendar text-6xl text-white mb-3"></i>
                  <h2 className="text-4xl font-bold text-white m-0">{appointments.length}</h2>
                  <p className="text-white text-lg m-0 opacity-90">Total Appointments</p>
                </Card>
              </div>
              <div className="col-12 md:col-3">
                <Card className="text-center border-round-xl shadow-2 h-full" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                  <i className="pi pi-building text-6xl text-white mb-3"></i>
                  <h2 className="text-4xl font-bold text-white m-0">{hospitals.length}</h2>
                  <p className="text-white text-lg m-0 opacity-90">Partner Hospitals</p>
                </Card>
              </div>
              <div className="col-12 md:col-3">
                <Card className="text-center border-round-xl shadow-2 h-full" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                  <i className="pi pi-user-md text-6xl text-white mb-3"></i>
                  <h2 className="text-4xl font-bold text-white m-0">{doctors.length}</h2>
                  <p className="text-white text-lg m-0 opacity-90">Expert Doctors</p>
                </Card>
              </div>
              <div className="col-12 md:col-3">
                <Card className="text-center border-round-xl shadow-2 h-full" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                  <i className="pi pi-clock text-6xl text-white mb-3"></i>
                  <h2 className="text-4xl font-bold text-white m-0">24/7</h2>
                  <p className="text-white text-lg m-0 opacity-90">Emergency Care</p>
                </Card>
              </div>
            </div>

            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <Card className="mb-6 border-round-xl shadow-2">
                <div className="flex justify-content-between align-items-center mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-900 mt-0 mb-1">Upcoming Appointments</h3>
                    <p className="text-600 m-0">Your scheduled consultations</p>
                  </div>
                  <Button label="View All" icon="pi pi-arrow-right" iconPos="right" className="p-button-text" />
                </div>
                <div className="grid">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="col-12 md:col-4">
                      <Card 
                        className="border-round-lg shadow-1 h-full cursor-pointer hover:shadow-3 transition-all duration-200" 
                        style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}
                        onClick={() => setAppointmentDetailsModal({ visible: true, appointment })}
                      >
                        <div className="flex justify-content-between align-items-start mb-3">
                          <div className="flex align-items-center gap-3">
                            <Avatar 
                              image={getDoctorImage(appointment.doctorId || appointment.id)}
                              className=""
                              size="large"
                              shape="circle"
                            />
                            <div>
                              <h5 className="text-900 font-bold mt-0 mb-1">
                                Dr. {appointment.doctor?.name || appointment.doctor?.firstName + ' ' + appointment.doctor?.lastName || 'Unknown Doctor'}
                              </h5>
                              <p className="text-600 text-sm m-0 mb-1">{appointment.specialization}</p>
                              <p className="text-500 text-xs m-0">
                                <i className="pi pi-building mr-1"></i>
                                {appointment.hospitalName || 'Hospital'}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Tag 
                              value={new Date(appointment.date).toDateString() === new Date().toDateString() ? 'Today' : 'Upcoming'} 
                              severity="info" 
                              className="font-semibold" 
                            />
                            <Tag 
                              value={appointment.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'} 
                              severity={appointment.paymentStatus === 'paid' ? 'success' : 'danger'} 
                              className="font-semibold" 
                            />
                          </div>
                        </div>
                        <div className="flex align-items-center gap-2 mb-2">
                          <i className="pi pi-clock text-primary"></i>
                          <span className="text-900 font-medium">{appointment.timeRange}</span>
                        </div>
                        <div className="flex align-items-center gap-2 mb-3">
                          <i className="pi pi-calendar text-primary"></i>
                          <span className="text-600 text-sm">{new Date(appointment.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            label="View Queue" 
                            icon="pi pi-users" 
                            size="small"
                            className="flex-1"
                            outlined
                            onClick={() => setAppointmentDetailsModal({ visible: true, appointment })}
                          />
                          <Button 
                            label="Reschedule" 
                            icon="pi pi-calendar" 
                            size="small"
                            className="flex-1"
                            severity="warning"
                            outlined
                            onClick={() => setRescheduleModal({ visible: true, appointment })}
                          />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button 
                            label="Cancel" 
                            icon="pi pi-times" 
                            size="small"
                            className="flex-1"
                            severity="danger"
                            outlined
                          />
                          <Button 
                            label="Rejoin" 
                            icon="pi pi-video" 
                            size="small"
                            className="flex-1"
                            disabled={!appointment.canRejoin}
                            style={{ background: appointment.canRejoin ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined, border: 'none' }}
                          />
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Nearby Hospitals */}
            <Card className="mb-6 border-round-xl shadow-2">
              <div className="flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-900 mt-0 mb-1">Top Hospitals Near You</h3>
                  <p className="text-600 m-0">Premium healthcare facilities in your area</p>
                </div>
                <Button label="View All" icon="pi pi-arrow-right" iconPos="right" className="p-button-text" />
              </div>
              <div className="grid">
                {nearbyHospitals.map((hospital) => (
                  <div key={hospital.id} className="col-12 md:col-6 lg:col-4">
                    <Card className="h-full border-round-lg shadow-2 hover:shadow-4 transition-all duration-300 cursor-pointer">
                      <div className="flex flex-column h-full">
                        <div className="flex justify-content-between align-items-start mb-3">
                          <div className="flex align-items-center gap-3">
                            <div className="bg-primary border-circle w-3rem h-3rem flex align-items-center justify-content-center">
                              <i className="pi pi-building text-white text-xl"></i>
                            </div>
                            <div>
                              <h4 className="text-900 font-bold mt-0 mb-1">{hospital.name}</h4>
                              <p className="text-600 text-sm m-0">Multi-specialty Hospital</p>
                            </div>
                          </div>
                          <Tag value="Open" severity="success" className="font-semibold" />
                        </div>
                        
                        <div className="flex align-items-center mb-3">
                          <Rating value={hospital.rating} readOnly cancel={false} className="mr-2" />
                          <span className="text-900 font-bold">{hospital.rating}</span>
                          <span className="text-600 ml-2">({hospital.totalReviews || 0} reviews)</span>
                        </div>
                        
                        <div className="flex align-items-center gap-2 mb-3">
                          <i className="pi pi-map-marker text-primary"></i>
                          <span className="text-600 text-sm">2.5 km away</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {hospital.departments?.slice(0, 3).map((dept) => (
                            <Chip 
                              key={dept.id} 
                              label={dept.name} 
                              className="text-xs bg-blue-100 text-blue-800"
                            />
                          )) || []}
                        </div>
                        
                        <div className="mt-auto flex gap-2">
                          <Button 
                            label="Book Now" 
                            className="flex-1 font-semibold"
                            onClick={() => handleHospitalBooking(hospital)}
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                          />
                          <Button 
                            icon="pi pi-phone" 
                            className="p-button-outlined"
                            tooltip="Call Hospital"
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </Card>

            {/* Hospital Doctors - Show after clicking Book Now in hospital */}
            {selectedHospital && (
              <Card className="mb-6 border-round-xl shadow-2">
                <div className="flex justify-content-between align-items-center mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-900 mt-0 mb-1">Doctors at {selectedHospital.name}</h3>
                    <p className="text-600 m-0">Available specialists for consultation</p>
                  </div>
                  <Button 
                    label="Back to Hospitals" 
                    icon="pi pi-arrow-left" 
                    className="p-button-text"
                    onClick={() => {
                      setSelectedHospital(null);
                      setHospitalDoctors([]);
                    }}
                  />
                </div>
                
                {loadingHospitalDoctors ? (
                  <div className="text-center py-4">
                    <i className="pi pi-spinner pi-spin text-2xl text-primary"></i>
                    <p className="text-gray-500 mt-2">Loading doctors...</p>
                  </div>
                ) : (
                  <div className="grid">
                    {hospitalDoctors.map((doctor) => (
                      <div key={doctor.id} className="col-12 md:col-6 lg:col-4">
                        <Card className="h-full border-round-lg shadow-2 hover:shadow-4 transition-all duration-300">
                          <div className="flex flex-column h-full">
                            <div className="flex align-items-center mb-4">
                              <Avatar 
                                icon="pi pi-user-md" 
                                className="mr-3"
                                size="xlarge"
                                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                              />
                              <div className="flex-1">
                                <h4 className="text-900 font-bold m-0 mb-1">Dr. {doctor.firstName} {doctor.lastName}</h4>
                                <p className="text-600 text-sm m-0 mb-1">{doctor.specialization}</p>
                                <p className="text-500 text-xs m-0">{doctor.experience || 10}+ years experience</p>
                              </div>
                            </div>
                            
                            <div className="flex align-items-center justify-content-between mb-3">
                              <div className="flex align-items-center">
                                <Rating value={doctor.rating || 4.5} readOnly cancel={false} className="mr-2" />
                                <span className="text-900 font-bold">{doctor.rating || 4.5}</span>
                              </div>
                              <span className="text-600 text-sm">({doctor.totalReviews || 0} reviews)</span>
                            </div>
                            
                            <div className="flex align-items-center justify-content-between mb-3">
                              <div className="flex align-items-center gap-2">
                                <i className="pi pi-rupee text-primary"></i>
                                <span className="text-2xl font-bold text-900">{doctor.consultationFee}</span>
                              </div>
                              <Tag value="Available Today" severity="success" className="font-semibold" />
                            </div>
                            
                            <div className="flex align-items-center gap-2 mb-4">
                              <i className="pi pi-video text-primary"></i>
                              <span className="text-600 text-sm">Video Consultation Available</span>
                            </div>
                            
                            <div className="mt-auto flex gap-2">
                              <Button
                                label="Book Appointment"
                                className="flex-1 font-semibold"
                                onClick={() => handleBookAppointment(doctor.id)}
                                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                              />
                              <Button 
                                icon="pi pi-heart" 
                                className="p-button-outlined"
                                tooltip="Add to Favorites"
                              />
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Top Doctors - Only show when no hospital is selected */}
            {!selectedHospital && (
            <Card className="mb-6 border-round-xl shadow-2">
              <div className="flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-900 mt-0 mb-1">Top Rated Doctors</h3>
                  <p className="text-600 m-0">Highly experienced specialists available for consultation</p>
                </div>
                <Button label="View All" icon="pi pi-arrow-right" iconPos="right" className="p-button-text" />
              </div>
              <div className="grid">
                {topDoctors.map((doctor) => (
                  <div key={doctor.id} className="col-12 md:col-6 lg:col-4">
                    <Card className="h-full border-round-lg shadow-2 hover:shadow-4 transition-all duration-300">
                      <div className="flex flex-column h-full">
                        <div className="flex align-items-center mb-4">
                          <Avatar 
                            image={getDoctorImage(doctor.id)}
                            className="mr-3"
                            size="xlarge"
                            shape="circle"
                          />
                          <div className="flex-1">
                            <h4 className="text-900 font-bold m-0 mb-1">Dr. {doctor.firstName} {doctor.lastName}</h4>
                            <p className="text-600 text-sm m-0 mb-1">{doctor.specialization}</p>
                            <p className="text-500 text-xs m-0">{doctor.experience || 10}+ years experience</p>
                          </div>
                        </div>
                        
                        <div className="flex align-items-center justify-content-between mb-3">
                          <div className="flex align-items-center">
                            <Rating value={doctor.rating || 4.5} readOnly cancel={false} className="mr-2" />
                            <span className="text-900 font-bold">{doctor.rating || 4.5}</span>
                          </div>
                          <span className="text-600 text-sm">({doctor.totalReviews || 0} reviews)</span>
                        </div>
                        
                        <div className="flex align-items-center justify-content-between mb-3">
                          <div className="flex align-items-center gap-2">
                            <i className="pi pi-rupee text-primary"></i>
                            <span className="text-2xl font-bold text-900">{doctor.consultationFee}</span>
                          </div>
                          <Tag value="Available Today" severity="success" className="font-semibold" />
                        </div>
                        
                        <div className="flex align-items-center gap-2 mb-4">
                          <i className="pi pi-video text-primary"></i>
                          <span className="text-600 text-sm">Video Consultation Available</span>
                        </div>
                        
                        <div className="mt-auto flex gap-2">
                          <Button
                            label="Book Now"
                            className="flex-1 font-semibold"
                            onClick={() => handleBookAppointment(doctor.id)}
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                          />
                          <Button 
                            icon="pi pi-heart" 
                            className="p-button-outlined"
                            tooltip="Add to Favorites"
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </Card>
            )}

            {/* Personalized Recommendations - Only show when no hospital is selected */}
            {!selectedHospital && (
            <Card className="mb-6 border-round-xl shadow-2" style={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
              <div className="flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-900 mt-0 mb-1">Recommended for You</h3>
                  <p className="text-700 m-0">Personalized suggestions based on your health profile</p>
                </div>
                <Button label="View All" icon="pi pi-arrow-right" iconPos="right" className="p-button-text" />
              </div>
              <div className="grid">
                {suggestedDoctors.map((doctor) => (
                  <div key={doctor.id} className="col-12 md:col-6">
                    <Card className="border-round-lg shadow-1 bg-white">
                      <div className="flex align-items-center">
                        <Avatar 
                          image={getDoctorImage(doctor.id)}
                          className="mr-3"
                          size="large"
                          shape="circle"
                        />
                        <div className="flex-1">
                          <h5 className="text-900 font-bold m-0 mb-1">Dr. {doctor.firstName} {doctor.lastName}</h5>
                          <p className="text-600 text-sm m-0 mb-2">{doctor.specialization}</p>
                          <div className="flex align-items-center gap-3">
                            <div className="flex align-items-center">
                              <Rating value={doctor.rating || 4.5} readOnly cancel={false} className="mr-1" />
                              <span className="text-900 font-medium text-sm">{doctor.rating || 4.5}</span>
                            </div>
                            <span className="text-900 font-bold">₹{doctor.consultationFee}</span>
                          </div>
                        </div>
                        <Button 
                          label="Book" 
                          className="font-semibold"
                          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                        />
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </Card>
            )}

            {/* Symptom Checker - Only show when no hospital is selected */}
            {!selectedHospital && (
            <Card className="border-round-xl shadow-2" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-900 mt-0 mb-2">AI Symptom Checker</h3>
                <p className="text-700 m-0">Get instant doctor recommendations based on your symptoms</p>
              </div>
              
              <div className="bg-white border-round-lg p-4 mb-4">
                <h4 className="text-900 font-bold mt-0 mb-3">Common Symptoms</h4>
                <div className="flex flex-wrap gap-2">
                  {symptomsList.map((symptom, index) => (
                    <Chip
                      key={index}
                      label={symptom}
                      onClick={() => handleSymptomClick(symptom)}
                      className="cursor-pointer hover:shadow-2 transition-all duration-200 font-medium"
                      style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none'
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  label="Start AI Health Assessment" 
                  icon="pi pi-android" 
                  className="p-3 px-6 font-semibold text-lg"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                />
              </div>
            </Card>
            )}
          </>
        )}
      </div>

      {/* Booking Modal */}
      <Dialog
        header={`Book Appointment with Dr. ${bookingModal.doctor?.firstName} ${bookingModal.doctor?.lastName}`}
        visible={bookingModal.visible}
        onHide={closeBookingModal}
        style={{ width: '500px' }}
        className="border-round-xl"
      >
        <div className="flex flex-column gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Date</label>
            <Calendar
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.value as Date)}
              minDate={new Date()}
              className="w-full"
              dateFormat="dd/mm/yy"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Select Time Slot</label>
            <div className="grid">
              {timeSlots.map((slot) => (
                <div key={slot} className="col-6">
                  <Button
                    label={slot}
                    className={`w-full mb-2 ${selectedTimeSlot === slot ? 'p-button-success' : 'p-button-outlined'}`}
                    size="small"
                    onClick={() => setSelectedTimeSlot(slot)}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Symptoms (Optional)</label>
            <InputText
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms..."
              className="w-full"
            />
          </div>
          
          {bookingModal.doctor && (
            <div className="bg-blue-50 p-3 border-round">
              <div className="flex justify-content-between align-items-center">
                <span className="font-medium">Consultation Fee:</span>
                <span className="text-lg font-bold text-primary">₹{bookingModal.doctor.consultationFee}</span>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              label="Cancel"
              className="flex-1"
              severity="secondary"
              outlined
              onClick={closeBookingModal}
            />
            <Button
              label="Proceed to Payment"
              className="flex-1"
              disabled={!selectedDate || !selectedTimeSlot}
              onClick={confirmBooking}
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
            />
          </div>
        </div>
      </Dialog>

      {/* Payment Modal */}
      <Dialog
        header="Payment Details"
        visible={showPayment}
        onHide={() => setShowPayment(false)}
        style={{ width: '500px' }}
        className="border-round-xl"
      >
        <div className="flex flex-column gap-4">
          <div className="bg-blue-50 p-4 border-round">
            <h4 className="mt-0 mb-2">Appointment Summary</h4>
            <div className="flex justify-content-between mb-2">
              <span>Doctor:</span>
              <span className="font-bold">Dr. {bookingModal.doctor?.firstName} {bookingModal.doctor?.lastName}</span>
            </div>
            <div className="flex justify-content-between mb-2">
              <span>Date:</span>
              <span className="font-bold">{selectedDate?.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-content-between mb-2">
              <span>Time:</span>
              <span className="font-bold">{selectedTimeSlot}</span>
            </div>
            <div className="flex justify-content-between">
              <span>Consultation Fee:</span>
              <span className="text-2xl font-bold text-primary">₹{bookingModal.doctor?.consultationFee}</span>
            </div>
          </div>

          <div>
            <h4 className="mb-3">Select Payment Method</h4>
            <div className="flex flex-column gap-3">
              <div className="flex align-items-center">
                <RadioButton
                  inputId="card"
                  name="payment"
                  value="card"
                  onChange={(e) => setSelectedPaymentMethod(e.value)}
                  checked={selectedPaymentMethod === 'card'}
                />
                <label htmlFor="card" className="ml-2 flex align-items-center gap-2">
                  <i className="pi pi-credit-card text-primary"></i>
                  Credit/Debit Card
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="upi"
                  name="payment"
                  value="upi"
                  onChange={(e) => setSelectedPaymentMethod(e.value)}
                  checked={selectedPaymentMethod === 'upi'}
                />
                <label htmlFor="upi" className="ml-2 flex align-items-center gap-2">
                  <i className="pi pi-mobile text-primary"></i>
                  UPI Payment
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="wallet"
                  name="payment"
                  value="wallet"
                  onChange={(e) => setSelectedPaymentMethod(e.value)}
                  checked={selectedPaymentMethod === 'wallet'}
                />
                <label htmlFor="wallet" className="ml-2 flex align-items-center gap-2">
                  <i className="pi pi-wallet text-primary"></i>
                  Digital Wallet
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="netbanking"
                  name="payment"
                  value="netbanking"
                  onChange={(e) => setSelectedPaymentMethod(e.value)}
                  checked={selectedPaymentMethod === 'netbanking'}
                />
                <label htmlFor="netbanking" className="ml-2 flex align-items-center gap-2">
                  <i className="pi pi-building text-primary"></i>
                  Net Banking
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="cash"
                  name="payment"
                  value="cash"
                  onChange={(e) => setSelectedPaymentMethod(e.value)}
                  checked={selectedPaymentMethod === 'cash'}
                />
                <label htmlFor="cash" className="ml-2 flex align-items-center gap-2">
                  <i className="pi pi-money-bill text-primary"></i>
                  Cash at Counter
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              label="Back"
              className="flex-1"
              severity="secondary"
              outlined
              onClick={() => setShowPayment(false)}
            />
            <Button
              label={processing ? 'Processing...' : 'Pay Now'}
              className="flex-1"
              loading={processing}
              disabled={!selectedPaymentMethod}
              onClick={processPayment}
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
            />
          </div>
        </div>
      </Dialog>

      {/* Success Modal */}
      <Dialog
        visible={showSuccess}
        onHide={() => setShowSuccess(false)}
        style={{ width: '400px' }}
        className="border-round-xl"
        closable={false}
      >
        <div className="text-center p-4">
          <div className="mb-4">
            <i className="pi pi-check-circle text-6xl text-green-500"></i>
          </div>
          <h2 className="text-green-600 font-bold mb-3">Payment Successful!</h2>
          <p className="text-600 mb-4">Your appointment has been booked successfully.</p>
          <div className="bg-green-50 p-3 border-round mb-4">
            <p className="text-sm text-green-800 m-0">
              <strong>Appointment ID:</strong> #APT{Date.now().toString().slice(-6)}
            </p>
          </div>
          <p className="text-sm text-500">You will receive a confirmation email shortly.</p>
        </div>
      </Dialog>

      {/* Location Selection Modal */}
      <Dialog
        header="Select Location"
        visible={showLocationModal}
        onHide={() => setShowLocationModal(false)}
        style={{ width: '400px' }}
        className="border-round-xl"
      >
        <div className="flex flex-column gap-3">
          <h4 className="mt-0 mb-3">Choose your city</h4>
          {[
            'Hyderabad, Telangana',
            'Bangalore, Karnataka', 
            'Chennai, Tamil Nadu',
            'Mumbai, Maharashtra',
            'Delhi, NCR',
            'Pune, Maharashtra',
            'Kolkata, West Bengal',
            'Ahmedabad, Gujarat'
          ].map((city) => (
            <div 
              key={city}
              className={`p-3 border-round cursor-pointer transition-colors ${
                selectedLocation === city ? 'bg-blue-100 border-primary' : 'bg-white hover:bg-blue-50'
              }`}
              style={{ border: selectedLocation === city ? '2px solid #1e40af' : '1px solid #e5e7eb' }}
              onClick={() => {
                setSelectedLocation(city);
                setShowLocationModal(false);
              }}
            >
              <div className="flex align-items-center justify-content-between">
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-map-marker text-primary"></i>
                  <span className="font-medium">{city}</span>
                </div>
                {selectedLocation === city && (
                  <i className="pi pi-check text-primary"></i>
                )}
              </div>
            </div>
          ))}
        </div>
      </Dialog>

      {/* Reschedule Modal */}
      <Dialog
        header="Reschedule Appointment"
        visible={rescheduleModal.visible}
        onHide={() => {
          setRescheduleModal({ visible: false, appointment: null });
          setNewDate(null);
          setNewTimeSlot('');
        }}
        style={{ width: '500px' }}
        className="border-round-xl"
      >
        {rescheduleModal.appointment && (
          <div className="flex flex-column gap-4">
            <div className="bg-blue-50 p-3 border-round">
              <h4 className="mt-0 mb-2">Current Appointment</h4>
              <div className="flex justify-content-between mb-2">
                <span>Doctor:</span>
                <span className="font-bold">
                  Dr. {rescheduleModal.appointment.doctor?.name || 
                      `${rescheduleModal.appointment.doctor?.firstName || ''} ${rescheduleModal.appointment.doctor?.lastName || ''}`.trim()}
                </span>
              </div>
              <div className="flex justify-content-between mb-2">
                <span>Current Date:</span>
                <span className="font-bold">{new Date(rescheduleModal.appointment.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-content-between">
                <span>Current Time:</span>
                <span className="font-bold">{rescheduleModal.appointment.timeRange}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Select New Date</label>
              <Calendar
                value={newDate}
                onChange={(e) => setNewDate(e.value as Date)}
                minDate={new Date()}
                className="w-full"
                dateFormat="dd/mm/yy"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Select New Time Slot</label>
              <div className="grid">
                {timeSlots.map((slot) => (
                  <div key={slot} className="col-6">
                    <Button
                      label={slot}
                      className={`w-full mb-2 ${newTimeSlot === slot ? 'p-button-success' : 'p-button-outlined'}`}
                      size="small"
                      onClick={() => setNewTimeSlot(slot)}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                label="Cancel"
                className="flex-1"
                severity="secondary"
                outlined
                onClick={() => {
                  setRescheduleModal({ visible: false, appointment: null });
                  setNewDate(null);
                  setNewTimeSlot('');
                }}
              />
              <Button
                label="Confirm Reschedule"
                className="flex-1"
                disabled={!newDate || !newTimeSlot}
                onClick={() => {
                  // Update appointment with new date/time
                  const updatedAppointment = {
                    ...rescheduleModal.appointment,
                    date: newDate?.toISOString(),
                    timeRange: newTimeSlot
                  };
                  
                  // Update appointments list
                  setAppointments(prev => prev.map(apt => 
                    apt.id === rescheduleModal.appointment.id ? updatedAppointment : apt
                  ));
                  setUpcomingAppointments(prev => prev.map(apt => 
                    apt.id === rescheduleModal.appointment.id ? updatedAppointment : apt
                  ));
                  
                  // Update localStorage
                  const storageKey = `userAppointments_${user?.id}`;
                  const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
                  const updated = stored.map((apt: any) => 
                    apt.id === rescheduleModal.appointment.id ? updatedAppointment : apt
                  );
                  localStorage.setItem(storageKey, JSON.stringify(updated));
                  
                  // Close modal
                  setRescheduleModal({ visible: false, appointment: null });
                  setNewDate(null);
                  setNewTimeSlot('');
                  
                  alert('Appointment rescheduled successfully!');
                }}
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
              />
            </div>
          </div>
        )}
      </Dialog>

      {/* Appointment Details Modal */}
      <Dialog
        header="Appointment Details"
        visible={appointmentDetailsModal.visible}
        onHide={() => setAppointmentDetailsModal({ visible: false, appointment: null })}
        style={{ width: '500px' }}
        className="border-round-xl"
      >
        {appointmentDetailsModal.appointment && (
          <div className="flex flex-column gap-4">
            <div className="flex align-items-center gap-3 mb-3">
              <Avatar 
                image={getDoctorImage(appointmentDetailsModal.appointment.doctorId || appointmentDetailsModal.appointment.id)}
                size="xlarge"
                shape="circle"
              />
              <div>
                <h3 className="m-0 mb-1">
                  Dr. {appointmentDetailsModal.appointment.doctor?.name || 
                      `${appointmentDetailsModal.appointment.doctor?.firstName || ''} ${appointmentDetailsModal.appointment.doctor?.lastName || ''}`.trim()}
                </h3>
                <p className="text-600 m-0">{appointmentDetailsModal.appointment.specialization}</p>
              </div>
            </div>
            
            <div className="grid">
              <div className="col-6">
                <label className="block text-sm font-semibold text-700 mb-1">Hospital</label>
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-building text-primary"></i>
                  <span>{appointmentDetailsModal.appointment.hospitalName}</span>
                </div>
              </div>
              <div className="col-6">
                <label className="block text-sm font-semibold text-700 mb-1">Date</label>
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-calendar text-primary"></i>
                  <span>{new Date(appointmentDetailsModal.appointment.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="col-6">
                <label className="block text-sm font-semibold text-700 mb-1">Time</label>
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-clock text-primary"></i>
                  <span>{appointmentDetailsModal.appointment.timeRange}</span>
                </div>
              </div>
              <div className="col-6">
                <label className="block text-sm font-semibold text-700 mb-1">Duration</label>
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-stopwatch text-primary"></i>
                  <span>{appointmentDetailsModal.appointment.duration || 30} minutes</span>
                </div>
              </div>
              <div className="col-6">
                <label className="block text-sm font-semibold text-700 mb-1">Payment Method</label>
                <div className="flex align-items-center gap-2">
                  <i className={`pi ${appointmentDetailsModal.appointment.paymentMethod === 'cash' ? 'pi-money-bill' : 
                    appointmentDetailsModal.appointment.paymentMethod === 'card' ? 'pi-credit-card' :
                    appointmentDetailsModal.appointment.paymentMethod === 'upi' ? 'pi-mobile' :
                    appointmentDetailsModal.appointment.paymentMethod === 'wallet' ? 'pi-wallet' : 'pi-building'} text-primary`}></i>
                  <span className="capitalize">
                    {appointmentDetailsModal.appointment.paymentMethod === 'cash' ? 'Cash at Counter' :
                     appointmentDetailsModal.appointment.paymentMethod === 'card' ? 'Credit/Debit Card' :
                     appointmentDetailsModal.appointment.paymentMethod === 'upi' ? 'UPI Payment' :
                     appointmentDetailsModal.appointment.paymentMethod === 'wallet' ? 'Digital Wallet' :
                     appointmentDetailsModal.appointment.paymentMethod === 'netbanking' ? 'Net Banking' :
                     appointmentDetailsModal.appointment.paymentMethod}
                  </span>
                </div>
              </div>
              <div className="col-6">
                <label className="block text-sm font-semibold text-700 mb-1">Payment Status</label>
                <Tag 
                  value={appointmentDetailsModal.appointment.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'} 
                  severity={appointmentDetailsModal.appointment.paymentStatus === 'paid' ? 'success' : 'danger'} 
                  className="font-semibold"
                />
              </div>
              <div className="col-12">
                <label className="block text-sm font-semibold text-700 mb-1">Queue Information</label>
                <div className="bg-blue-50 p-3 border-round">
                  {(() => {
                    const queuePosition = calculateQueuePosition(appointmentDetailsModal.appointment);
                    const waitTime = getEstimatedWaitTime(queuePosition);
                    const ordinal = queuePosition === 1 ? '1st' : queuePosition === 2 ? '2nd' : queuePosition === 3 ? '3rd' : `${queuePosition}th`;
                    return (
                      <>
                        <div className="flex align-items-center gap-2 mb-2">
                          <i className="pi pi-users text-primary"></i>
                          <span className="font-semibold">
                            Queue Position: {ordinal} in line
                          </span>
                        </div>
                        <div className="flex align-items-center gap-2">
                          <i className="pi pi-clock text-primary"></i>
                          <span>Estimated Wait Time: {waitTime}</span>
                        </div>
                        <div className="text-xs text-500 mt-2">
                          Based on {appointments.filter(apt => 
                            apt.doctorId === appointmentDetailsModal.appointment.doctorId &&
                            new Date(apt.date).toDateString() === new Date(appointmentDetailsModal.appointment.date).toDateString()
                          ).length} appointments for this doctor today
                        </div>
                      </>
                    );
                  })()} 
                </div>
              </div>
              {appointmentDetailsModal.appointment.notes && (
                <div className="col-12">
                  <label className="block text-sm font-semibold text-700 mb-1">Notes</label>
                  <div className="bg-gray-50 p-3 border-round">
                    <span>{appointmentDetailsModal.appointment.notes}</span>
                  </div>
                </div>
              )}
              <div className="col-12">
                <label className="block text-sm font-semibold text-700 mb-1">Rejoin Status</label>
                <div className="bg-blue-50 p-3 border-round">
                  <div className="flex align-items-center gap-2 mb-2">
                    <i className={`pi ${appointmentDetailsModal.appointment.labsCompleted ? 'pi-check-circle text-green-500' : 'pi-clock text-orange-500'}`}></i>
                    <span>Labs: {appointmentDetailsModal.appointment.labsCompleted ? 'Completed' : 'Pending'}</span>
                  </div>
                  <div className="flex align-items-center gap-2 mb-2">
                    <i className={`pi ${appointmentDetailsModal.appointment.doctorApproval ? 'pi-check-circle text-green-500' : 'pi-clock text-orange-500'}`}></i>
                    <span>Doctor Approval: {appointmentDetailsModal.appointment.doctorApproval ? 'Approved' : 'Pending'}</span>
                  </div>
                  <div className="flex align-items-center justify-content-between">
                    <Tag 
                      value={appointmentDetailsModal.appointment.canRejoin ? 'Can Rejoin' : 'Cannot Rejoin'} 
                      severity={appointmentDetailsModal.appointment.canRejoin ? 'success' : 'warning'} 
                      className="font-semibold"
                    />
                    <Button
                      label="Reschedule"
                      icon="pi pi-calendar"
                      size="small"
                      severity="warning"
                      outlined
                      onClick={() => {
                        setRescheduleModal({ visible: true, appointment: appointmentDetailsModal.appointment });
                        setAppointmentDetailsModal({ visible: false, appointment: null });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button
                label="Close"
                className="flex-1"
                severity="secondary"
                outlined
                onClick={() => setAppointmentDetailsModal({ visible: false, appointment: null })}
              />
              <Button
                label="Join Consultation"
                icon="pi pi-video"
                className="flex-1"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default PatientDashboard;