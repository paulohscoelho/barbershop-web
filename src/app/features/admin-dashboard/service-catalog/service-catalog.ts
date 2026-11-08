import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../../../core/services/booking';
import { BarberService } from '../../../core/models/booking.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-service-catalog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './service-catalog.html',
  styleUrl: './service-catalog.scss'
})
export class ServiceCatalogComponent implements OnInit {
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  services: BarberService[] = [];
  isLoading: boolean = true;
  editingId: string | null = null;
  errorMessage: string | null = null;
  userRole: string | null = null;
  showInactive: boolean = false;

  serviceForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    durationMinutes: [30, [Validators.required, Validators.min(10)]],
    price: [0, [Validators.required, Validators.min(0)]],
    sortOrder: [0]
  });

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.loadServices();
  }

    loadServices() {
    this.isLoading = true;

    if (this.userRole === 'CLIENT') {
      this.bookingService.getServices().subscribe({
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
    } else {
      const shouldFetchActive = !this.showInactive;
      
      this.bookingService.getAdminServices(shouldFetchActive).subscribe({
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
  }

  toggleInactive() {
    this.showInactive = !this.showInactive;
    this.loadServices();
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

  deleteService(id: string) {
    if (confirm('Tem certeza que deseja EXCLUIR este serviço permanentemente?')) {
      this.bookingService.deleteService(id).subscribe({
        next: () => {
          this.loadServices();
          alert('Serviço excluído com sucesso!');
        },
        error: (err) => {
          alert(err.error?.erro || 'Erro ao excluir o serviço.');
        }
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
    const currentOrder = current.sortOrder ?? this.services.indexOf(current);
    const targetOrder = target.sortOrder ?? this.services.indexOf(target);

    const payloadCurrent = { name: current.name, description: current.description, durationMinutes: current.durationMinutes, price: current.price, sortOrder: targetOrder };
    const payloadTarget = { name: target.name, description: target.description, durationMinutes: target.durationMinutes, price: target.price, sortOrder: currentOrder };

    this.bookingService.updateService(current.id, payloadCurrent).subscribe({
        next: () => {
            this.bookingService.updateService(target.id, payloadTarget).subscribe({
                next: () => this.loadServices(),
                error: (err) => console.error('Erro ao reordenar target', err)
            });
        },
        error: (err) => console.error('Erro ao reordenar current', err)
    });
  }

  resetForm() {
    this.editingId = null;
    this.serviceForm.reset({ durationMinutes: 30, price: 0, sortOrder: 0 });
  }
}