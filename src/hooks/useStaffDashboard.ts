import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  StaffDashboardStats, 
  EnhancedAppointment, 
  QueueData, 
  VoiceRecordingState,
  NotificationData,
  DashboardState
} from '../types/staff';

// Custom hook for staff dashboard functionality
export const useStaffDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    loading: false,
    error: null,
    lastUpdated: new Date(),
    realTimeEnabled: true,
    selectedDate: new Date(),
    activeFilters: {
      phone: '',
      name: '',
      doctorId: '',
      dateRange: null,
      status: []
    }
  });

  const [stats, setStats] = useState<StaffDashboardStats>({
    totalCash: 0,
    totalOnline: 0,
    totalPatients: 0,
    pendingPayments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    walkInPatients: 0,
    avgWaitTime: 0
  });

  const [appointments, setAppointments] = useState<EnhancedAppointment[]>([]);
  const [queueData, setQueueData] = useState<QueueData[]>([]);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // Real-time updates
  const updateInterval = useRef<NodeJS.Timeout>();

  const startRealTimeUpdates = useCallback(() => {
    if (updateInterval.current) {
      clearInterval(updateInterval.current);
    }

    updateInterval.current = setInterval(() => {
      if (dashboardState.realTimeEnabled) {
        fetchDashboardData();
      }
    }, 30000); // Update every 30 seconds
  }, [dashboardState.realTimeEnabled]);

  const stopRealTimeUpdates = useCallback(() => {
    if (updateInterval.current) {
      clearInterval(updateInterval.current);
    }
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setDashboardState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate API calls - replace with actual API endpoints
      await Promise.all([
        fetchStats(),
        fetchAppointments(),
        fetchQueueData(),
        fetchNotifications()
      ]);
      
      setDashboardState(prev => ({ 
        ...prev, 
        loading: false, 
        lastUpdated: new Date() 
      }));
    } catch (error) {
      setDashboardState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch data' 
      }));
    }
  }, []);

  const fetchStats = async (): Promise<void> => {
    // Load real stats from localStorage or API
    const savedStats = localStorage.getItem('staffDashboardStats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }
  };

  const fetchAppointments = async (): Promise<void> => {
    // Load real appointments from localStorage
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      try {
        setAppointments(JSON.parse(savedAppointments));
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    }
  };

  const fetchQueueData = async (): Promise<void> => {
    // Load real queue data from localStorage
    const savedQueueData = localStorage.getItem('queueState');
    if (savedQueueData) {
      try {
        setQueueData(JSON.parse(savedQueueData));
      } catch (error) {
        console.error('Error loading queue data:', error);
      }
    }
  };

  const fetchNotifications = async (): Promise<void> => {
    // Load real notifications from localStorage
    const savedNotifications = localStorage.getItem('staffNotifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  };

  // Appointment management
  const acceptAppointment = useCallback(async (appointmentId: string) => {
    setDashboardState(prev => ({ ...prev, loading: true }));
    
    try {
      const updatedAppointments = appointments.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'confirmed' as const }
          : apt
      );
      
      setAppointments(updatedAppointments);
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      
      return { success: true, message: 'Appointment accepted successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to accept appointment' };
    } finally {
      setDashboardState(prev => ({ ...prev, loading: false }));
    }
  }, [appointments]);

  const rejectAppointment = useCallback(async (appointmentId: string, reason?: string) => {
    setDashboardState(prev => ({ ...prev, loading: true }));
    
    try {
      const updatedAppointments = appointments.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'cancelled' as const }
          : apt
      );
      
      setAppointments(updatedAppointments);
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      
      return { success: true, message: 'Appointment rejected successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to reject appointment' };
    } finally {
      setDashboardState(prev => ({ ...prev, loading: false }));
    }
  }, [appointments]);

  const addWalkInPatient = useCallback(async (walkInData: any) => {
    setDashboardState(prev => ({ ...prev, loading: true }));
    
    try {
      const newAppointment: EnhancedAppointment = {
        id: Date.now().toString(),
        patientName: walkInData.patientName,
        phone: walkInData.phone,
        doctorName: walkInData.doctorName || 'Walk-in Doctor',
        department: walkInData.department || 'General',
        time: new Date().toLocaleTimeString(),
        status: 'confirmed',
        paymentStatus: walkInData.paymentMethod === 'cash' ? 'paid' : 'pending',
        priority: walkInData.emergencyLevel,
        symptoms: walkInData.symptoms,
        estimatedDuration: 20,
        queuePosition: appointments.length + 1
      };
      
      const updatedAppointments = [newAppointment, ...appointments];
      setAppointments(updatedAppointments);
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      
      const updatedStats = { ...stats, walkInPatients: stats.walkInPatients + 1, totalPatients: stats.totalPatients + 1 };
      setStats(updatedStats);
      localStorage.setItem('staffDashboardStats', JSON.stringify(updatedStats));
      
      return { success: true, message: 'Walk-in patient added successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to add walk-in patient' };
    } finally {
      setDashboardState(prev => ({ ...prev, loading: false }));
    }
  }, [appointments, stats]);

  // Search functionality
  const searchPatients = useCallback(async (filters: any) => {
    setDashboardState(prev => ({ ...prev, loading: true }));
    
    try {
      // Filter appointments based on search criteria
      const filtered = appointments.filter(apt => {
        if (filters.phone && !apt.phone.includes(filters.phone)) return false;
        if (filters.name && !apt.patientName.toLowerCase().includes(filters.name.toLowerCase())) return false;
        if (filters.doctorId && apt.doctorId !== filters.doctorId) return false;
        return true;
      });
      
      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, message: 'Search failed' };
    } finally {
      setDashboardState(prev => ({ ...prev, loading: false }));
    }
  }, [appointments]);

  // Report generation
  const generateReport = useCallback(async (reportFilters: any) => {
    setDashboardState(prev => ({ ...prev, loading: true }));
    
    try {
      const reportData = {
        type: reportFilters.reportType,
        dateRange: reportFilters.dateRange,
        departments: reportFilters.departments,
        stats: stats,
        appointments: appointments.length,
        revenue: stats.totalCash + stats.totalOnline,
        generatedAt: new Date().toISOString(),
        generatedBy: user?.name || 'Staff'
      };
      
      return { success: true, message: 'Report generated successfully', data: reportData };
    } catch (error) {
      return { success: false, message: 'Failed to generate report' };
    } finally {
      setDashboardState(prev => ({ ...prev, loading: false }));
    }
  }, [stats, appointments, user]);

  // Notification management
  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Settings
  const toggleRealTimeUpdates = useCallback(() => {
    setDashboardState(prev => ({ 
      ...prev, 
      realTimeEnabled: !prev.realTimeEnabled 
    }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<typeof dashboardState.activeFilters>) => {
    setDashboardState(prev => ({
      ...prev,
      activeFilters: { ...prev.activeFilters, ...newFilters }
    }));
  }, []);

  // Initialize dashboard
  useEffect(() => {
    fetchDashboardData();
    startRealTimeUpdates();
    
    return () => {
      stopRealTimeUpdates();
    };
  }, [fetchDashboardData, startRealTimeUpdates, stopRealTimeUpdates]);

  // Update real-time when enabled state changes
  useEffect(() => {
    if (dashboardState.realTimeEnabled) {
      startRealTimeUpdates();
    } else {
      stopRealTimeUpdates();
    }
  }, [dashboardState.realTimeEnabled, startRealTimeUpdates, stopRealTimeUpdates]);

  return {
    // State
    dashboardState,
    stats,
    appointments,
    queueData,
    notifications,
    
    // Actions
    fetchDashboardData,
    acceptAppointment,
    rejectAppointment,
    addWalkInPatient,
    searchPatients,
    generateReport,
    markNotificationAsRead,
    clearAllNotifications,
    toggleRealTimeUpdates,
    updateFilters,
    
    // Computed values
    unreadNotifications: notifications.filter(n => !n.isRead).length,
    totalRevenue: stats.totalCash + stats.totalOnline,
    completionRate: stats.totalPatients > 0 ? (stats.completedAppointments / stats.totalPatients) * 100 : 0
  };
};

// Voice recording hook
export const useVoiceRecording = () => {
  const [voiceState, setVoiceState] = useState<VoiceRecordingState>({
    isRecording: false,
    transcript: '',
    confidence: 0
  });

  const recognition = useRef<SpeechRecognition | null>(null);

  const startRecording = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setVoiceState(prev => ({ 
        ...prev, 
        error: 'Speech recognition not supported in this browser' 
      }));
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();
    
    recognition.current.continuous = true;
    recognition.current.interimResults = true;
    recognition.current.lang = 'en-US';

    recognition.current.onstart = () => {
      setVoiceState(prev => ({ ...prev, isRecording: true, error: undefined }));
    };

    recognition.current.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setVoiceState(prev => ({
        ...prev,
        transcript: finalTranscript || interimTranscript,
        confidence: event.results[event.results.length - 1][0].confidence || 0
      }));
    };

    recognition.current.onerror = (event) => {
      setVoiceState(prev => ({ 
        ...prev, 
        isRecording: false, 
        error: `Speech recognition error: ${event.error}` 
      }));
    };

    recognition.current.onend = () => {
      setVoiceState(prev => ({ ...prev, isRecording: false }));
    };

    recognition.current.start();
  }, []);

  const stopRecording = useCallback(() => {
    if (recognition.current) {
      recognition.current.stop();
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setVoiceState(prev => ({ ...prev, transcript: '', confidence: 0 }));
  }, []);

  return {
    voiceState,
    startRecording,
    stopRecording,
    clearTranscript
  };
};

// Declare global speech recognition types
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}