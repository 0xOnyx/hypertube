import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header.component';
import { MovieCardComponent, MovieCardData } from '../../../shared/components/movie-card.component';
import { MovieService } from '../../../core/services/movie.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { Movie } from '../../../core/models/movie.model';

interface FeaturedContent {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
}

interface Category {
  name: string;
  image: string;
  value: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MovieCardComponent],
  template: `
    <div class="relative flex size-full min-h-screen flex-col bg-dark-bg text-white" style='font-family: "Spline Sans", "Noto Sans", sans-serif;'>
      <div class="layout-container flex h-full grow flex-col">
        <!-- Header -->
        <app-header
          appName="Hypertube"
          [navigationLinks]="navigationLinks"
          [userAvatar]="userAvatar"
          [showSearch]="true"
          [showBookmarks]="true"
          (searchQueryChange)="onSearchChange($event)"
          (searchSubmit)="onSearchSubmit($event)"
          (bookmarkClick)="onBookmarkClick()"
          (userClick)="onUserClick()"
        ></app-header>

        <!-- Main Content -->
        <div class="px-40 flex flex-1 justify-center py-5">
          <div class="layout-content-container flex flex-col max-w-[960px] flex-1">
            
            <!-- Hero Section with Carousel -->
            <div class="mb-8">
              <div class="px-4 py-3">
                <div
                  class="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-dark-bg rounded-lg min-h-80 relative"
                  [style.background-image]="'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url(' + currentHeroImage + ')'"
                >
                  <!-- Carousel indicators -->
                  <div class="flex justify-center gap-2 p-5">
                    <div 
                      *ngFor="let item of featuredContent; let i = index" 
                      class="size-1.5 rounded-full bg-white cursor-pointer transition-opacity"
                      [class.opacity-50]="currentHeroIndex !== i"
                      tabindex="0"
                      role="button"
                      [attr.aria-label]="'Go to slide ' + (i + 1)"
                      (click)="setCurrentHero(i)"
                      (keydown.enter)="setCurrentHero(i)"
                      (keydown.space)="setCurrentHero(i)"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Featured Anime Section -->
            <h2 class="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Featured Movies</h2>
            <div class="flex overflow-x-auto overflow-y-hidden scrollbar-hide">
              <div class="flex items-stretch p-4 gap-3">
                <div 
                  *ngFor="let featured of featuredMovies" 
                  class="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60 cursor-pointer hover:scale-105 transition-transform"
                  tabindex="0"
                  role="button"
                  [attr.aria-label]="'View details for ' + featured.title"
                  (click)="onMovieClick(featured)"
                  (keydown.enter)="onMovieClick(featured)"
                  (keydown.space)="onMovieClick(featured)"
                >
                  <div
                    class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex flex-col"
                    [style.background-image]="'url(' + featured.posterUrl + ')'"
                  ></div>
                  <div>
                    <p class="text-white text-base font-medium leading-normal">{{ featured.title }}</p>
                    <p class="text-text-secondary text-sm font-normal leading-normal">{{ featured.subtitle }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- New Releases Section -->
            <h2 class="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">New Releases</h2>
            <div class="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              <app-movie-card
                *ngFor="let movie of newReleases"
                [movie]="movie"
                (cardClick)="onMovieClick($event)"
                (playClick)="onPlayMovie($event)"
                (bookmarkClick)="onBookmarkMovie($event)"
              ></app-movie-card>
            </div>

            <!-- Popular Categories Section -->
            <h2 class="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Popular Categories</h2>
            <div class="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              <div 
                *ngFor="let category of categories" 
                class="flex flex-col gap-3 pb-3 cursor-pointer hover:scale-105 transition-transform"
                tabindex="0"
                role="button"
                [attr.aria-label]="'Browse ' + category.name + ' movies'"
                (click)="onCategoryClick(category)"
                (keydown.enter)="onCategoryClick(category)"
                (keydown.space)="onCategoryClick(category)"
              >
                <div
                  class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  [style.background-image]="'url(' + category.image + ')'"
                ></div>
                <p class="text-white text-base font-medium leading-normal">{{ category.name }}</p>
              </div>
            </div>

            <!-- Login CTA Section -->
            <div class="flex justify-center py-8">
              <div class="text-center">
                <h3 class="text-white text-xl font-bold mb-4">Want to watch these movies?</h3>
                <p class="text-text-secondary mb-6">Sign in to access our full library and start watching</p>
                <button 
                  (click)="onLoginClick()"
                  class="bg-primary-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Sign In to Watch
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  `]
})
export class LandingComponent {
  private movieService = inject(MovieService);
  private router = inject(Router);
  private navigationService = inject(NavigationService);

  navigationLinks = this.navigationService.getNavigationLinks();
  userAvatar = 'https://via.placeholder.com/40';

  // Hero carousel data
  featuredContent: FeaturedContent[] = [
    {
      id: '1',
      title: 'The Dragon\'s Ascent',
      description: 'A young warrior embarks on a perilous quest to save his kingdom.',
      backgroundImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop'
    },
    {
      id: '2', 
      title: 'Galactic Odyssey',
      description: 'A group of explorers ventures into the unknown reaches of space.',
      backgroundImage: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=400&fit=crop'
    },
    {
      id: '3',
      title: 'Whispers of the Heart', 
      description: 'Two high school students discover a connection that transcends time.',
      backgroundImage: 'https://images.unsplash.com/photo-1489599763467-b7b97b7e5c3a?w=800&h=400&fit=crop'
    }
  ];

  currentHeroIndex = 0;
  
  get currentHeroImage(): string {
    return this.featuredContent[this.currentHeroIndex]?.backgroundImage || '';
  }

  // Categories data
  categories: Category[] = [
    { name: 'Action', value: 'action', image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=300&fit=crop' },
    { name: 'Adventure', value: 'adventure', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop' },
    { name: 'Romance', value: 'romance', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop' },
    { name: 'Sci-Fi', value: 'sci-fi', image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=300&fit=crop' },
    { name: 'Fantasy', value: 'fantasy', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop' },
    { name: 'Drama', value: 'drama', image: 'https://images.unsplash.com/photo-1489599763467-b7b97b7e5c3a?w=300&h=300&fit=crop' }
  ];

  // Movie data
  featuredMovies: MovieCardData[] = [];
  newReleases: MovieCardData[] = [];

  constructor() {
    this.loadMovies();
    this.startHeroCarousel();
  }

  private async loadMovies(): Promise<void> {
    try {
      // Load popular movies for featured section
      const popularResponse = await this.movieService.getPopularMovies().toPromise();
      if (popularResponse) {
        this.featuredMovies = popularResponse.data.slice(0, 3).map(movie => this.mapToMovieCardData(movie));
        this.newReleases = popularResponse.data.slice(3, 9).map(movie => this.mapToMovieCardData(movie));
      }
    } catch (error) {
      console.error('Error loading movies:', error);
      // Fallback data
      this.setFallbackData();
    }
  }

  private mapToMovieCardData(movie: Movie): MovieCardData {
    return {
      id: movie.id,
      title: movie.title,
      subtitle: `${movie.year || 'N/A'} • ⭐ ${movie.rating || movie.imdbRating || 'N/A'}/10`,
      posterUrl: movie.posterUrl || movie.poster || 'https://via.placeholder.com/300x450/382929/FFFFFF?text=' + encodeURIComponent(movie.title),
      year: movie.year,
      rating: movie.rating || movie.imdbRating,
      genres: movie.genres || [],
      isBookmarked: false
    };
  }

  private setFallbackData(): void {
    // Fallback featured movies
    this.featuredMovies = [
      {
        id: '1',
        title: 'The Dragon\'s Ascent',
        subtitle: '2024 • ⭐ 8.5/10',
        posterUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop',
        year: 2024,
        rating: 8.5,
        genres: ['Action', 'Fantasy'],
        isBookmarked: false
      },
      {
        id: '2',
        title: 'Galactic Odyssey',
        subtitle: '2024 • ⭐ 9.1/10',
        posterUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=225&fit=crop',
        year: 2024,
        rating: 9.1,
        genres: ['Sci-Fi', 'Adventure'],
        isBookmarked: false
      },
      {
        id: '3',
        title: 'Whispers of the Heart',
        subtitle: '2023 • ⭐ 8.7/10',
        posterUrl: 'https://images.unsplash.com/photo-1489599763467-b7b97b7e5c3a?w=400&h=225&fit=crop',
        year: 2023,
        rating: 8.7,
        genres: ['Romance', 'Drama'],
        isBookmarked: false
      }
    ];

    // Fallback new releases
    this.newReleases = [
      {
        id: '4',
        title: 'Crimson Skies',
        subtitle: '2024 • ⭐ 8.2/10',
        posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop',
        year: 2024,
        rating: 8.2,
        genres: ['Action', 'Thriller'],
        isBookmarked: false
      },
      {
        id: '5',
        title: 'Echoes of the Past',
        subtitle: '2024 • ⭐ 7.9/10',
        posterUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop',
        year: 2024,
        rating: 7.9,
        genres: ['Mystery', 'Adventure'],
        isBookmarked: false
      },
      {
        id: '6',
        title: 'Starlight Serenade',
        subtitle: '2023 • ⭐ 8.8/10',
        posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop',
        year: 2023,
        rating: 8.8,
        genres: ['Fantasy', 'Musical'],
        isBookmarked: false
      },
      {
        id: '7',
        title: 'The Ironclad Knight',
        subtitle: '2024 • ⭐ 8.0/10',
        posterUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=450&fit=crop',
        year: 2024,
        rating: 8.0,
        genres: ['Action', 'Medieval'],
        isBookmarked: false
      },
      {
        id: '8',
        title: 'Mystic Melody',
        subtitle: '2023 • ⭐ 8.3/10',
        posterUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
        year: 2023,
        rating: 8.3,
        genres: ['Fantasy', 'Adventure'],
        isBookmarked: false
      },
      {
        id: '9',
        title: 'Chronicles of the Void',
        subtitle: '2024 • ⭐ 8.6/10',
        posterUrl: 'https://images.unsplash.com/photo-1489599763467-b7b97b7e5c3a?w=300&h=450&fit=crop',
        year: 2024,
        rating: 8.6,
        genres: ['Sci-Fi', 'Drama'],
        isBookmarked: false
      }
    ];
  }

  private startHeroCarousel(): void {
    setInterval(() => {
      this.currentHeroIndex = (this.currentHeroIndex + 1) % this.featuredContent.length;
    }, 5000); // Change every 5 seconds
  }

  // Event handlers
  setCurrentHero(index: number): void {
    this.currentHeroIndex = index;
  }

  onSearchChange(query: string): void {
    // TODO: Implement search suggestions
    console.log('Search query:', query);
  }

  onSearchSubmit(query: string): void {
    this.router.navigate(['/movies'], { queryParams: { search: query } });
  }

  onMovieClick(movie: MovieCardData): void {
    this.router.navigate(['/movies', movie.id]);
  }

  onPlayMovie(movie: MovieCardData): void {
    this.router.navigate(['/movies', movie.id]);
  }

  onBookmarkMovie(movie: MovieCardData): void {
    // TODO: Implement bookmark functionality
    console.log('Bookmark movie:', movie.title);
  }

  onBookmarkClick(): void {
    this.router.navigate(['/watchlist']);
  }

  onUserClick(): void {
    this.router.navigate(['/user']);
  }

  onCategoryClick(category: Category): void {
    this.router.navigate(['/movies'], { queryParams: { genre: category.value } });
  }

  onLoginClick(): void {
    this.router.navigate(['/auth/login']);
  }

  // Keyboard event handlers for accessibility
  onKeydown(event: KeyboardEvent, action: () => void): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  }
} 