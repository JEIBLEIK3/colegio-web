import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then(m => m.Shell),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'matriculas',
        loadComponent: () => import('./features/matriculas/matriculas').then(m => m.Matriculas),
        canActivate: [roleGuard(['admin'])]
      },
      {
        path: 'profesores',
        loadComponent: () => import('./features/profesores/profesores').then(m => m.Profesores),
        canActivate: [roleGuard(['admin'])]
      },
      {
        path: 'horarios',
        loadComponent: () => import('./features/horarios/horarios').then(m => m.Horarios)
      },
      {
        path: 'asistencia',
        loadComponent: () => import('./features/asistencia/asistencia').then(m => m.Asistencia),
        canActivate: [roleGuard(['admin', 'profesor'])]
      },
      {
        path: 'notas',
        loadComponent: () => import('./features/notas/notas').then(m => m.Notas)
      },
      {
        path: 'observaciones',
        loadComponent: () => import('./features/observaciones/observaciones').then(m => m.Observaciones),
        canActivate: [roleGuard(['admin', 'profesor'])]
      },
      {
        path: 'boletines',
        loadComponent: () => import('./features/boletines/boletines').then(m => m.Boletines)
      },
      {
        path: 'pagos',
        loadComponent: () => import('./features/pagos/pagos').then(m => m.Pagos),
        canActivate: [roleGuard(['admin', 'estudiante'])]
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
