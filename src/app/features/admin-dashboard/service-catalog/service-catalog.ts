import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../../../core/services/booking';
import { BarberService } from '../../../core/models/booking.model';

@Component({
  selector: 'app-service-catalog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './service-catalog.html',
  styleUrl: './service-catalog.scss'
})
export class ServiceCatalogComponent implements OnInit {
  private bookingService = inject(BookingService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  services: BarberService[] = [];
  isLoading: boolean = true;
  editingId: string | null = null;
  errorMessage: string | null = null;

  serviceForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    durationMinutes: [30, [Validators.required, Validators.min(10)]],
    price: [0, [Validators.required, Validators.min(0)]],
    sortOrder: [0]
  });

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.isLoading = true;
    this.bookingService.getAdminServices().subscribe({
      next: (data) => {
        this.services = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = "Erro ao carregar serviços.";
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    if (this.serviceForm.valid) {
      const formData = this.serviceForm.value;
      
      if (this.editingId) {
        this.bookingService.updateService(this.editingId, formData).subscribe({
          next: () => {
            this.loadServices();
            this.resetForm();
          },
          error: (err) => this.errorMessage = err.error?.erro || "Erro ao atualizar."
        });
      } else {
        formData.sortOrder = this.services.length;
        this.bookingService.createService(formData).subscribe({
          next: () => {
            this.loadServices();
            this.resetForm();
          },
          error: (err) => this.errorMessage = err.error?.erro || "Erro ao criar."
        });
      }
    }
  }

  editService(service: BarberService) {
    this.editingId = service.id;
    this.serviceForm.patchValue({
      name: service.name,
      description: service.description,
      durationMinutes: service.durationMinutes,
      price: service.price,
      sortOrder: service.sortOrder
    });
  }

  deactivateService(id: string) {
    if (confirm('Tem certeza que deseja inativar este serviço?')) {
      this.bookingService.deactivateService(id).subscribe({
        next: () => this.loadServices(),
        error: (err) => this.errorMessage = "Erro ao inativar."
      });
    }
  }

    moveUp(index: number) {
    if (index === 0) return;
    const current = this.services[index];
    const previous = this.services[index - 1];
    
    this.swapSortOrder(current, previous);
  }

  moveDown(index: number) {
    if (index === this.services.length - 1) return;
    const current = this.services[index];
    const next = this.services[index + 1];
    
    this.swapSortOrder(current, next);
  }

  private swapSortOrder(current: BarberService, target: BarberService) {
    const currentOrder = current.sortOrder;
    const targetOrder = target.sortOrder;

    const payloadCurrent = { ...current, sortOrder: targetOrder };
    const payloadTarget = { ...target, sortOrder: currentOrder };

    this.bookingService.updateService(current.id, payloadCurrent).subscribe();
    this.bookingService.updateService(target.id, payloadTarget).subscribe({
      next: () => {
        this.loadServices();
      },
      error: (err) => console.error('Erro ao reordenar', err)
    });
  }
    

  resetForm() {
    this.editingId = null;
    this.serviceForm.reset({ durationMinutes: 30, price: 0, sortOrder: 0 });
  }
}