import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  // Public routes
  {
    path: '',
    loadComponent: () => import('./features/landing/landing')
      .then(m => m.LandingComponent),
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login')
      .then(m => m.LoginComponent)
  },

  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register')
      .then(m => m.RegisterComponent)
  },

  // Protected routes
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard')
          .then(m => m.Dashboard)
      },
      {
        path: 'cases',
        loadComponent: () => import('./features/cases/case-list/case-list')
          .then(m => m.CaseList)
      },
      {
        path: 'cases/:id',
        loadComponent: () => import('./features/cases/case-detail/case-detail')
          .then(m => m.CaseDetail)
      },
      {
        path: 'hearings',
        loadComponent: () => import('./features/hearings/hearing-list/hearing-list')
          .then(m => m.HearingList)
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/payments/payment-list/payment-list')
          .then(m => m.PaymentList)
      },
      {
        path: 'files',
        loadComponent: () => import('./features/files/file-list/file-list')
          .then(m => m.FileList)
      },
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { roles: ['Admin'] },
        loadComponent: () => import('./features/users/user-list/user-list')
          .then(m => m.UserList)
      }
    ]
  },

  // Wildcard fallback
  { path: '**', redirectTo: '' }
];
