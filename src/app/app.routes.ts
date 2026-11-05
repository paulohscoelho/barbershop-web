import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'my-appointments',
    canActivate: [authGuard],
    loadComponent: () => import('./features/client-dashboard/my-appointments/my-appointments').then(m => m.MyAppointmentsComponent)
  },
  {
    path: 'new-appointment',
    canActivate: [authGuard],
    loadComponent: () => import('./features/client-dashboard/new-appointment/new-appointment').then(m => m.NewAppointmentComponent)
  },
  {
    path: 'change-password',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/change-password/change-password').then(m => m.ChangePasswordComponent)
  },
  {
    path: 'barber-agenda',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin-dashboard/barber-agenda/barber-agenda').then(m => m.BarberAgendaComponent)
  },
  {
    path: 'service-catalog',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin-dashboard/service-catalog/service-catalog').then(m => m.ServiceCatalogComponent)
  },
  {
    path: 'working-hours',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin-dashboard/working-hours/working-hours').then(m => m.WorkingHoursComponent)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];