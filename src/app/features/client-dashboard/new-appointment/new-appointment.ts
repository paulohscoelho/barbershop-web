import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  services: BarberService[] = [];
  barbers: Barber[] = [];
  availableSlots: string[] = [];
  
  selectedServiceIds: string[] = [];
  totalDuration: number = 0;
  totalPrice: number = 0;
  errorMessage: string | null = null;
  selectedTime: string | null = null;

  appointmentForm = this.fb.group({
    barberId: ['', Validators.required],
    date: ['', Validators.required]
  });

  ngOnInit() {
    this.bookingService.getServices().subscribe(data => this.services = data);
    this.bookingService.getBarbers().subscribe(data => {
      this.barbers = data;
      if (this.barbers.length > 0) {
        this.appointmentForm.patchValue({ barberId: this.barbers[0].id });
      }
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
    
    this.selectedTime = null;
    this.cdr.detectChanges(); 
    this.checkAvailability();
  }

  onDateChange() {
    this.selectedTime = null;
    this.checkAvailability();
  }

  checkAvailability() {
    const date = this.appointmentForm.value.date;
    const barberId = this.appointmentForm.value.barberId;

    if (date && barberId && this.selectedServiceIds.length > 0) {
      this.bookingService.getAvailableSlots(barberId, date, this.selectedServiceIds).subscribe({
        next: (slots) => {
          this.availableSlots = slots;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erro ao buscar horários', err)
      });
    } else {
      this.availableSlots = [];
      this.cdr.detectChanges();
    }
  }

  selectTime(time: string) {
    this.selectedTime = time;
  }

  onSubmit() {
    if (!this.selectedTime) {
      this.errorMessage = "Selecione um horário disponível.";
      return;
    }

    if (this.appointmentForm.valid) {
      const dateStr = this.appointmentForm.value.date;
      const startTimeIso = new Date(`${dateStr}T${this.selectedTime}:00`).toISOString();

      const requestData = {
        barberId: this.appointmentForm.value.barberId!,
        serviceIds: this.selectedServiceIds,
        startTime: startTimeIso
      };

      this.bookingService.createAppointment(requestData).subscribe({
        next: () => {
          alert('Agendamento realizado com sucesso!');
          this.router.navigate(['/my-appointments']);
        },
        error: (err) => {
          this.errorMessage = err.error?.erro || "Erro ao realizar agendamento.";
        }
      });
    }
  }
}