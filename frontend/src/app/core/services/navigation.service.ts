import { Injectable } from '@angular/core';

export interface NavigationLink {
  label: string;
  route: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly navigationLinks: NavigationLink[] = [
    { label: 'Accueil', route: '/home' },
    { label: 'Films', route: '/movies' },
    { label: 'Séries', route: '/series' },
    { label: 'Ma Liste', route: '/watchlist' }
  ];

  getNavigationLinks(): NavigationLink[] {
    return this.navigationLinks;
  }
} 