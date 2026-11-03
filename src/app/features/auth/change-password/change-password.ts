import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  passwordForm = this.fb.group({
    oldPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]]
  });

  message: string | null = null;
  isError: boolean = false;

  onSubmit() {
    if (this.passwordForm.valid) {
      const { oldPassword, newPassword } = this.passwordForm.value;
      
      this.userService.changePassword({ oldPassword: oldPassword!, newPassword: newPassword! }).subscribe({
        next: () => {
          this.isError = false;
          this.message = "Senha alterada com sucesso!";
          this.passwordForm.reset();
        },
        error: (err) => {
          this.isError = true;
          this.message = err.error?.erro || "Erro ao alterar a senha. Verifique sua conexão.";
        }
      });
    }
  }
}