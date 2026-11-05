import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-management.html',
  styleUrl: './client-management.scss'
})
export class ClientManagementComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private readonly API_URL = 'http://localhost:8080/api/users/clients';

  clients: User[] = [];
  filteredClients: User[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  loyaltyGoal: number = 10;

  ngOnInit() {
    this.loadClients();
    this.authService.getMyProfile().subscribe(data => {
      this.loyaltyGoal = data.loyaltyGoal;
      this.cdr.detectChanges();
    });
  }

  loadClients() {
    this.isLoading = true;
    this.http.get<User[]>(this.API_URL).subscribe({
      next: (data) => {
        this.clients = data;
        this.filteredClients = data;
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

  filterClients() {
    if (!this.searchTerm) {
      this.filteredClients = this.clients;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredClients = this.clients.filter(c => 
        c.name.toLowerCase().includes(term) || 
        c.email.toLowerCase().includes(term) ||
        (c.phone && c.phone.includes(term))
      );
    }
  }

  saveGoal() {
    this.authService.updateLoyaltyGoal(this.loyaltyGoal).subscribe({
      next: () => alert('Meta de fidelidade atualizada!'),
      error: (err) => alert(err.error?.erro || 'Erro ao atualizar a meta.')
    });
  }
}