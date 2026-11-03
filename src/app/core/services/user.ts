import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:8080/api/users';
  private http = inject(HttpClient);

  changePassword(data: { oldPassword: string; newPassword: string }): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/change-password`, data);
  }
}