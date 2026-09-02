import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';

import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: LandingComponent,
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuardFn],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
