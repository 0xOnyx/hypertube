import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HeaderComponent } from '../../../shared/components/header.component';
import { AuthService } from '../../../core/services/auth.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { User, UserProfile } from '../../../core/models/user.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HeaderComponent,
    MatSnackBarModule
  ],
  template: `
    <div class="relative flex size-full min-h-screen flex-col bg-dark-bg text-white font-spline">
      <div class="layout-container flex h-full grow flex-col">
        <!-- Header -->
        <app-header
          appName="Hypertube"
          [navigationLinks]="navigationLinks"
        ></app-header>

        <!-- Main Content -->
        <div class="px-40 flex flex-1 justify-center py-5">
          <div class="layout-content-container flex flex-col max-w-[960px] flex-1">
            
            <!-- Settings Header -->
            <div class="mb-8 p-4">
              <h1 class="text-2xl font-bold">Paramètres du profil</h1>
              <p class="text-text-secondary">Gérez vos informations personnelles</p>
            </div>

            <!-- Settings Form -->
            <div class="bg-card-bg border border-border-color rounded-lg p-8">
              <form [formGroup]="settingsForm" (ngSubmit)="onSubmit()" class="space-y-6">
                
                <!-- Profile Picture -->
                <div class="flex items-center gap-4 mb-8">
                  <div class="size-24 rounded-full overflow-hidden bg-accent">
                    <img 
                      [src]="previewImage || user?.profilePicture || 'https://via.placeholder.com/96/382929/FFFFFF?text=?'" 
                      [alt]="user?.username"
                      class="size-full object-cover"
                    >
                  </div>
                  <div>
                    <label 
                      for="profilePicture"
                      class="px-4 py-2 bg-accent hover:bg-opacity-80 rounded-lg transition-colors cursor-pointer inline-block"
                    >
                      Changer la photo
                    </label>
                    <input
                      type="file"
                      id="profilePicture"
                      accept="image/*"
                      class="hidden"
                      (change)="onFileSelected($event)"
                    >
                    <p class="text-text-secondary text-sm mt-2">JPG, PNG ou GIF. 5MB max.</p>
                  </div>
                </div>

                <!-- Username Field -->
                <div class="space-y-2">
                  <label for="username" class="block text-sm font-medium">
                    Nom d'utilisateur
                  </label>
                  <input
                    id="username"
                    type="text"
                    formControlName="username"
                    class="w-full px-4 py-3 bg-accent border border-border-color rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20 focus:border-white transition-colors"
                    [class.border-red-500]="settingsForm.get('username')?.hasError('required') && settingsForm.get('username')?.touched"
                  />
                  <div class="text-red-400 text-sm" *ngIf="settingsForm.get('username')?.hasError('required') && settingsForm.get('username')?.touched">
                    Le nom d'utilisateur est requis
                  </div>
                </div>

                <!-- Email Field -->
                <div class="space-y-2">
                  <label for="email" class="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    formControlName="email"
                    class="w-full px-4 py-3 bg-accent border border-border-color rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20 focus:border-white transition-colors"
                    [class.border-red-500]="(settingsForm.get('email')?.hasError('required') || settingsForm.get('email')?.hasError('email')) && settingsForm.get('email')?.touched"
                  />
                  <div class="text-red-400 text-sm" *ngIf="settingsForm.get('email')?.hasError('required') && settingsForm.get('email')?.touched">
                    L'email est requis
                  </div>
                  <div class="text-red-400 text-sm" *ngIf="settingsForm.get('email')?.hasError('email') && settingsForm.get('email')?.touched">
                    L'email n'est pas valide
                  </div>
                </div>

                <!-- First Name Field -->
                <div class="space-y-2">
                  <label for="firstName" class="block text-sm font-medium">
                    Prénom
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    formControlName="firstName"
                    class="w-full px-4 py-3 bg-accent border border-border-color rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20 focus:border-white transition-colors"
                    [class.border-red-500]="settingsForm.get('firstName')?.hasError('required') && settingsForm.get('firstName')?.touched"
                  />
                  <div class="text-red-400 text-sm" *ngIf="settingsForm.get('firstName')?.hasError('required') && settingsForm.get('firstName')?.touched">
                    Le prénom est requis
                  </div>
                </div>

                <!-- Last Name Field -->
                <div class="space-y-2">
                  <label for="lastName" class="block text-sm font-medium">
                    Nom
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    formControlName="lastName"
                    class="w-full px-4 py-3 bg-accent border border-border-color rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20 focus:border-white transition-colors"
                    [class.border-red-500]="settingsForm.get('lastName')?.hasError('required') && settingsForm.get('lastName')?.touched"
                  />
                  <div class="text-red-400 text-sm" *ngIf="settingsForm.get('lastName')?.hasError('required') && settingsForm.get('lastName')?.touched">
                    Le nom est requis
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="flex justify-end pt-4">
                  <button
                    type="submit"
                    [disabled]="settingsForm.invalid || isLoading"
                    class="px-6 py-3 bg-white text-dark-bg font-bold rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {{ isLoading ? 'Enregistrement...' : 'Enregistrer les modifications' }}
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private navigationService = inject(NavigationService);

  user: User | null = null;
  settingsForm: FormGroup;
  isLoading = false;
  previewImage: string | null = null;

  navigationLinks = this.navigationService.getNavigationLinks();

  constructor() {
    this.settingsForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });

    this.loadUserData();
  }

  private loadUserData(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
        this.settingsForm.patchValue({
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        });
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        this.snackBar.open('Le fichier est trop volumineux. Maximum 5MB.', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.settingsForm.valid && !this.isLoading) {
      this.isLoading = true;
      const formData = this.settingsForm.value;

      this.authService.updateProfile(formData).subscribe({
        next: (_response) => {
          this.snackBar.open('Profil mis à jour avec succès !', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (_error) => {
          this.isLoading = false;
          this.snackBar.open('Erreur lors de la mise à jour du profil', 'Fermer', {
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
} 