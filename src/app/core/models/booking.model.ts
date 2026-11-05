export interface BarberService {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
  sortOrder: number;
}

export interface Barber {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AppointmentRequest {
  barberId: string;
  serviceIds: string[];
  startTime: string;
}