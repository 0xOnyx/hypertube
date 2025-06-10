import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { OAuth2Service, OAuth2Provider } from '../../../core/services/oauth2.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatSnackBarModule
  ],
  template: `
    <div class="relative flex size-full min-h-screen flex-col bg-dark-bg text-white" style='font-family: "Spline Sans", "Noto Sans", sans-serif;'>
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-gradient-to-br from-dark-bg via-accent to-card-bg opacity-60"></div>

      <!-- Main Container -->
      <div class="relative flex flex-1 items-center justify-center px-4 py-8">
        <div class="w-full max-w-md">

          <!-- Logo Section -->
          <div class="flex flex-col items-center mb-8">
            <div class="flex items-center gap-4 mb-6">
              <div class="size-8">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_6_319)">
                    <path
                      d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                      fill="currentColor"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_6_319"><rect width="48" height="48" fill="white"></rect></clipPath>
                  </defs>
                </svg>
              </div>
              <h1 class="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">Hypertube</h1>
            </div>
            <h2 class="text-white text-xl font-medium mb-2">Bienvenue de retour</h2>
            <p class="text-text-secondary text-sm text-center">Connectez-vous pour accéder à votre bibliothèque de films</p>
          </div>

          <!-- Login Card -->
          <div class="bg-card-bg border border-border-color rounded-lg p-8 shadow-xl">

            <!-- OAuth2 Providers Section -->
            <div class="mb-8" *ngIf="oauth2Providers.length > 0">
              <div class="space-y-3">
                <button
                  *ngFor="let provider of oauth2Providers; trackBy: trackProvider"
                  (click)="loginWithOAuth2(provider)"
                  class="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-border-color bg-accent hover:bg-opacity-80 transition-all duration-200 text-white font-medium"
                  [style.background-color]="provider.color"
                >
                  <i [class]="provider.icon" class="text-lg"></i>
                  <span>Continuer avec {{ provider.name }}</span>
                </button>
              </div>

              <!-- Divider -->
              <div class="flex items-center my-6">
                <div class="flex-1 h-px bg-border-color"></div>
                <span class="px-4 text-text-secondary text-sm">ou</span>
                <div class="flex-1 h-px bg-border-color"></div>
              </div>
            </div>

            <!-- Login Form -->
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">

              <!-- Username Field -->
              <div class="space-y-2">
                <label for="username" class="block text-sm font-medium text-white">
                  Nom d'utilisateur
                </label>
                <input
                  id="username"
                  type="text"
                  formControlName="username"
                  placeholder="Entrez votre nom d'utilisateur"
                  class="w-full px-4 py-3 bg-accent border border-border-color rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20 focus:border-white transition-colors"
                  [class.border-red-500]="loginForm.get('username')?.hasError('required') && loginForm.get('username')?.touched"
                />
                <div class="text-red-400 text-sm" *ngIf="loginForm.get('username')?.hasError('required') && loginForm.get('username')?.touched">
                  Le nom d'utilisateur est requis
                </div>
              </div>

              <!-- Password Field -->
              <div class="space-y-2">
                <label for="password" class="block text-sm font-medium text-white">
                  Mot de passe
                </label>
                <div class="relative">
                  <input
                    id="password"
                    [type]="showPassword ? 'text' : 'password'"
                    formControlName="password"
                    placeholder="Entrez votre mot de passe"
                    class="w-full px-4 py-3 pr-12 bg-accent border border-border-color rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20 focus:border-white transition-colors"
                    [class.border-red-500]="loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched"
                  />
                  <button
                    type="button"
                    (click)="togglePasswordVisibility()"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
                  >
                    <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
                    </svg>
                    <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.82,27.3,37.6,27.65,38.39A8,8,0,0,1,247.31,131.26Z"></path>
                    </svg>
                  </button>
                </div>
                <div class="text-red-400 text-sm" *ngIf="loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched">
                  Le mot de passe est requis
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                [disabled]="loginForm.invalid || isLoading"
                class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-dark-bg font-bold rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg *ngIf="isLoading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isLoading ? 'Connexion...' : 'Se connecter' }}</span>
              </button>

            </form>

            <!-- Register Link -->
            <div class="mt-8 text-center">
              <p class="text-text-secondary text-sm">
                Pas encore de compte ?
                <a [routerLink]="['/auth/register']" class="text-white font-medium hover:underline ml-1">
                  Créer un compte
                </a>
              </p>
            </div>

          </div>

          <!-- Back to Home -->
          <div class="mt-6 text-center">
            <a [routerLink]="['/home']" class="text-text-secondary hover:text-white text-sm transition-colors">
              ← Retour à l'accueil
            </a>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Additional custom styles if needed */
    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
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
  showPassword = false;
  oauth2Providers: OAuth2Provider[] = [];

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Charger les providers OAuth2 disponibles de manière plus robuste
    try {
      this.oauth2Service.getAvailableProviders().subscribe({
        next: (providers) => {
          this.oauth2Providers = providers || [];
        },
        error: (error) => {
          console.warn('Erreur lors du chargement des providers OAuth2:', error);
          this.oauth2Providers = [];
        }
      });
    } catch (error) {
      console.warn('Erreur lors de l\'initialisation des providers OAuth2:', error);
      this.oauth2Providers = [];
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (_response) => {
          this.snackBar.open('Connexion réussie !', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/home']);
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
    try {
      this.oauth2Service.initiateOAuth2Login(provider);
    } catch (error) {
      console.error('Erreur lors de la connexion OAuth2:', error);
      this.snackBar.open('Erreur lors de la connexion OAuth2', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  trackProvider(index: number, provider: OAuth2Provider): string {
    return provider.id;
  }
}
