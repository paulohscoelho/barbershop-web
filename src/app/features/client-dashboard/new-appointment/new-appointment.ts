import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../core/services/booking';
import { BarberService, Barber } from '../../../core/models/booking.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-appointment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-appointment.html',
  styleUrl: './new-appointment.scss'
})
export class NewAppointmentComponent implements OnInit {
  private bookingService = inject(BookingService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  services: BarberService[] = [];
  barbers: Barber[] = [];
  
  selectedServiceIds: string[] = [];
  totalDuration: number = 0;
  totalPrice: number = 0;
  errorMessage: string | null = null;

  appointmentForm = this.fb.group({
    barberId: ['', Validators.required],
    startTime: ['', Validators.required]
  });

  ngOnInit() {
    this.bookingService.getServices().subscribe({
      next: (data) => this.services = data,
      error: (err) => console.error('Erro ao buscar serviços', err)
    });

    this.bookingService.getBarbers().subscribe({
      next: (data) => {
        this.barbers = data;
        if (this.barbers.length > 0) {
          this.appointmentForm.patchValue({ barberId: this.barbers[0].id });
        }
      },
      error: (err) => console.error('Erro ao buscar barbeiros', err)
    });
  }

  onServiceToggle(service: BarberService, event: any) {
    if (event.target.checked) {
      this.selectedServiceIds.push(service.id);
      this.totalDuration += service.durationMinutes;
      this.totalPrice += service.price;
    } else {
      this.selectedServiceIds = this.selectedServiceIds.filter(id => id !== service.id);
      this.totalDuration -= service.durationMinutes;
      this.totalPrice -= service.price;
    }
  }

  onSubmit() {
    if (this.selectedServiceIds.length === 0) {
      this.errorMessage = "Selecione pelo menos um serviço.";
      return;
    }

    if (this.appointmentForm.valid) {
      const requestData = {
        barberId: this.appointmentForm.value.barberId!,
        serviceIds: this.selectedServiceIds,
        startTime: new Date(this.appointmentForm.value.startTime!).toISOString()
      };

      this.bookingService.createAppointment(requestData).subscribe({
        next: () => {
          alert('Agendamento realizado com sucesso!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMessage = err.error?.erro || "Erro ao realizar agendamento.";
        }
      });
    }
  }
}