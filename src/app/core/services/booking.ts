import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BarberService } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly API_URL = 'http://localhost:8080/api';
  private http = inject(HttpClient);

  getServices(): Observable<BarberService[]> {
    return this.http.get<BarberService[]>(`${this.API_URL}/services`);
  }

  getBarbers(): Observable<any[]> {
    // Forçando o envio do token manualmente
    const token = localStorage.getItem('barbershop_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<any[]>(`${this.API_URL}/users/barbers`, { headers });
  }

  createAppointment(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/appointments`, data);
  }
}