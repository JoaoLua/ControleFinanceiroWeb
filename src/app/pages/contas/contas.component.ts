import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ANGULAR_MATERIAL } from '../../shared/angular-material/angular-material';
import { ContasService } from '../../core/services/conta/contas-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Conta } from '../../core/models/conta.model';
import { ContaFormComponent } from '../../shared/components/conta-form/conta-form.component';

@Component({
  selector: 'app-contas',
  standalone: true,
  imports: [CommonModule, ...ANGULAR_MATERIAL],
  templateUrl: './contas.component.html',
  styleUrl: './contas.component.scss'
})
export class ContasComponent implements OnInit {
  private contaService = inject(ContasService);
  private dialog = inject(MatDialog);

  contas: Conta[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.carregarContas();
  }

  carregarContas(): void {
    this.isLoading = true;
    this.contaService.getContas().subscribe({
      next: (data) => {
        this.contas = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error("erro>: ", err)
      }
    });
  }

  abrirNovaConta(): void {
    const ref = this.dialog.open(ContaFormComponent, {
      width: '700px',
      maxWidth: '95vw',
      minWidth: '320px',
      autoFocus: false
    });
    ref.afterClosed().subscribe(result => {
      if (result) this.carregarContas();
    });

  }

  editarConta(conta: Conta): void {
    const ref = this.dialog.open(ContaFormComponent, {
      width: '700px',
      maxWidth: '95vw',
      minWidth: '320px',
      autoFocus: false,
      data: conta
    });

    ref.afterClosed().subscribe(result => {
      if (result) this.carregarContas();
    });
  }

  excluirConta(conta: Conta): void {
    if (confirm(`Deseja realmente excluir a conta "${conta.nome}"?`)) {
      this.isLoading = true;
      this.contaService.excluirConta(conta.id).subscribe({
        next: () => {
          this.carregarContas(); 
        },
        error: (err) => {
          this.isLoading = false;
          alert('Erro ao excluir (Backend provavelmente não implementado ainda).');
        }
      });
    }
  }

}
