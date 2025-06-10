import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-oauth2-redirect',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="redirect-container">
      <mat-spinner diameter="50"></mat-spinner>
      <p>Finalisation de la connexion...</p>
    </div>
  `,
  styles: [`
    .redirect-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      gap: 20px;
    }
  `]
})
export class OAuth2RedirectComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const refreshToken = params['refreshToken'];

      if (token && refreshToken) {
        // Stocker les tokens
        localStorage.setItem('hypertube_token', token);
        localStorage.setItem('hypertube_refresh_token', refreshToken);

        // Mettre à jour le service d'authentification
        this.authService.getCurrentUser().subscribe({
          next: () => {
            this.router.navigate(['/home']);
          },
          error: () => {
            this.router.navigate(['/auth/login']);
          }
        });
      } else {
        // Rediriger vers login en cas d'erreur
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
