import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  userRole: string | null = null;
  showMenu: boolean = false;

  ngOnInit() {
    this.updateMenuState();
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateMenuState();
    });
  }

  updateMenuState() {
    const currentUrl = this.router.url;
    this.userRole = this.authService.getUserRole();
    this.showMenu = (currentUrl !== '/login' && currentUrl !== '/') && !!this.userRole;
    this.cdr.detectChanges();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}