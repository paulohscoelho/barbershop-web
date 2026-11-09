import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/users`;
  private http = inject(HttpClient);

  changePassword(data: { oldPassword: string; newPassword: string }): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/change-password`, data);
  }
}