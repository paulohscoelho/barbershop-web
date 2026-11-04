import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppointmentService } from '../../../core/services/appointment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barber-agenda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barber-agenda.html',
  styleUrl: './barber-agenda.scss'
})
export class BarberAgendaComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private cdr = inject(ChangeDetectorRef);

  appointments: any[] = [];
  isLoading: boolean = true;

  ngOnInit() {
    this.loadAgenda();
  }

  loadAgenda() {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.appointmentService.getBarberAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onComplete(id: string) {
    if (confirm('Marcar como CONCLUÍDO? O cliente ganhará 1 ponto de fidelidade.')) {
      this.appointmentService.completeAppointment(id).subscribe({
        next: () => this.loadAgenda(),
        error: (err) => console.error('Erro ao concluir', err)
      });
    }
  }
}