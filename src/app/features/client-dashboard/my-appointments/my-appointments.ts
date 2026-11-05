import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppointmentService } from '../../../core/services/appointment';
import { AuthService } from '../../../core/services/auth.service';
import { BookingService } from '../../../core/services/booking';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-appointments.html',
  styleUrl: './my-appointments.scss'
})
export class MyAppointmentsComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);
  private bookingService = inject(BookingService);
  private cdr = inject(ChangeDetectorRef);

  appointments: any[] = [];
  errorMessage: string | null = null;
  isLoading: boolean = true;
  
  userProfile: User | null = null;
  barberGoal: number = 10;

  ngOnInit() {
    this.loadAppointments();
    
    this.authService.getMyProfile().subscribe(data => {
      this.userProfile = data;
      this.cdr.detectChanges();
    });

    this.bookingService.getBarbers().subscribe(barbers => {
      if (barbers.length > 0) {
        this.barberGoal = barbers[0].loyaltyGoal;
        this.cdr.detectChanges();
      }
    });
  }

  loadAppointments() {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.appointmentService.getMyAppointments().subscribe({
      next: (data) => {
        this.appointments = data.content;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = "Erro ao carregar agendamentos.";
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCancel(id: string) {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
      this.appointmentService.cancelAppointment(id).subscribe({
        next: () => this.loadAppointments(),
        error: (err) => {
          this.errorMessage = err.error?.erro || "Erro ao cancelar.";
          this.cdr.detectChanges();
        }
      });
    }
  }
}