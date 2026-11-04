export interface BarberService {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
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