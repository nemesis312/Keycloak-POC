import { Routes } from '@angular/router';
import { DashboardComponent } from './app-dashboard/app-dashboard.component';
import { authGuard } from './auth.guard';

export const appRoutes: Routes = [
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./app-dashboard/app-dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];