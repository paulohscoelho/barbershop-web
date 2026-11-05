import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DaySchedule {
  dayOfWeek: number;
  name: string;
  active: boolean;
  startTime: string;
  endTime: string;
  lunchStartTime: string | null;
  lunchEndTime: string | null;
}

@Component({
  selector: 'app-working-hours',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './working-hours.html',
  styleUrl: './working-hours.scss'
})
export class WorkingHoursComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private readonly API_URL = 'http://localhost:8080/api/working-hours';

  schedule: DaySchedule[] = [
    { dayOfWeek: 1, name: 'Segunda-feira', active: true, startTime: '10:00', endTime: '19:00', lunchStartTime: '12:00', lunchEndTime: '13:00' },
    { dayOfWeek: 2, name: 'Terça-feira', active: true, startTime: '10:00', endTime: '19:00', lunchStartTime: '12:00', lunchEndTime: '13:00' },
    { dayOfWeek: 3, name: 'Quarta-feira', active: true, startTime: '10:00', endTime: '19:00', lunchStartTime: '12:00', lunchEndTime: '13:00' },
    { dayOfWeek: 4, name: 'Quinta-feira', active: true, startTime: '10:00', endTime: '19:00', lunchStartTime: '12:00', lunchEndTime: '13:00' },
    { dayOfWeek: 5, name: 'Sexta-feira', active: true, startTime: '10:00', endTime: '19:00', lunchStartTime: '12:00', lunchEndTime: '13:00' },
    { dayOfWeek: 6, name: 'Sábado', active: true, startTime: '10:00', endTime: '19:00', lunchStartTime: '12:00', lunchEndTime: '13:00' },
    { dayOfWeek: 7, name: 'Domingo', active: false, startTime: '10:00', endTime: '19:00', lunchStartTime: null, lunchEndTime: null }
  ];

  isLoading: boolean = true;
  message: string | null = null;
  isError: boolean = false;

  ngOnInit() {
    this.loadWorkingHours();
  }

  loadWorkingHours() {
    this.isLoading = true;
    this.http.get<any[]>(this.API_URL).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.schedule.forEach(day => {
            const savedDay = data.find(d => d.dayOfWeek === day.dayOfWeek);
            if (savedDay) {
              day.active = true;
              day.startTime = savedDay.startTime.substring(0, 5);
              day.endTime = savedDay.endTime.substring(0, 5);
              day.lunchStartTime = savedDay.lunchStartTime ? savedDay.lunchStartTime.substring(0, 5) : null;
              day.lunchEndTime = savedDay.lunchEndTime ? savedDay.lunchEndTime.substring(0, 5) : null;
            } else {
              day.active = false;
            }
          });
        }
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

  save() {
    this.message = null;
    const payload = this.schedule
      .filter(day => day.active)
      .map(day => ({
        dayOfWeek: day.dayOfWeek,
        startTime: day.startTime.length === 5 ? day.startTime + ':00' : day.startTime,
        endTime: day.endTime.length === 5 ? day.endTime + ':00' : day.endTime,
        lunchStartTime: day.lunchStartTime ? (day.lunchStartTime.length === 5 ? day.lunchStartTime + ':00' : day.lunchStartTime) : null,
        lunchEndTime: day.lunchEndTime ? (day.lunchEndTime.length === 5 ? day.lunchEndTime + ':00' : day.lunchEndTime) : null
      }));

    this.http.post(this.API_URL, payload).subscribe({
      next: () => {
        this.isError = false;
        this.message = 'Horários salvos com sucesso!';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isError = true;
        this.message = err.error?.erro || 'Erro ao salvar horários.';
        this.cdr.detectChanges();
      }
    });
  }
}