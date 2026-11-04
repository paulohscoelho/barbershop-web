import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly API_URL = 'http://localhost:8080/api/appointments';
  private http = inject(HttpClient);

  getMyAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/client`);
  }

  cancelAppointment(id: string): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}/${id}/cancel`, {});
  }

    getBarberAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/barber`);
  }

  completeAppointment(id: string): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}/${id}/complete`, {});
  }
}