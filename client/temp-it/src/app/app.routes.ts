import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./Pages/tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'auth',
    loadComponent: () => import('./Pages/auth/auth.page').then((m) => m.AuthPage),
  },
  {
    path: 'analytics',
    loadChildren: () =>
      import('./Pages/analytics/analytics.module').then(
        (m) => m.AnalyticsPageModule
      ),
  }
];
