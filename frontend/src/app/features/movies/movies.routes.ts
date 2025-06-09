import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const MOVIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./movie-list/movie-list.component').then(m => m.MovieListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'search',
    loadComponent: () => import('./movie-search/movie-search.component').then(m => m.MovieSearchComponent),
    canActivate: [authGuard]
  },
  {
    path: ':id',
    loadComponent: () => import('./movie-detail/movie-detail.component').then(m => m.MovieDetailComponent),
    canActivate: [authGuard]
  }
]; 