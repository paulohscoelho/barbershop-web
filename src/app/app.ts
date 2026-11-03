import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('barbershop-web');
  private authService = inject(AuthService);

  constructor() {
    this.authService.login({ email: 'seu-email@teste.com', password: 'sua-senha' })
      .subscribe({
        next: (res) => console.log('Login OK! Token:', res.token),
        error: (err) => console.error('Deu erro:', err)
      });
  }
}