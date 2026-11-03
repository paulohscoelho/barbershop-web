import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);

  userRole = this.authService.getUserRole();

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}