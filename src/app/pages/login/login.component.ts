import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ANGULAR_MATERIAL } from '../../shared/angular-material/angular-material';
import { AuthService } from '../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ...ANGULAR_MATERIAL
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  hidePassword = signal(true);
  isLoading = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password:['', [Validators.required, Validators.minLength(6)]]
  });

  get emailControl() {return this.form.get('email')};
  get passwordControl() {return this.form.get('passoword')};

  togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault();
    this.hidePassword.update(value => !value);
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.form.disable();

    const {email, password} = this.form.value;

    this.authService.login({email: email!, password: password!})
      .subscribe({
        next: () => {
          this.snackBar.open("Login Realizado com sucesso!", 'OK', {
            duration: 3000,
            panelClass: ['success-snackbar']
          })
          this.router.navigate(['/dashboard'])
        }, 
        error: (err) => {
          this.isLoading.set(false);
          this.form.enable();
          console.error(err);
          let errorMessage = 'Falha no login. Verifique suas credenciais.';
          if (err.status === 401) errorMessage = 'E-mail ou senha incorretos.';
          if (err.status === 0) errorMessage = 'Sem conexão com o servidor.';

          this.snackBar.open(errorMessage, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      })
  }
}
