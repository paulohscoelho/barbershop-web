import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment';

@Component({
  selector: 'app-blocks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './blocks.html',
  styleUrl: './blocks.scss'
})
export class BlocksComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  blocks: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  blockForm = this.fb.group({
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    reason: ['', Validators.required]
  });

  ngOnInit() {
    this.loadBlocks();
  }

  loadBlocks() {
    this.isLoading = true;
    this.appointmentService.getBlocks().subscribe({
      next: (data) => {
        this.blocks = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar bloqueios.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    if (this.blockForm.valid) {
      const payload = {
        startTime: new Date(this.blockForm.value.startTime!).toISOString(),
        endTime: new Date(this.blockForm.value.endTime!).toISOString(),
        reason: this.blockForm.value.reason
      };

      this.appointmentService.createBlock(payload).subscribe({
        next: () => {
          this.loadBlocks();
          this.blockForm.reset();
        },
        error: (err) => this.errorMessage = err.error?.erro || 'Erro ao criar bloqueio.'
      });
    }
  }

  deleteBlock(id: string) {
    if (confirm('Tem certeza que deseja apagar este bloqueio?')) {
      this.appointmentService.deleteBlock(id).subscribe({
        next: () => this.loadBlocks(),
        error: (err) => this.errorMessage = 'Erro ao deletar bloqueio.'
      });
    }
  }
}