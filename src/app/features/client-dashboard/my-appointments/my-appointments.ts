import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppointmentService } from '../../../core/services/appointment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-appointments.html',
  styleUrl: './my-appointments.scss'
})
export class MyAppointmentsComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private cdr = inject(ChangeDetectorRef); // Injetando o detector de mudanças

  appointments: any[] = [];
  errorMessage: string | null = null;
  isLoading: boolean = true;

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.isLoading = true;
    this.cdr.detectChanges(); // Avisa que o loading começou

    this.appointmentService.getMyAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // Avisa o Angular para desenhar a lista na tela!
      },
      error: (err) => {
        this.errorMessage = "Erro ao carregar agendamentos.";
        this.isLoading = false;
        this.cdr.detectChanges(); // Avisa o Angular para desenhar o erro
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