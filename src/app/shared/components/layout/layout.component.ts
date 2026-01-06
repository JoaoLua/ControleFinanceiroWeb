import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';


import { ANGULAR_MATERIAL } from '../../angular-material/angular-material';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterModule, ...ANGULAR_MATERIAL],
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private authService = inject(AuthService)
  private router = inject(Router)

  sair(): void {
    this.authService.logout()
    this.router.navigate(['/login'])
  }
}
