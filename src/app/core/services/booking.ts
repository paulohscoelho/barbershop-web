import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BarberService } from '../models/booking.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly API_URL = environment.apiUrl;
  private http = inject(HttpClient);

  getServices(): Observable<BarberService[]> {
    return this.http.get<BarberService[]>(`${this.API_URL}/services`);
  }

  getAdminServices(active: boolean = true): Observable<BarberService[]> {
    return this.http.get<BarberService[]>(`${this.API_URL}/services/admin?active=${active}`);
  }

  createService(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/services`, data);
  }

  updateService(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/services/${id}`, data);
  }

  deactivateService(id: string): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}/services/${id}/deactivate`, {});
  }

  getBarbers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/users/barbers`);
  }

  getAvailableSlots(barberId: string, date: string, serviceIds: string[]): Observable<string[]> {
    const servicesParam = serviceIds.join(',');
    return this.http.get<string[]>(`${this.API_URL}/appointments/available-slots?barberId=${barberId}&date=${date}&serviceIds=${servicesParam}`);
  }

  createAppointment(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/appointments`, data);
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/services/${id}`);
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