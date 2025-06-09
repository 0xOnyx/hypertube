import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OAuth2Provider {
  id: string;
  name: string;
  authUrl: string;
  color: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class OAuth2Service {
  private http = inject(HttpClient);
  private apiUrl = '/api';

  getAvailableProviders(): Observable<OAuth2Provider[]> {
    return this.http.get<OAuth2Provider[]>(`${this.apiUrl}/auth/oauth2/providers`);
  }

  initiateOAuth2Login(provider: OAuth2Provider): void {
    // Rediriger vers l'URL d'autorisation OAuth2
    window.location.href = provider.authUrl;
  }
} 