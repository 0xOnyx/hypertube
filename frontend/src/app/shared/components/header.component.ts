import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

interface NavigationLink {
  label: string;
  route: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center border-b border-border-color bg-dark-bg/80 px-4 backdrop-blur-sm">
      <div class="flex flex-1 items-center justify-between px-4">
        <!-- Logo & Navigation -->
        <div class="flex items-center gap-8">
          <!-- Logo -->
          <a [routerLink]="['/home']" class="flex items-center gap-2">
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
            <span class="text-lg font-bold">{{ appName || 'Hypertube' }}</span>
          </a>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center gap-6">
            <a
              *ngFor="let link of navigationLinks"
              [routerLink]="[link.route]"
              routerLinkActive="text-white"
              [routerLinkActiveOptions]="{ exact: true }"
              class="text-text-secondary hover:text-white transition-colors"
            >
              {{ link.label }}
            </a>
          </nav>
        </div>

        <!-- Search & User Actions -->
        <div class="flex items-center gap-4">
          <!-- Search -->
          <div *ngIf="showSearch" class="relative">
            <input
              type="text"
              [placeholder]="searchPlaceholder"
              class="w-64 px-4 py-2 bg-accent rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20"
              (input)="onSearchInput($event)"
              (keyup.enter)="onSearchSubmit($event)"
            >
          </div>

          <!-- Bookmarks -->
          <button 
            *ngIf="showBookmarks && currentUser"
            (click)="bookmarkClick.emit()"
            class="p-2 text-text-secondary hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.76,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z"></path>
            </svg>
          </button>

          <!-- User Menu -->
          <div class="relative" *ngIf="currentUser">
            <button
              (click)="toggleUserMenu()"
              class="flex items-center gap-2 p-1 rounded-full hover:bg-accent transition-colors"
            >
              <img
                [src]="currentUser.profilePicture || 'https://via.placeholder.com/40/382929/FFFFFF?text=?'"
                [alt]="currentUser.username"
                class="size-8 rounded-full object-cover"
              >
              <span class="text-white">{{ currentUser.username }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 256 256"
                [class.rotate-180]="isUserMenuOpen"
                class="transition-transform duration-200"
              >
                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              *ngIf="isUserMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-card-bg border border-border-color rounded-lg shadow-xl py-1"
            >
              <a
                [routerLink]="['/user']"
                class="block px-4 py-2 text-white hover:bg-accent transition-colors"
                (click)="closeUserMenu()"
              >
                Mon profil
              </a>
              <a
                [routerLink]="['/user/settings']"
                class="block px-4 py-2 text-white hover:bg-accent transition-colors"
                (click)="closeUserMenu()"
              >
                Paramètres
              </a>
              <div class="h-px bg-border-color my-1"></div>
              <button
                (click)="onLogout()"
                class="w-full text-left px-4 py-2 text-red-500 hover:bg-accent transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>

          <!-- Login Button -->
          <button
            *ngIf="!currentUser"
            (click)="userClick.emit()"
            class="px-4 py-2 bg-white text-dark-bg font-bold rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  @Input() appName?: string;
  @Input() navigationLinks: NavigationLink[] = [];
  @Input() showSearch = false;
  @Input() showBookmarks = false;
  @Input() searchPlaceholder = 'Rechercher...';

  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() searchSubmit = new EventEmitter<string>();
  @Output() bookmarkClick = new EventEmitter<void>();
  @Output() userClick = new EventEmitter<void>();

  isUserMenuOpen = false;
  currentUser: User | null = null;

  constructor() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQueryChange.emit(query);
  }

  onSearchSubmit(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubmit.emit(query);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
    this.closeUserMenu();
  }
}
