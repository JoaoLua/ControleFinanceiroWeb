import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Categoria } from '../../../core/models/categoria.model';
import { ANGULAR_MATERIAL } from '../../angular-material/angular-material';
import { CategoriaService } from '../../../core/services/categoria/categoria.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...ANGULAR_MATERIAL],
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.scss']
})
export class CategoriaFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CategoriaFormComponent>);
  private categoriaService = inject(CategoriaService);
  private snackBar = inject(MatSnackBar);
  public data = inject<Categoria>(MAT_DIALOG_DATA, { optional: true });

  isLoading = false;

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    descricao: [''],
    corHexadecimal: ['#9e9e9e', [Validators.required]]
  });

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({
        nome: this.data.nome,
        descricao: this.data.descricao,
        corHexadecimal: this.data.corHexadecimal || '#9e9e9e'
      });
    }
  }

  get titulo(): string {
    return this.data ? 'Editar Categoria' : 'Nova Categoria';
  }

  salvar() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.form.disable();

    let corSelecionada = this.form.value.corHexadecimal || '#9e9e9e';

    if (!corSelecionada.startsWith("#")){
      corSelecionada = "#" + corSelecionada
    }

    const request = {
      nome: this.form.value.nome!,
      descricao: this.form.value.descricao!,
      corHexadecimal: this.form.value.corHexadecimal!
    };
    console.log('Payload enviado:', request)
    let action$: Observable<any>;

    if (this.data) {
      action$ = this.categoriaService.atualizarCategoria(this.data.id, request);
    } else {
      action$ = this.categoriaService.criarCategoria(request);
    }

    action$.subscribe({
      next: () => {
        this.snackBar.open('Salvo com sucesso!', 'OK', { panelClass: ['success-snackbar'], duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading = false;
        this.form.enable();
        this.snackBar.open('Erro ao salvar.', 'Fechar', { panelClass: ['error-snackbar'] });
      }
    });
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}