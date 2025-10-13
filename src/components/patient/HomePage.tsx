'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Slider } from 'primereact/slider';
import { ToggleButton } from 'primereact/togglebutton';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { TabView, TabPanel } from 'primereact/tabview';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { apiClient } from '../../services/api/apiClient';
import { Hospital, Doctor } from '../../types/models';
import LogoutButton from '../common/LogoutButton';
import QuickBooking from '../common/QuickBooking';

const HomePage: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [symptomSearch, setSymptomSearch] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchingDoctors, setSearchingDoctors] = useState(false);
  const [bookingModal, setBookingModal] = useState({ visible: false, doctor: null as Doctor | null });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [booking, setBooking] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [hospitalDoctors, setHospitalDoctors] = useState<Doctor[]>([]);
  const [loadingHospitalDoctors, setLoadingHospitalDoctors] = useState(false);
  const [paymentModal, setPaymentModal] = useState({ visible: false, appointmentData: null as any });
  const [processing, setProcessing] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({ visible: false, appointmentData: null as any });
  const [filters, setFilters] = useState({
    department: '',
    feeRange: [0, 5000],
    rating: 0,
    availability: false,
    sortBy: 'relevance'
  });

  const departments = [
    { label: 'All Departments', value: '' },
    { label: 'Cardiology', value: 'cardiology' },
    { label: 'Neurology', value: 'neurology' },
    { label: 'Orthopedics', value: 'orthopedics' },
    { label: 'Pediatrics', value: 'pediatrics' },
    { label: 'General Medicine', value: 'general' }
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

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    // Mock appointments data
    setTimeout(() => {
      setAppointments([]);
      setLoadingAppointments(false);
    }, 500);
  };

  const getFilteredAppointments = (type: 'upcoming' | 'past' | 'all') => {
    const now = new Date();
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date + ' ' + appointment.timeRange.start);
      if (type === 'upcoming') return appointmentDate >= now;
      if (type === 'past') return appointmentDate < now;
      return true;
    });
  };

  const fetchHospitals = async () => {
    try {
      console.log('Fetching hospitals from:', `${process.env.NEXT_PUBLIC_API_URL}/hospitals?city=Hyderabad`);
      const response = await apiClient.get('/hospitals?city=Hyderabad');
      console.log('Hospitals response:', response.data);
      setHospitals(response.data || []);
    } catch (error: any) {
      console.error('Error fetching hospitals:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSymptomSearch = async () => {
    if (!symptomSearch.trim()) return;
    
    setSearchingDoctors(true);
    
    // Different doctors based on symptoms
    const symptomLower = symptomSearch.toLowerCase();
    let mockDoctors = [];
    
    if (symptomLower.includes('heart') || symptomLower.includes('chest') || symptomLower.includes('cardiac')) {
      mockDoctors = [
        {
          id: 'doc1',
          name: 'Dr. Amit Patel',
          specialization: 'Cardiology',
          rating: 4.8,
          consultationFee: 800,
          rejoinEnabled: true
        },
        {
          id: 'doc2',
          name: 'Dr. Sarah Khan',
          specialization: 'Cardiology',
          rating: 4.6,
          consultationFee: 750,
          rejoinEnabled: true
        }
      ];
    } else if (symptomLower.includes('headache') || symptomLower.includes('migraine') || symptomLower.includes('brain')) {
      mockDoctors = [
        {
          id: 'doc3',
          name: 'Dr. Neha Gupta',
          specialization: 'Neurology',
          rating: 4.7,
          consultationFee: 900,
          rejoinEnabled: true
        },
        {
          id: 'doc4',
          name: 'Dr. Ravi Sharma',
          specialization: 'Neurology',
          rating: 4.5,
          consultationFee: 850,
          rejoinEnabled: false
        }
      ];
    } else if (symptomLower.includes('bone') || symptomLower.includes('joint') || symptomLower.includes('fracture')) {
      mockDoctors = [
        {
          id: 'doc5',
          name: 'Dr. Vikram Singh',
          specialization: 'Orthopedics',
          rating: 4.6,
          consultationFee: 700,
          rejoinEnabled: true
        },
        {
          id: 'doc6',
          name: 'Dr. Meera Joshi',
          specialization: 'Orthopedics',
          rating: 4.4,
          consultationFee: 650,
          rejoinEnabled: true
        }
      ];
    } else {
      // General symptoms - show general medicine doctors
      mockDoctors = [
        {
          id: 'doc7',
          name: 'Dr. Rajesh Kumar',
          specialization: 'General Medicine',
          rating: 4.5,
          consultationFee: 500,
          rejoinEnabled: true
        },
        {
          id: 'doc8',
          name: 'Dr. Priya Sharma',
          specialization: 'Internal Medicine',
          rating: 4.7,
          consultationFee: 600,
          rejoinEnabled: false
        }
      ];
    }
    
    setTimeout(() => {
      setDoctors(mockDoctors);
      setSearchingDoctors(false);
    }, 1000);
  };

  const fetchDoctorsWithFilters = async () => {
    setSearchingDoctors(true);
    try {
      const params = new URLSearchParams();
      if (filters.department) params.append('department', filters.department);
      if (filters.feeRange[0] > 0) params.append('minFee', filters.feeRange[0].toString());
      if (filters.feeRange[1] < 5000) params.append('maxFee', filters.feeRange[1].toString());
      if (filters.rating > 0) params.append('rating', filters.rating.toString());
      if (filters.availability) params.append('availability', 'true');
      params.append('sortBy', filters.sortBy);
      
      const response = await apiClient.get(`/doctors?${params.toString()}`);
      setDoctors(response.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    } finally {
      setSearchingDoctors(false);
    }
  };

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDoctorsWithFilters();
    }
  }, [filters]);

  const openBookingModal = (doctor: Doctor) => {
    setBookingModal({ visible: true, doctor });
    setSelectedDate(null);
    setSelectedTimeSlot('');
    setSymptoms('');
  };

  const closeBookingModal = () => {
    setBookingModal({ visible: false, doctor: null });
  };

  const handleBookAppointment = async () => {
    console.log('handleBookAppointment called');
    console.log('selectedDate:', selectedDate);
    console.log('selectedTimeSlot:', selectedTimeSlot);
    console.log('bookingModal.doctor:', bookingModal.doctor);
    console.log('user:', user);
    
    if (!selectedDate || !selectedTimeSlot || !bookingModal.doctor || !user) {
      alert('Please select date and time.');
      return;
    }

    setBooking(true);
    
    const requestData = {
      patientId: 'temp_patient_id',
      doctorId: bookingModal.doctor.id,
      date: selectedDate.toISOString(),
      timeRange: selectedTimeSlot,
      notes: symptoms,
      duration: 30
    };
    
    console.log('Sending request data:', requestData);
    
    try {
      const response = await apiClient.post('/appointments', requestData);
      console.log('Response data:', response.data);
      
      // Show payment modal
      setPaymentModal({ 
        visible: true, 
        appointmentData: {
          appointmentId: response.data.id || 'local-' + Date.now(),
          doctor: bookingModal.doctor,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          amount: bookingModal.doctor.consultationFee
        }
      });
      closeBookingModal();
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to book appointment. Please try again.';
      alert(errorMessage);
    } finally {
      setBooking(false);
    }
  };

  const handleViewQueue = (appointmentId: string) => {
    console.log('View queue for appointment:', appointmentId);
  };

  const handleReschedule = (appointmentId: string) => {
    console.log('Reschedule appointment:', appointmentId);
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      await apiClient.delete(`/appointments/${appointmentId}`);
      fetchAppointments();
      alert('Appointment cancelled successfully');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment');
    }
  };

  const handleRejoin = (appointmentId: string) => {
    console.log('Rejoin appointment:', appointmentId);
  };

  const handlePayment = async (method: string) => {
    setProcessing(true);
    
    setTimeout(() => {
      setProcessing(false);
      const appointmentData = {
        ...paymentModal.appointmentData,
        paymentMethod: method,
        bookingId: 'BK' + Date.now(),
        transactionId: 'TXN' + Date.now()
      };
      
      // Add new appointment to local state
      const newAppointment = {
        id: appointmentData.appointmentId,
        bookingId: appointmentData.bookingId,
        date: appointmentData.date.toISOString().split('T')[0],
        timeRange: {
          start: appointmentData.timeSlot,
          end: appointmentData.timeSlot
        },
        doctor: appointmentData.doctor,
        hospital: { name: 'Apollo Hospitals Hyderabad' },
        paymentStatus: 'paid',
        status: 'confirmed'
      };
      
      setAppointments(prev => [newAppointment, ...prev]);
      setPaymentModal({ visible: false, appointmentData: null });
      setConfirmationModal({ visible: true, appointmentData });
    }, 2000);
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({ visible: false, appointmentData: null });
  };

  const closePaymentModal = () => {
    setPaymentModal({ visible: false, appointmentData: null });
  };

  useEffect(() => {
    setMounted(true);
    fetchHospitals();
    fetchAppointments();
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex align-items-center justify-content-center">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-primary mb-3"></i>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const handleHospitalClick = (hospital: Hospital) => {
    console.log('Hospital clicked:', hospital.name);
  };

  const handleBookFromHospital = async (hospitalId: string) => {
    setLoadingHospitalDoctors(true);
    try {
      const response = await apiClient.get('/doctors');
      setHospitalDoctors(response.data || []);
    } catch (error) {
      console.error('Error fetching hospital doctors:', error);
      setHospitalDoctors([]);
    } finally {
      setLoadingHospitalDoctors(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Navbar */}
      <nav className="bg-white shadow-2 border-bottom-1 surface-border sticky top-0 z-5">
        <div className="px-4 py-3">
          <div className="flex justify-content-between align-items-center">
            {/* Logo and Brand */}
            <div className="flex align-items-center gap-3">
              <div className="bg-primary border-circle w-3rem h-3rem flex align-items-center justify-content-center">
                <i className="pi pi-heart text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-primary font-bold m-0 text-2xl">HealthHub</h2>
                <p className="text-xs text-500 m-0">Your Health, Our Priority</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex align-items-center gap-4">
              <Button 
                label="Dashboard" 
                className="p-button-text text-700 font-medium"
                icon="pi pi-home"
              />
              <Button 
                label="Appointments" 
                className="p-button-text text-700 font-medium"
                icon="pi pi-calendar"
              />
              <Button 
                label="Doctors" 
                className="p-button-text text-700 font-medium"
                icon="pi pi-user-md"
              />
              <Button 
                label="Profile" 
                className="p-button-text text-700 font-medium"
                icon="pi pi-user"
              />
            </div>

            {/* User Info and Actions */}
            <div className="flex align-items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-700 m-0">Good Morning</p>
                <p className="text-xs text-500 m-0">{user?.name}</p>
              </div>
              <div className="bg-blue-100 border-circle w-2rem h-2rem flex align-items-center justify-content-center">
                <i className="pi pi-user text-blue-600"></i>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="p-4">
        {/* Nearby Hospitals */}
        <Card className="mb-4">
          <h2 className="text-xl font-semibold mb-3 mt-0">Nearby Hospitals</h2>
          {loading ? (
            <div className="text-center py-4">
              <i className="pi pi-spinner pi-spin text-2xl text-primary"></i>
              <p className="text-gray-500 mt-2">Loading hospitals...</p>
            </div>
          ) : (
            <div className="grid">
              {hospitals.map((hospital) => (
                <div key={hospital.id} className="col-12 md:col-6 lg:col-4">
                  <Card 
                    className="h-full cursor-pointer hover:shadow-lg transition-all duration-200"
                    onClick={() => handleHospitalClick(hospital)}
                  >
                    <div className="flex flex-column h-full">
                      <h3 className="text-lg font-semibold mb-2 mt-0">{hospital.name}</h3>
                      <div className="flex align-items-center mb-2">
                        <span className="mr-1">⭐</span>
                        <span className="font-medium">{hospital.rating}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {hospital.departments?.slice(0, 3).map((dept) => (
                          <span key={dept.id} className="bg-blue-100 text-blue-800 px-2 py-1 border-round text-xs">
                            {dept.name}
                          </span>
                        )) || []}
                      </div>
                      <div className="flex justify-content-between align-items-center mt-auto">
                        <span className="text-green-600">
                          🟢 Open
                        </span>
                        <Button
                          label="Book Appointment"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookFromHospital(hospital.id);
                          }}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Hospital Doctors */}
        {hospitalDoctors.length > 0 && (
          <Card className="mb-4">
            <h2 className="text-xl font-semibold mb-3 mt-0">Available Doctors</h2>
            {loadingHospitalDoctors ? (
              <div className="text-center py-4">
                <i className="pi pi-spinner pi-spin text-2xl text-primary"></i>
                <p className="text-gray-500 mt-2">Loading doctors...</p>
              </div>
            ) : (
              <div className="grid">
                {hospitalDoctors.map((doctor) => (
                  <div key={doctor.id} className="col-12 md:col-6 lg:col-4">
                    <Card className="h-full">
                      <div className="flex flex-column h-full">
                        <h3 className="text-lg font-semibold mb-1 mt-0">{doctor.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{doctor.specialization}</p>
                        <div className="flex align-items-center mb-2">
                          <span className="mr-1">⭐</span>
                          <span className="font-medium">{doctor.rating}</span>
                        </div>
                        <p className="text-sm font-medium mb-3">₹{doctor.consultationFee}</p>
                        <Button
                          label="Book Now"
                          className="mt-auto"
                          size="small"
                          onClick={() => openBookingModal(doctor)}
                        />
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Top Doctors */}
        <Card className="mb-4">
          <h2 className="text-xl font-semibold mb-3 mt-0">Top Doctors</h2>
          <div className="grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="col-12 md:col-6 lg:col-3">
                <div className="bg-gray-100 border-round p-4 text-center">
                  <i className="pi pi-user-md text-4xl text-gray-400 mb-2"></i>
                  <p className="text-gray-500 m-0">Doctor {i}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Find Doctors by Symptoms */}
        <Card className="mb-4">
          <h2 className="text-xl font-semibold mb-3 mt-0">Find Doctors by Symptoms</h2>
          <div className="flex gap-2 mb-4">
            <InputText
              value={symptomSearch}
              onChange={(e) => setSymptomSearch(e.target.value)}
              placeholder="Describe your symptoms..."
              className="flex-1"
            />
            <Button
              label="Search"
              icon={searchingDoctors ? "pi pi-spinner pi-spin" : "pi pi-search"}
              onClick={handleSymptomSearch}
              loading={searchingDoctors}
            />
          </div>
          
          {doctors.length > 0 && (
            <>
              {/* Filters */}
              <Card className="mb-4 bg-gray-50">
                <div className="grid">
                  <div className="col-12 md:col-6 lg:col-2">
                    <label className="block text-sm font-medium mb-1">Department</label>
                    <Dropdown
                      value={filters.department}
                      options={departments}
                      onChange={(e) => updateFilter('department', e.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="col-12 md:col-6 lg:col-2">
                    <label className="block text-sm font-medium mb-1">Fee Range</label>
                    <Slider
                      value={filters.feeRange}
                      onChange={(e) => updateFilter('feeRange', e.value)}
                      range
                      min={0}
                      max={5000}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-content-between text-xs text-gray-500 mt-1">
                      <span>₹{filters.feeRange[0]}</span>
                      <span>₹{filters.feeRange[1]}</span>
                    </div>
                  </div>
                  <div className="col-12 md:col-6 lg:col-2">
                    <label className="block text-sm font-medium mb-1">Rating</label>
                    <Dropdown
                      value={filters.rating}
                      options={ratingOptions}
                      onChange={(e) => updateFilter('rating', e.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="col-12 md:col-6 lg:col-2">
                    <label className="block text-sm font-medium mb-1">Available Now</label>
                    <ToggleButton
                      checked={filters.availability}
                      onChange={(e) => updateFilter('availability', e.value)}
                      onLabel="Yes"
                      offLabel="No"
                      className="w-full"
                    />
                  </div>
                  <div className="col-12 md:col-6 lg:col-2">
                    <label className="block text-sm font-medium mb-1">Sort By</label>
                    <Dropdown
                      value={filters.sortBy}
                      options={sortOptions}
                      onChange={(e) => updateFilter('sortBy', e.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </Card>
              
              {/* Doctor Cards */}
              <div className="grid">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="col-12 md:col-6 lg:col-4">
                    <Card className="h-full">
                      <div className="flex flex-column h-full">
                        <h3 className="text-lg font-semibold mb-1 mt-0">{doctor.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{doctor.specialization}</p>
                        <div className="flex align-items-center mb-2">
                          <span className="mr-1">⭐</span>
                          <span className="font-medium">{doctor.rating}</span>
                        </div>
                        <p className="text-sm font-medium mb-3">₹{doctor.consultationFee}</p>
                        <Button
                          label="Book Now"
                          className="mt-auto"
                          size="small"
                          onClick={() => openBookingModal(doctor)}
                        />
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>



        {/* My Appointments */}
        <Card>
          <h2 className="text-xl font-semibold mb-3 mt-0">My Appointments</h2>
          {loadingAppointments ? (
            <div className="text-center py-4">
              <i className="pi pi-spinner pi-spin text-2xl text-primary"></i>
              <p className="text-gray-500 mt-2">Loading appointments...</p>
            </div>
          ) : (
            <TabView>
              <TabPanel header="Upcoming">
                <div className="grid">
                  {getFilteredAppointments('upcoming').map((appointment) => (
                    <div key={appointment.id} className="col-12 md:col-6">
                      <Card className="mb-3">
                        <div className="flex flex-column gap-2">
                          <div className="flex justify-content-between align-items-start">
                            <div>
                              <p className="text-sm text-gray-600 m-0">Booking ID: {appointment.bookingId}</p>
                              <h4 className="mt-1 mb-1">{appointment.hospital?.name}</h4>
                              <p className="text-sm font-medium m-0">Dr. {appointment.doctor?.name}</p>
                            </div>
                            <span className={`px-2 py-1 border-round text-xs ${
                              appointment.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {appointment.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 m-0">
                            {new Date(appointment.date).toLocaleDateString()} • {appointment.timeRange.start} - {appointment.timeRange.end}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button label="View Queue" size="small" outlined onClick={() => handleViewQueue(appointment.id)} />
                            <Button label="Reschedule" size="small" outlined onClick={() => handleReschedule(appointment.id)} />
                            <Button label="Cancel" size="small" severity="danger" outlined onClick={() => handleCancel(appointment.id)} />
                            <Button 
                              label="Rejoin" 
                              size="small" 
                              disabled={!appointment.doctor?.rejoinEnabled}
                              onClick={() => handleRejoin(appointment.id)} 
                            />
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                  {getFilteredAppointments('upcoming').length === 0 && (
                    <div className="col-12 text-center py-4">
                      <i className="pi pi-calendar text-4xl text-gray-400 mb-3"></i>
                      <p className="text-gray-500 m-0">No upcoming appointments</p>
                    </div>
                  )}
                </div>
              </TabPanel>
              
              <TabPanel header="Past">
                <div className="grid">
                  {getFilteredAppointments('past').map((appointment) => (
                    <div key={appointment.id} className="col-12 md:col-6">
                      <Card className="mb-3">
                        <div className="flex flex-column gap-2">
                          <div className="flex justify-content-between align-items-start">
                            <div>
                              <p className="text-sm text-gray-600 m-0">Booking ID: {appointment.bookingId}</p>
                              <h4 className="mt-1 mb-1">{appointment.hospital?.name}</h4>
                              <p className="text-sm font-medium m-0">Dr. {appointment.doctor?.name}</p>
                            </div>
                            <span className={`px-2 py-1 border-round text-xs ${
                              appointment.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {appointment.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 m-0">
                            {new Date(appointment.date).toLocaleDateString()} • {appointment.timeRange.start} - {appointment.timeRange.end}
                          </p>
                        </div>
                      </Card>
                    </div>
                  ))}
                  {getFilteredAppointments('past').length === 0 && (
                    <div className="col-12 text-center py-4">
                      <i className="pi pi-calendar text-4xl text-gray-400 mb-3"></i>
                      <p className="text-gray-500 m-0">No past appointments</p>
                    </div>
                  )}
                </div>
              </TabPanel>
              
              <TabPanel header="All">
                <div className="grid">
                  {getFilteredAppointments('all').map((appointment) => (
                    <div key={appointment.id} className="col-12 md:col-6">
                      <Card className="mb-3">
                        <div className="flex flex-column gap-2">
                          <div className="flex justify-content-between align-items-start">
                            <div>
                              <p className="text-sm text-gray-600 m-0">Booking ID: {appointment.bookingId}</p>
                              <h4 className="mt-1 mb-1">{appointment.hospital?.name}</h4>
                              <p className="text-sm font-medium m-0">Dr. {appointment.doctor?.name}</p>
                            </div>
                            <span className={`px-2 py-1 border-round text-xs ${
                              appointment.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {appointment.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 m-0">
                            {new Date(appointment.date).toLocaleDateString()} • {appointment.timeRange.start} - {appointment.timeRange.end}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button label="View Queue" size="small" outlined onClick={() => handleViewQueue(appointment.id)} />
                            <Button label="Reschedule" size="small" outlined onClick={() => handleReschedule(appointment.id)} />
                            <Button label="Cancel" size="small" severity="danger" outlined onClick={() => handleCancel(appointment.id)} />
                            <Button 
                              label="Rejoin" 
                              size="small" 
                              disabled={!appointment.doctor?.rejoinEnabled}
                              onClick={() => handleRejoin(appointment.id)} 
                            />
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                  {getFilteredAppointments('all').length === 0 && (
                    <div className="col-12 text-center py-4">
                      <i className="pi pi-calendar text-4xl text-gray-400 mb-3"></i>
                      <p className="text-gray-500 m-0">No appointments found</p>
                    </div>
                  )}
                </div>
              </TabPanel>
            </TabView>
          )}
        </Card>

        {/* Booking Modal */}
        <Dialog
          header={`Book Appointment with Dr. ${bookingModal.doctor?.name}`}
          visible={bookingModal.visible}
          onHide={closeBookingModal}
          style={{ width: '450px' }}
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
              <div className="bg-gray-50 p-3 border-round">
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
                label={booking ? 'Booking...' : 'Confirm & Pay'}
                className="flex-1"
                loading={booking}
                disabled={!selectedDate || !selectedTimeSlot}
                onClick={handleBookAppointment}
              />
            </div>
          </div>
        </Dialog>

        {/* Payment Modal */}
        <Dialog
          header="Complete Payment"
          visible={paymentModal.visible}
          onHide={closePaymentModal}
          style={{ width: '500px' }}
          closable={!processing}
        >
          {paymentModal.appointmentData && (
            <div className="flex flex-column gap-4">
              {/* Appointment Summary */}
              <Card className="bg-blue-50">
                <div className="flex flex-column gap-2">
                  <h4 className="mt-0 mb-2">Appointment Details</h4>
                  <div className="flex justify-content-between">
                    <span>Doctor:</span>
                    <span className="font-medium">Dr. {paymentModal.appointmentData.doctor.name}</span>
                  </div>
                  <div className="flex justify-content-between">
                    <span>Date:</span>
                    <span className="font-medium">{paymentModal.appointmentData.date?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-content-between">
                    <span>Time:</span>
                    <span className="font-medium">{paymentModal.appointmentData.timeSlot}</span>
                  </div>
                  <div className="flex justify-content-between border-top-1 surface-border pt-2">
                    <span className="font-bold">Total Amount:</span>
                    <span className="font-bold text-primary text-xl">₹{paymentModal.appointmentData.amount}</span>
                  </div>
                </div>
              </Card>

              {/* Payment Methods */}
              <div>
                <h4 className="mb-3">Choose Payment Method</h4>
                <div className="flex flex-column gap-3">
                  <Button
                    label="💳 Credit/Debit Card"
                    className="w-full p-3 text-left justify-content-start"
                    outlined
                    loading={processing}
                    onClick={() => handlePayment('card')}
                  />
                  <Button
                    label="📱 UPI Payment"
                    className="w-full p-3 text-left justify-content-start"
                    outlined
                    loading={processing}
                    onClick={() => handlePayment('upi')}
                  />
                  <Button
                    label="🏦 Net Banking"
                    className="w-full p-3 text-left justify-content-start"
                    outlined
                    loading={processing}
                    onClick={() => handlePayment('netbanking')}
                  />
                  <Button
                    label="💰 Wallet"
                    className="w-full p-3 text-left justify-content-start"
                    outlined
                    loading={processing}
                    onClick={() => handlePayment('wallet')}
                  />
                </div>
              </div>

              {processing && (
                <div className="text-center py-3">
                  <i className="pi pi-spinner pi-spin text-2xl text-primary mb-2"></i>
                  <p className="text-primary font-medium">Processing payment...</p>
                </div>
              )}

              {!processing && (
                <div className="flex gap-2">
                  <Button
                    label="Cancel"
                    className="flex-1"
                    severity="secondary"
                    outlined
                    onClick={closePaymentModal}
                  />
                </div>
              )}
            </div>
          )}
        </Dialog>

        {/* Confirmation Modal */}
        <Dialog
          header={null}
          visible={confirmationModal.visible}
          onHide={closeConfirmationModal}
          style={{ width: '600px' }}
          className="confirmation-dialog"
        >
          {confirmationModal.appointmentData && (
            <div className="text-center">
              {/* Success Icon */}
              <div className="mb-4">
                <i className="pi pi-check-circle text-6xl text-green-500 mb-3"></i>
                <h2 className="text-green-600 mt-0 mb-2">Booking Successful!</h2>
                <p className="text-gray-600">Your appointment has been confirmed</p>
              </div>

              {/* Appointment Details Card */}
              <Card className="mb-4 text-left">
                <h3 className="text-center mb-4 mt-0">Appointment Details</h3>
                <div className="grid">
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Booking ID</label>
                      <p className="font-bold text-primary m-0">{confirmationModal.appointmentData.bookingId}</p>
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Doctor</label>
                      <p className="font-medium m-0">Dr. {confirmationModal.appointmentData.doctor.name}</p>
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Specialization</label>
                      <p className="m-0">{confirmationModal.appointmentData.doctor.specialization}</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                      <p className="font-medium m-0">{confirmationModal.appointmentData.date?.toLocaleDateString()}</p>
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Time</label>
                      <p className="font-medium m-0">{confirmationModal.appointmentData.timeSlot}</p>
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Consultation Fee</label>
                      <p className="font-bold text-primary m-0">₹{confirmationModal.appointmentData.amount}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payment Details Card */}
              <Card className="mb-4 text-left bg-green-50">
                <h4 className="text-center mb-3 mt-0 text-green-700">Payment Details</h4>
                <div className="flex justify-content-between align-items-center mb-2">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">{confirmationModal.appointmentData.transactionId}</span>
                </div>
                <div className="flex justify-content-between align-items-center mb-2">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">{confirmationModal.appointmentData.paymentMethod}</span>
                </div>
                <div className="flex justify-content-between align-items-center mb-2">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-bold text-green-600">₹{confirmationModal.appointmentData.amount}</span>
                </div>
                <div className="flex justify-content-between align-items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 border-round text-sm font-medium">Paid</span>
                </div>
              </Card>

              {/* Important Notes */}
              <Card className="mb-4 text-left bg-blue-50">
                <h4 className="mt-0 mb-3 text-blue-700">Important Information</h4>
                <ul className="list-none p-0 m-0">
                  <li className="flex align-items-start mb-2">
                    <i className="pi pi-info-circle text-blue-500 mr-2 mt-1"></i>
                    <span className="text-sm">Please arrive 15 minutes before your appointment time</span>
                  </li>
                  <li className="flex align-items-start mb-2">
                    <i className="pi pi-mobile text-blue-500 mr-2 mt-1"></i>
                    <span className="text-sm">You will receive SMS and email confirmations shortly</span>
                  </li>
                  <li className="flex align-items-start mb-2">
                    <i className="pi pi-calendar text-blue-500 mr-2 mt-1"></i>
                    <span className="text-sm">You can reschedule up to 2 hours before the appointment</span>
                  </li>
                  <li className="flex align-items-start">
                    <i className="pi pi-phone text-blue-500 mr-2 mt-1"></i>
                    <span className="text-sm">For any queries, call our helpline: 1800-123-4567</span>
                  </li>
                </ul>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-content-center">
                <Button
                  label="View My Appointments"
                  icon="pi pi-calendar"
                  className="p-3"
                  onClick={closeConfirmationModal}
                />
                <Button
                  label="Download Receipt"
                  icon="pi pi-download"
                  className="p-3"
                  severity="secondary"
                  outlined
                  onClick={() => alert('Receipt download feature coming soon!')}
                />
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default HomePage;