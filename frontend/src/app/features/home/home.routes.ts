import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing/landing.component').then(c => c.LandingComponent)
  }
]; 