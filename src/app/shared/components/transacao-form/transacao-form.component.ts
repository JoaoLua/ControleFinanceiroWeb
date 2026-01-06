import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importe isso
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ANGULAR_MATERIAL } from '../../angular-material/angular-material';
import { TransacaoService } from '../../../core/services/transacao/transacao.service';
import { CategoriaService } from '../../../core/services/categoria/categoria.service';
import { Categoria } from '../../../core/models/categoria.model';
import { TipoTransacao } from '../../../core/models/transacao.model';
import { ContasService } from '../../../core/services/conta/contas-service.service';
import { Conta } from '../../../core/models/conta.model';

@Component({
  selector: 'app-transacao-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...ANGULAR_MATERIAL],
  templateUrl: './transacao-form.component.html',
  styleUrls: ['./transacao-form.component.scss']
})
export class TransacaoFormComponent implements OnInit {

  private dialogRef = inject(MatDialogRef<TransacaoFormComponent>);
  private fb = inject(FormBuilder);
  private transacaoService = inject(TransacaoService);
  private categoriaService = inject(CategoriaService);
  private snackBar = inject(MatSnackBar);
  private contaService = inject(ContasService);

  categorias: Categoria[] = [];
  contas: Conta[] = [];
  tipos: TipoTransacao[] = ['Receita', 'Despesa'];

  form = this.fb.group({
    tipo: [null as TipoTransacao | null, Validators.required],
    valor: [null, [Validators.required, Validators.min(0.01)]],
    descricao: [''],
    categoriaId: [null, Validators.required],
    data: [new Date(), Validators.required],
    contaId: [null as number | null, Validators.required]
  });

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarContas();

  }

  carregarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: () => {
        this.snackBar.open('Erro ao carregar categorias', 'Ok');
      },
    });
  }

  carregarContas(): void {
    this.contaService.getContas().subscribe({
      next: (data) => {
        this.contas = data;
        console.log(this.contas)
        if (this.contas.length === 1) {
          this.form.patchValue({ contaId: this.contas[0].id });
        }
      },
      error: () => this.snackBar.open('Erro ao carregar contas', 'Ok')
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formValue = this.form.value;

    let tipoEnum = 0;

    if (formValue.tipo === 'Despesa') {
      tipoEnum = 1;
    }

    const payload = {
      descricao: formValue.descricao,
      valor: formValue.valor,
      data: new Date(formValue.data!).toISOString(),
      categoriaId: formValue.categoriaId,
      contaId: formValue.contaId,
      tipo: tipoEnum
    };

    console.log('Payload Final:', payload); // Debug


    this.transacaoService.addTransacao(payload as any)
      .subscribe({
        next: () => {

          this.snackBar.open('Transação salva com sucesso!', 'OK', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (err: HttpErrorResponse) => {
          console.error('ERRO API:', err);

          let mensagem = 'Erro ao salvar.';

          // Tenta ler a mensagem de erro que veio do C#
          if (err.error?.errors) {
            mensagem = 'Verifique os dados preenchidos.';
          } else if (typeof err.error === 'string') {
            mensagem = err.error; // Mensagem customizada do backend
          }

          this.snackBar.open(mensagem, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}