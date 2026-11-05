import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppointmentService } from '../../../core/services/appointment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-barber-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barber-agenda.html',
  styleUrl: './barber-agenda.scss'
})
export class BarberAgendaComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private cdr = inject(ChangeDetectorRef);

  appointments: any[] = [];
  isLoading: boolean = true;
  
  currentPage: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;

  statusFilter: string = 'AGENDADO';
  stats: any = { agendados: 0, finalizados: 0, cancelados: 0 };

  ngOnInit() {
    this.loadAgenda();
    this.loadStats();
  }

  loadStats() {
    this.appointmentService.getBarberStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadAgenda(page: number = 0) {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.appointmentService.getBarberAppointments(page, 10, this.statusFilter).subscribe({
      next: (response) => {
        this.appointments = response.content;
        this.currentPage = response.number;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
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

  onFilterChange() {
    this.loadAgenda(0);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.loadAgenda(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.loadAgenda(this.currentPage - 1);
    }
  }

  onComplete(id: string) {
    if (confirm('Marcar como CONCLUÍDO? O cliente ganhará 1 ponto de fidelidade.')) {
      this.appointmentService.completeAppointment(id).subscribe({
        next: () => {
          this.loadAgenda(this.currentPage);
          this.loadStats();
        },
        error: (err) => console.error('Erro ao concluir', err)
      });
    }
  }

  onCancel(id: string) {
    if (confirm('Tem certeza que deseja CANCELAR este agendamento? O horário ficará livre.')) {
      this.appointmentService.cancelAppointment(id).subscribe({
        next: () => {
          this.loadAgenda(this.currentPage);
          this.loadStats();
        },
        error: (err) => console.error('Erro ao cancelar', err)
      });
    }
  }
}