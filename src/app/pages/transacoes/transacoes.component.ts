import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Categoria } from '../../core/models/categoria.model';
import { CategoriaService } from '../../core/services/categoria/categoria.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ANGULAR_MATERIAL } from '../../shared/angular-material/angular-material';
import { TipoTransacao, Transacao } from '../../core/models/transacao.model';
import { TransacaoService } from '../../core/services/transacao/transacao.service';
import { MatDialog } from '@angular/material/dialog';
import { TransacaoFormComponent } from '../../shared/components/transacao-form/transacao-form.component';

export interface TransacaoFiltro {
  tipo?: TipoTransacao;
  data?: Date;
  contaId?: number;
  categoriaId?: number;
}

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...ANGULAR_MATERIAL
  ],
  templateUrl: './transacoes.component.html',
  styleUrl: './transacoes.component.scss'
})
export class TransacoesComponent implements OnInit {

  categorias: Categoria[] = [];
  transacoes: Transacao[] = [];
  carregandoCategorias = false;

  displayedColumns = [
    'data',
    'descricao',
    'categoria',
    'tipo',
    'valor',
    'acoes'
  ];

  private categoriaService = inject(CategoriaService);
  private transacaoService = inject(TransacaoService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  filtroForm = this.fb.group({
    tipo: [null as TipoTransacao | null],
    categoriaId: [null as number | null],
    data: [null as Date | null],
    contaId: [null as number | null],
  });

  ngOnInit(): void {
    this.carregarCategorias();
    this.buscarTransacoes();
  }

  carregarCategorias(): void {
    this.carregandoCategorias = true;
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data
      },
      error: () => alert('Erro ao carregar categorias'),
      complete: () => this.carregandoCategorias = false
    });
  }

  buscarTransacoes(): void {
    const raw = this.filtroForm.value;

    const filtro: TransacaoFiltro = {
      tipo: raw.tipo ?? undefined,
      categoriaId: raw.categoriaId ?? undefined,
      data: raw.data ?? undefined,
      contaId: raw.contaId ?? undefined
    };

    this.transacaoService
      .getTransacoes(filtro)
      .subscribe(t => this.transacoes = t);
  }

  abrirNovaTransacao(): void {
    const dialogRef = this.dialog.open(TransacaoFormComponent, {
      width: '700px',
      maxWidth: '95vw',
      minWidth: '320px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.buscarTransacoes();
      }
    });
  }

  limparFiltros(): void {
    this.filtroForm.reset();
    this.buscarTransacoes();
  }

  editar(transacao: Transacao): void {
    console.log('Editar (backend ainda não implementado)', transacao);
  }

  excluir(transacao: Transacao): void {
    console.log('Excluir (backend ainda não implementado)', transacao);
  }
}