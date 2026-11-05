import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthenticationDTO, TokenResponseDTO, User } from '../models/user.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api';
  private readonly TOKEN_KEY = 'barbershop_token';
  
  private http = inject(HttpClient);

  login(credentials: AuthenticationDTO): Observable<TokenResponseDTO> {
    return this.http.post<TokenResponseDTO>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap((response: TokenResponseDTO) => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.role;
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

    getMyProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/me`);
  }

  updateLoyaltyGoal(goal: number): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/users/loyalty-goal?goal=${goal}`, {});
  }
}