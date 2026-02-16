import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  // ── Public ──────────────────────────────────────────────
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

  // ── Payment callbacks — outside auth guard ───────────────
  // SSLCommerz redirects here — no JWT available at this point
  {
    path: 'payment/success',
    loadComponent: () => import('./features/payments/payment-success/payment-success')
      .then(m => m.PaymentSuccess)
  },
  {
    path: 'payment/failed',
    loadComponent: () => import('./features/payments/payment-failed/payment-failed')
      .then(m => m.PaymentFailed)
  },
  {
    path: 'payment/cancelled',
    loadComponent: () => import('./features/payments/payment-failed/payment-failed')
      .then(m => m.PaymentFailed)
  },

  // ── Protected ────────────────────────────────────────────
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard) },

      // ✅ specific case routes BEFORE :id
      { path: 'cases', loadComponent: () => import('./features/cases/case-list/case-list').then(m => m.CaseList) },
      { path: 'cases/create', loadComponent: () => import('./features/cases/case-form/case-form').then(m => m.CaseForm) },
      { path: 'cases/edit/:id', loadComponent: () => import('./features/cases/case-form/case-form').then(m => m.CaseForm) },
      { path: 'cases/:id', loadComponent: () => import('./features/cases/case-detail/case-detail').then(m => m.CaseDetail) },

      // ✅ specific payment routes BEFORE :id
      { path: 'payments', loadComponent: () => import('./features/payments/payment-list/payment-list').then(m => m.PaymentList) },
      { path: 'payments/initiate', loadComponent: () => import('./features/payments/payment-initiate/payment-initiate').then(m => m.PaymentInitiate) },
      { path: 'payments/:id', loadComponent: () => import('./features/payments/payment-detail/payment-detail').then(m => m.PaymentDetail) },
      {
        path: 'payment/failed',
        loadComponent: () => import('./features/payments/payment-failed/payment-failed')
          .then(m => m.PaymentFailed)
      },
      {
        path: 'payment/cancelled',
        loadComponent: () => import('./features/payments/payment-failed/payment-failed')
          .then(m => m.PaymentFailed)
      },
      {
        path: 'hearings/create',
        loadComponent: () => import('./features/hearings/hearing-form/hearing-form')
          .then(m => m.HearingForm)
      },
      {
        path: 'hearings/edit/:id',
        loadComponent: () => import('./features/hearings/hearing-form/hearing-form')
          .then(m => m.HearingForm)
      },
      {
        path: 'hearings/create',
        loadComponent: () => import('./features/hearings/hearing-form/hearing-form')
          .then(m => m.HearingForm)
      },

      {
        path: 'hearings/edit/:id',
        loadComponent: () => import('./features/hearings/hearing-form/hearing-form')
          .then(m => m.HearingForm)
      },
      { path: 'hearings', loadComponent: () => import('./features/hearings/hearing-list/hearing-list').then(m => m.HearingList) },
      { path: 'files', loadComponent: () => import('./features/files/file-list/file-list').then(m => m.FileList) },
      {
  path: 'case-types',
  loadComponent: () => import('./features/case-types/case-type-list/case-type-list')
    .then(m => m.CaseTypeList)
},
{
  path: 'payment-methods',
  loadComponent: () => import('./features/payment-methods/payment-method-list/payment-method-list')
    .then(m => m.PaymentMethodList)
},
      // { path: 'mail',         loadComponent: () => import('./features/mail/mail').then(m => m.Mail) },
      // { path: 'roles',        loadComponent: () => import('./features/roles/role-list/role-list').then(m => m.RoleList) },
      // { path: 'case-types',   loadComponent: () => import('./features/case-types/case-type-list/case-type-list').then(m => m.CaseTypeList) },
      // { path: 'clients',      loadComponent: () => import('./features/users/client-list/client-list').then(m => m.ClientList) },
      // { path: 'lawyers',      loadComponent: () => import('./features/users/lawyer-list/lawyer-list').then(m => m.LawyerList) },
      // { path: 'reports',      loadComponent: () => import('./features/reports/reports').then(m => m.Reports) },
      {
        path: 'users/create',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Admin'], adminMode: true },  // ✅ flag passed here
        loadComponent: () => import('./features/auth/register/register')
          .then(m => m.RegisterComponent)
      },
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { roles: ['Admin'] },
        loadComponent: () => import('./features/users/user-list/user-list').then(m => m.UserList)
      },

    ]
  },

  { path: '**', redirectTo: '' }
];
