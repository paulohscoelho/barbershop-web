import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxMaskDirective],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]]
  });

  passwordForm = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  profileMessage: string | null = null;
  profileError: boolean = false;

  passwordMessage: string | null = null;
  passwordError: boolean = false;

  ngOnInit() {
    this.authService.getMyProfile().subscribe(data => {
      this.profileForm.patchValue({
        name: data.name,
        email: data.email,
        phone: data.phone
      });
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (newPassword !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onUpdateProfile() {
    if (this.profileForm.valid) {
      this.authService.updateProfile(this.profileForm.value).subscribe({
        next: () => {
          this.profileError = false;
          this.profileMessage = "Perfil atualizado com sucesso!";
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.profileError = true;
          this.profileMessage = err.error?.erro || "Erro ao atualizar o perfil.";
          this.cdr.detectChanges();
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  onChangePassword() {
    if (this.passwordForm.valid) {
      const { oldPassword, newPassword } = this.passwordForm.value;
      this.userService.changePassword({ oldPassword: oldPassword!, newPassword: newPassword! }).subscribe({
        next: () => {
          this.passwordError = false;
          this.passwordMessage = "Senha alterada com sucesso!";
          this.passwordForm.reset();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.passwordError = true;
          this.passwordMessage = err.error?.erro || "Erro ao alterar a senha.";
          this.cdr.detectChanges();
        }
      });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
}