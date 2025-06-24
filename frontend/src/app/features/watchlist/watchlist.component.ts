import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent, MovieGridComponent } from '../../shared/components';
import { NavigationService } from '../../core/services/navigation.service';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, MovieGridComponent],
  template: `
    <div class="relative flex size-full min-h-screen flex-col bg-dark-bg overflow-x-hidden font-spline">
      <div class="layout-container flex h-full grow flex-col">
        <!-- Header -->
        <app-header
          appName="Hypertube"
          [navigationLinks]="navigationLinks"
          [userAvatar]="userAvatar"
          (bookmarkClick)="onBookmarkClick()"
          (userClick)="onUserClick()"
        ></app-header>

        <!-- Main Content -->
        <div class="px-40 flex flex-1 justify-center py-5">
          <div class="layout-content-container flex flex-col max-w-[960px] flex-1">
            <app-movie-grid
              title="Ma Liste"
              [movies]="[]"
              [loading]="false"
              [showLoadMore]="false"
              emptyMessage="Votre liste est vide"
              emptySubMessage="Ajoutez des films et séries à votre liste pour les retrouver facilement"
              (movieClick)="onMovieClick($event)"
              (playMovie)="onPlayMovie($event)"
              (bookmarkMovie)="onBookmarkMovie($event)"
            ></app-movie-grid>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class WatchlistComponent {
  private router = inject(Router);
  private navigationService = inject(NavigationService);

  navigationLinks = this.navigationService.getNavigationLinks();
  userAvatar = 'https://via.placeholder.com/40';

  onBookmarkClick(): void {
    this.router.navigate(['/watchlist']);
  }

  onUserClick(): void {
    this.router.navigate(['/profile']);
  }

  onMovieClick(movie: any): void {
    this.router.navigate(['/movies', movie.id]);
  }

  onPlayMovie(movie: any): void {
    this.router.navigate(['/movies', movie.id]);
  }

  onBookmarkMovie(movie: any): void {
    // TODO: Implement bookmark functionality
    console.log('Remove from watchlist:', movie.title);
  }
} 