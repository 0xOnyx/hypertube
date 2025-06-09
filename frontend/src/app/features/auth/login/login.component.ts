import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../core/services/auth.service';
import { OAuth2Service, OAuth2Provider } from '../../../core/services/oauth2.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Connexion à Hypertube</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <!-- OAuth2 Providers -->
          @if (oauth2Providers.length > 0) {
            <div class="oauth2-section">
              <h3>Connexion rapide</h3>
              @for (provider of oauth2Providers; track provider.id) {
                <button mat-raised-button 
                        class="oauth2-button"
                        [style.background-color]="provider.color"
                        (click)="loginWithOAuth2(provider)">
                  <i [class]="provider.icon"></i>
                  Se connecter avec {{ provider.name }}
                </button>
              }
              <mat-divider></mat-divider>
              <p class="or-text">ou</p>
            </div>
          }

          <!-- Formulaire classique -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nom d'utilisateur</mat-label>
              <input matInput formControlName="username" required>
              @if (loginForm.get('username')?.hasError('required') && loginForm.get('username')?.touched) {
                <mat-error>Le nom d'utilisateur est requis</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Mot de passe</mat-label>
              <input matInput type="password" formControlName="password" required>
              @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
                <mat-error>Le mot de passe est requis</mat-error>
              }
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="loginForm.invalid || isLoading" class="full-width">
              @if (isLoading) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Se connecter
              }
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <p>Pas encore de compte ? 
            <a [routerLink]="['/auth/register']" class="register-link">S'inscrire</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }

    .oauth2-section {
      margin-bottom: 24px;
    }

    .oauth2-section h3 {
      text-align: center;
      margin-bottom: 16px;
      color: #666;
      font-size: 1rem;
    }

    .oauth2-button {
      width: 100%;
      margin-bottom: 12px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-weight: 500;
    }

    .oauth2-button i {
      font-size: 18px;
    }

    .or-text {
      text-align: center;
      margin: 16px 0;
      color: #666;
      font-size: 0.9rem;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .register-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .register-link:hover {
      text-decoration: underline;
    }

    mat-card-actions {
      text-align: center;
      padding-top: 16px;
    }
  `]
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private oauth2Service = inject(OAuth2Service);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm: FormGroup;
  isLoading = false;
  oauth2Providers: OAuth2Provider[] = [];

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Charger les providers OAuth2 disponibles
    this.oauth2Service.getAvailableProviders().subscribe({
      next: (providers) => {
        this.oauth2Providers = providers;
      },
      error: (error) => {
        console.warn('Erreur lors du chargement des providers OAuth2:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (_response) => {
          this.snackBar.open('Connexion réussie !', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/dashboard']);
        },
        error: (_error) => {
          this.isLoading = false;
          this.snackBar.open('Erreur de connexion. Vérifiez vos identifiants.', 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  loginWithOAuth2(provider: OAuth2Provider): void {
    this.oauth2Service.initiateOAuth2Login(provider);
  }
} 