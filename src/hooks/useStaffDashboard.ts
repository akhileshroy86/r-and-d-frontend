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
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setStats({
          totalCash: 15000 + Math.floor(Math.random() * 5000),
          totalOnline: 28000 + Math.floor(Math.random() * 10000),
          totalPatients: 45 + Math.floor(Math.random() * 10),
          pendingPayments: 3 + Math.floor(Math.random() * 5),
          completedAppointments: 42 + Math.floor(Math.random() * 8),
          cancelledAppointments: 2 + Math.floor(Math.random() * 3),
          walkInPatients: 8 + Math.floor(Math.random() * 5),
          avgWaitTime: 15 + Math.floor(Math.random() * 10)
        });
        resolve();
      }, 500);
    });
  };

  const fetchAppointments = async (): Promise<void> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // This would be replaced with actual API call
        resolve();
      }, 300);
    });
  };

  const fetchQueueData = async (): Promise<void> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // This would be replaced with actual API call
        resolve();
      }, 400);
    });
  };

  const fetchNotifications = async (): Promise<void> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockNotifications: NotificationData[] = [
          {
            id: '1',
            type: 'appointment',
            title: 'New Appointment',
            message: 'John Doe has booked an appointment',
            timestamp: new Date(),
            isRead: false,
            priority: 'medium'
          },
          {
            id: '2',
            type: 'payment',
            title: 'Payment Received',
            message: 'Payment of ₹500 received from Jane Smith',
            timestamp: new Date(Date.now() - 300000),
            isRead: false,
            priority: 'low'
          },
          {
            id: '3',
            type: 'emergency',
            title: 'Emergency Patient',
            message: 'Urgent patient needs immediate attention',
            timestamp: new Date(Date.now() - 600000),
            isRead: true,
            priority: 'high',
            actionRequired: true
          }
        ];
        setNotifications(mockNotifications);
        resolve();
      }, 200);
    });
  };

  // Appointment management
  const acceptAppointment = useCallback(async (appointmentId: string) => {
    setDashboardState(prev => ({ ...prev, loading: true }));
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'confirmed' as const }
            : apt
        )
      );
      
      return { success: true, message: 'Appointment accepted successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to accept appointment' };
    } finally {
      setDashboardState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const rejectAppointment = useCallback(async (appointmentId: string, reason?: string) => {
    setDashboardState(prev => ({ ...prev, loading: true }));
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'cancelled' as const }
            : apt
        )
      );
      
      return { success: true, message: 'Appointment rejected successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to reject appointment' };
    } finally {
      setDashboardState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const addWalkInPatient = useCallback(async (walkInData: any) => {
    setDashboardState(prev => ({ ...prev, loading: true }));
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newAppointment: EnhancedAppointment = {
        id: Date.now().toString(),
        patientName: walkInData.patientName,
        phone: walkInData.phone,
        doctorName: 'Dr. Selected',
        department: 'General',
        time: new Date().toLocaleTimeString(),
        status: 'confirmed',
        paymentStatus: walkInData.paymentMethod === 'cash' ? 'paid' : 'pending',
        priority: walkInData.emergencyLevel,
        symptoms: walkInData.symptoms,
        estimatedDuration: 20,
        queuePosition: 0
      };
      
      setAppointments(prev => [newAppointment, ...prev]);
      setStats(prev => ({ ...prev, walkInPatients: prev.walkInPatients + 1 }));
      
      return { success: true, message: 'Walk-in patient added successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to add walk-in patient' };
    } finally {
      setDashboardState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Search functionality
  const searchPatients = useCallback(async (filters: any) => {
    setDashboardState(prev => ({ ...prev, loading: true }));
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
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
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reportData = {
        type: reportFilters.reportType,
        dateRange: reportFilters.dateRange,
        departments: reportFilters.departments,
        stats: stats,
        appointments: appointments.length,
        revenue: stats.totalCash + stats.totalOnline
      };
      
      // In real implementation, this would generate and download a PDF/Excel file
      console.log('Generated report:', reportData);
      
      return { success: true, message: 'Report generated successfully', data: reportData };
    } catch (error) {
      return { success: false, message: 'Failed to generate report' };
    } finally {
      setDashboardState(prev => ({ ...prev, loading: false }));
    }
  }, [stats, appointments]);

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