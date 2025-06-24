import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header.component';
import { MovieGridComponent } from '../../../shared/components/movie-grid.component';
import { AuthService } from '../../../core/services/auth.service';
import { MovieService } from '../../../core/services/movie.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { User } from '../../../core/models/user.model';
import { MovieCardData } from '../../../shared/components/movie-card.component';
import { Movie, MovieSearchResponse } from '../../../core/models/movie.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    MovieGridComponent
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
            
            <!-- Profile Header -->
            <div class="flex items-center gap-6 mb-8 p-4">
              <div class="size-24 rounded-full overflow-hidden bg-accent">
                <img 
                  [src]="user?.profilePicture || 'https://via.placeholder.com/96/382929/FFFFFF?text=?'" 
                  [alt]="user?.username"
                  class="size-full object-cover"
                >
              </div>
              <div>
                <h1 class="text-2xl font-bold mb-2">{{ user?.username }}</h1>
                <p class="text-text-secondary">Membre depuis {{ formatDate(user?.createdAt) }}</p>
              </div>
              <div class="ml-auto">
                <button 
                  (click)="navigateToSettings()"
                  class="px-4 py-2 bg-accent hover:bg-opacity-80 rounded-lg transition-colors"
                >
                  Modifier le profil
                </button>
              </div>
            </div>

            <!-- Watch History -->
            <div class="mb-8">
              <h2 class="text-xl font-bold mb-4 px-4">Historique de visionnage</h2>
              <app-movie-grid
                [movies]="watchHistory"
                [loading]="isLoading"
                [showLoadMore]="hasMoreHistory"
                emptyMessage="Aucun film visionné"
                emptySubMessage="Commencez à regarder des films pour les voir apparaître ici"
                (movieClick)="onMovieClick($event)"
                (loadMore)="loadMoreHistory()"
              ></app-movie-grid>
            </div>

          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private movieService = inject(MovieService);
  private router = inject(Router);
  private navigationService = inject(NavigationService);

  user: User | null = null;
  watchHistory: MovieCardData[] = [];
  isLoading = true;
  hasMoreHistory = false;
  currentPage = 1;

  navigationLinks = this.navigationService.getNavigationLinks();

  constructor() {
    this.loadUserData();
    this.loadWatchHistory();
  }

  private loadUserData(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.user = user;
    });
  }

  private loadWatchHistory(page: number = 1): void {
    this.isLoading = true;
    this.movieService.getWatchHistory(page).subscribe({
      next: (response: MovieSearchResponse) => {
        const newHistory = response.data.map((movie: Movie) => ({
          id: movie.id,
          title: movie.title,
          posterUrl: movie.posterUrl || '',
          year: movie.year || 0,
          rating: movie.rating || '',
          progress: '100%' // You might want to adjust this based on your actual data
        }));

        if (page === 1) {
          this.watchHistory = newHistory;
        } else {
          this.watchHistory = [...this.watchHistory, ...newHistory];
        }

        this.hasMoreHistory = page < response.totalPages;
        this.currentPage = page;
      },
      error: (error: unknown) => {
        console.error('Error loading watch history:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  loadMoreHistory(): void {
    if (!this.isLoading && this.hasMoreHistory) {
      this.loadWatchHistory(this.currentPage + 1);
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  }

  navigateToSettings(): void {
    this.router.navigate(['/user/settings']);
  }

  onMovieClick(movie: MovieCardData): void {
    this.router.navigate(['/movies', movie.id]);
  }
} 