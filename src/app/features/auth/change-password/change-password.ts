import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  message: string | null = null;
  isError: boolean = false;

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (newPassword !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

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
          this.message = err.error?.erro || "Erro ao alterar a senha.";
        }
      });
    }
  }
}