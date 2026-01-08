import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ANGULAR_MATERIAL } from '../../angular-material/angular-material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ContasService } from '../../../core/services/conta/contas-service.service';
import { Conta, ContaRequest } from '../../../core/models/conta.model';

@Component({
  selector: 'app-conta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...ANGULAR_MATERIAL],
  templateUrl: './conta-form.component.html',
  styleUrl: './conta-form.component.scss'
})
export class ContaFormComponent implements OnInit{
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ContaFormComponent>);
  private snackBar = inject(MatSnackBar);
  private contaService = inject(ContasService);

  isLoading = false;
  public data = inject<Conta>(MAT_DIALOG_DATA, { optional: true });
  
  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    saldo: [0, [Validators.required]] 
  });

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({
        nome: this.data.nome,
        saldo: this.data.saldo
      });
    }
  }

  get titulo(): string {
    return this.data ? 'Editar Conta' : 'Nova Conta';
  }

salvar() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.form.disable();

    const request: ContaRequest = {
      nome: this.form.value.nome!,
      saldo: this.form.value.saldo!
    };

    if (this.data) {
      
      this.contaService.atualizarConta(this.data.id, request).subscribe({
        next: () => this.fecharComSucesso('Conta atualizada!'),
        error: (err) => this.tratarErro(err)
      });
    } else {
      
      this.contaService.criarConta(request).subscribe({
        next: () => this.fecharComSucesso('Conta criada!'),
        error: (err) => this.tratarErro(err)
      });
    }
  }

  private fecharComSucesso(msg: string) {
    this.isLoading = false;
    this.snackBar.open(msg, 'OK', { duration: 3000, panelClass: ['success-snackbar'] });
    this.dialogRef.close(true);
  }

  private tratarErro(err: HttpErrorResponse) {
    this.isLoading = false;
    this.form.enable();
    console.error(err);
    const msg = err.status === 404 ? 'Endpoint não encontrado (Backend pendente)' : 'Erro ao processar.';
    this.snackBar.open(msg, 'Fechar', { duration: 5000, panelClass: ['error-snackbar'] });
  }

  cancelar() {
    this.dialogRef.close(false);
  }

}
