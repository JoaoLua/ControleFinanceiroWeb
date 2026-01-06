import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { RegisterComponent } from './pages/register/register.component';
import path from 'path';
import { TransacoesComponent } from './pages/transacoes/transacoes.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
          canActivate: [authGuard]
      },
      {
        path: 'transacoes',
        loadComponent: () => import('./pages/transacoes/transacoes.component').then(m => m.TransacoesComponent)
      },
      {
        path: 'contas',
        loadComponent: () => import('./pages/contas/contas.component').then(m => m.ContasComponent)
      },
      {
        path: 'categorias',
        loadComponent: () => import('./pages/categorias/categorias.component').then(m => m.CategoriasComponent)
      },
      // Se o usuário acessar só "localhost:4200/", joga para dashboard
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // 4. Rota Coringa (404)
  // Se digitar url errada, volta pro login
  { path: '**', redirectTo: 'login' }
];