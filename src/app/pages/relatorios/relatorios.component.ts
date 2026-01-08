import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { ANGULAR_MATERIAL } from '../../shared/angular-material/angular-material';
import { RelatoriosService } from '../../core/services/relatorios/relatorios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, ...ANGULAR_MATERIAL],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss'
})
export class RelatoriosComponent {
  private relatorioService = inject(RelatoriosService)
  private snackBar = inject(MatSnackBar)

  loadingExtrato = false

gerarExtrato(): void {
    this.loadingExtrato = true;

    this.relatorioService.gerarExtratoPdf().subscribe({
      next: (blob) => {
        const fileURL = window.URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
        this.loadingExtrato = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.loadingExtrato = false;
        this.snackBar.open('Erro ao abrir relatório.', 'Fechar', { panelClass: ['error-snackbar'] });
      }
    });
  }
}
