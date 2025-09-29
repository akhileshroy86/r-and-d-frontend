import { io, Socket } from 'socket.io-client';

class SocketClient {
  private socket: Socket | null = null;
  private url: string;

  constructor() {
    this.url = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';
  }

  connect(token?: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(this.url, {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Queue-related events
  joinQueueRoom(doctorId: string): void {
    this.socket?.emit('join-queue', { doctorId });
  }

  leaveQueueRoom(doctorId: string): void {
    this.socket?.emit('leave-queue', { doctorId });
  }

  onQueueUpdate(callback: (data: any) => void): void {
    this.socket?.on('queue-updated', callback);
  }

  onPatientCalled(callback: (data: any) => void): void {
    this.socket?.on('patient-called', callback);
  }

  // Appointment-related events
  onAppointmentStatusUpdate(callback: (data: any) => void): void {
    this.socket?.on('appointment-status-updated', callback);
  }

  // Payment-related events
  onPaymentStatusUpdate(callback: (data: any) => void): void {
    this.socket?.on('payment-status-updated', callback);
  }

  // General notification events
  onNotification(callback: (data: any) => void): void {
    this.socket?.on('notification', callback);
  }

  // Remove event listeners
  off(event: string): void {
    this.socket?.off(event);
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketClient = new SocketClient();