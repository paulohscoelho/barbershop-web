import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly API_URL = environment.apiUrl;
  private http = inject(HttpClient);

  getMyAppointments(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/appointments/client?page=${page}&size=${size}`);
  }

  getBarberAppointments(page: number = 0, size: number = 10, status: string = '', clientName: string = '', date: string = ''): Observable<any> {
    let url = `${this.API_URL}/appointments/barber?page=${page}&size=${size}`;
    if (status) url += `&status=${status}`;
    if (clientName) url += `&clientName=${encodeURIComponent(clientName)}`;
    if (date) url += `&date=${date}`;
    
    return this.http.get<any>(url);
  }

  getBarberStats(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/appointments/barber/stats`);
  }

  cancelAppointment(id: string): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}/appointments/${id}/cancel`, {});
  }

  completeAppointment(id: string): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}/appointments/${id}/complete`, {});
  }

  getSpecialSchedules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/special-schedules`);
  }

  createSpecialSchedule(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/special-schedules`, data);
  }

  deleteSpecialSchedule(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/special-schedules/${id}`);
  }
}