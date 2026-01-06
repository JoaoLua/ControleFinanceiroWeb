import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ANGULAR_MATERIAL } from '../../shared/angular-material/angular-material';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ...ANGULAR_MATERIAL],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  hidePassword = signal(true);
  isLoading = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault();
    this.hidePassword.update(v => !v);
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.form.disable();

    const requestData = {
      email: this.form.value.email!,
      password: this.form.value.password!
    };

    this.authService.register(requestData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.snackBar.open('Conta criada com sucesso! Faça login.', 'OK', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.form.enable();
        this.tratarErroIdentity(err);
      }
    });
  }

  private tratarErroIdentity(err: HttpErrorResponse) {
    let mensagem = 'Não foi possível criar a conta.';


    if (err.status === 400 && Array.isArray(err.error)) {

      const primeiroErro = err.error[0];
      if (primeiroErro && primeiroErro.description) {
        mensagem = primeiroErro.description;
      }
    } 

    else if (err.error && typeof err.error === 'string') {
      mensagem = err.error;
    }

    else if (err.status === 0) {
      mensagem = 'Sem conexão com o servidor.';
    }

    this.snackBar.open(mensagem, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}