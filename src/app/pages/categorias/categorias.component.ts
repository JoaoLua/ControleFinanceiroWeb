import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ANGULAR_MATERIAL } from '../../shared/angular-material/angular-material';
import { CategoriaService } from '../../core/services/categoria/categoria.service';
import { MatDialog } from '@angular/material/dialog';
import { Categoria } from '../../core/models/categoria.model';
import { CategoriaFormComponent } from '../../shared/components/categoria-form/categoria-form.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, ...ANGULAR_MATERIAL],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent implements OnInit {
  
  private service = inject(CategoriaService);
  private dialog = inject(MatDialog);

  categorias: Categoria[] = [];
  isLoading = false;

  ngOnInit() {
    this.carregarCategorias();
  }

  carregarCategorias() {
    this.isLoading = true;
    this.service.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  abrirForm(categoria?: Categoria) {
    const ref = this.dialog.open(CategoriaFormComponent, {
      width: '700px',
      maxWidth: '95vw',
      minWidth: '320px',
      autoFocus: false,
      data: categoria 
    });

    ref.afterClosed().subscribe(result => {
      if (result) this.carregarCategorias();
    });
  }

  excluir(categoria: Categoria) {
    if (confirm(`Deseja excluir a categoria "${categoria.nome}"?`)) {
      this.service.excluirCategoria(categoria.id).subscribe({
        next: () => this.carregarCategorias(),
        error: () => alert('Erro ao excluir (Backend pendente?)')
      });
    }
  }

}
