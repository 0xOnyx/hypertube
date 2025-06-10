import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { MovieService } from '../../../core/services/movie.service';
import { Movie } from '../../../core/models/movie.model';
import {
  HeaderComponent,
  MovieGridComponent,
  SearchFiltersComponent,
  MovieCardData,
  FilterOption,
  SearchFilters
} from '../../../shared/components';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HeaderComponent,
    MovieGridComponent,
    SearchFiltersComponent
  ],
  template: `
    <div class="relative flex size-full min-h-screen flex-col bg-dark-bg overflow-x-hidden font-spline">
      <div class="layout-container flex h-full grow flex-col">
        <!-- Header -->
        <app-header
          appName="Hypertube"
          [navigationLinks]="navigationLinks"
          [userAvatar]="userAvatar"
          [showSearch]="false"
          (bookmarkClick)="onBookmarkClick()"
          (userClick)="onUserClick()"
        ></app-header>

        <!-- Main Content -->
        <div class="px-40 flex flex-1 justify-center py-5">
          <div class="layout-content-container flex flex-col max-w-[960px] flex-1">

            <!-- Search Filters -->
            <app-search-filters
              [showSearchBar]="true"
              searchPlaceholder="Search for movies..."
              [genreOptions]="genreOptions"
              [yearOptions]="yearOptions"
              [additionalFilters]="additionalFilters"
              (searchChange)="onSearchChange($event)"
              (filtersChange)="onFiltersChange($event)"
            ></app-search-filters>

            <!-- Search Results -->
            <div *ngIf="hasSearched || isLoading">
              <app-movie-grid
                [title]="getResultsTitle()"
                [movies]="movieCards"
                [loading]="isLoading"
                [showLoadMore]="false"
                emptyMessage="No movies found"
                emptySubMessage="Try different keywords or adjust your filters"
                (movieClick)="onMovieClick($event)"
                (playMovie)="onPlayMovie($event)"
                (bookmarkMovie)="onBookmarkMovie($event)"
              ></app-movie-grid>
            </div>

            <!-- Initial State -->
            <div *ngIf="!hasSearched && !isLoading" class="text-center py-16">
              <div class="text-6xl mb-4">🎬</div>
              <h2 class="text-white text-2xl font-bold mb-2">Search for Movies</h2>
              <p class="text-text-secondary text-lg">Enter a movie title to start searching</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MovieSearchComponent {
  private movieService = inject(MovieService);
  private router = inject(Router);

  searchControl = new FormControl('');
  searchResults: Movie[] = [];
  isLoading = false;
  hasSearched = false;
  totalResults = 0;
  currentQuery = '';
  currentFilters: SearchFilters = {};

  // Navigation
  navigationLinks = [
    { label: 'Home', route: '/home' },
    { label: 'Movies', route: '/movies' },
    { label: 'Series', route: '/series' },
    { label: 'My List', route: '/watchlist' }
  ];

  userAvatar = 'https://via.placeholder.com/40';

  // Filter options
  genreOptions: FilterOption[] = [
    { value: 'action', label: 'Action' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'drama', label: 'Drama' },
    { value: 'horror', label: 'Horror' },
    { value: 'sci-fi', label: 'Sci-Fi' },
    { value: 'thriller', label: 'Thriller' },
    { value: 'romance', label: 'Romance' },
    { value: 'animation', label: 'Animation' },
    { value: 'documentary', label: 'Documentary' }
  ];

  yearOptions: FilterOption[] = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2010s', label: '2010s' },
    { value: '2000s', label: '2000s' },
    { value: '1990s', label: '1990s' },
    { value: '1980s', label: '1980s' }
  ];

  additionalFilters = [
    {
      key: 'rating',
      label: 'Rating',
      options: [
        { value: '9+', label: '9.0+' },
        { value: '8+', label: '8.0+' },
        { value: '7+', label: '7.0+' },
        { value: '6+', label: '6.0+' },
        { value: '5+', label: '5.0+' }
      ]
    },
    {
      key: 'language',
      label: 'Language',
      options: [
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'French' },
        { value: 'es', label: 'Spanish' },
        { value: 'de', label: 'German' },
        { value: 'it', label: 'Italian' },
        { value: 'ja', label: 'Japanese' },
        { value: 'ko', label: 'Korean' }
      ]
    }
  ];

  get movieCards(): MovieCardData[] {
    return this.searchResults.map(movie => ({
      id: movie.id,
      title: movie.title,
      subtitle: `${movie.year || 'N/A'} • ⭐ ${movie.rating || movie.imdbRating || 'N/A'}/10`,
      posterUrl: movie.posterUrl || movie.poster || 'https://via.placeholder.com/300x450',
      year: movie.year,
      rating: movie.rating || movie.imdbRating,
      genres: movie.genres || [],
      isBookmarked: false // TODO: implement bookmark logic
    }));
  }

  constructor() {
    // Set up reactive search
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => {
        if (query && query.trim().length > 2) {
          this.isLoading = true;
          this.hasSearched = true;
          this.currentQuery = query.trim();
          return this.movieService.searchMovies(query.trim());
        } else {
          this.searchResults = [];
          this.hasSearched = false;
          this.isLoading = false;
          return of(null);
        }
      })
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response) {
          this.searchResults = response.data;
          this.totalResults = response.total;
        }
      },
      error: (error) => {
        console.error('Erreur lors de la recherche:', error);
        this.isLoading = false;
        this.searchResults = [];
      }
    });
  }

  // Search and filter handlers
  onSearchChange(query: string): void {
    this.searchControl.setValue(query, { emitEvent: true });
  }

  onFiltersChange(filters: SearchFilters): void {
    this.currentFilters = filters;
    this.performSearchWithFilters();
  }

  private performSearchWithFilters(): void {
    if (this.currentQuery) {
      this.isLoading = true;
      // TODO: Implement search with filters
      console.log('Search with filters:', this.currentQuery, this.currentFilters);

      this.movieService.searchMovies(this.currentQuery).subscribe({
        next: (response) => {
          this.searchResults = this.applyClientSideFilters(response.data);
          this.totalResults = this.searchResults.length;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors de la recherche avec filtres:', error);
          this.isLoading = false;
        }
      });
    }
  }

  private applyClientSideFilters(movies: Movie[]): Movie[] {
    let filtered = [...movies];

    // Apply genre filter
    if (this.currentFilters.genre) {
      filtered = filtered.filter(movie =>
        movie.genres?.some(genre => genre.toLowerCase().includes(this.currentFilters.genre!.toLowerCase()))
      );
    }

    // Apply year filter
    if (this.currentFilters.releaseYear) {
      const yearFilter = this.currentFilters.releaseYear;
      if (yearFilter.includes('s')) {
        // Decade filter (e.g., "2010s")
        const decade = parseInt(yearFilter.replace('s', ''));
        filtered = filtered.filter(movie =>
          movie.year && movie.year >= decade && movie.year < decade + 10
        );
      } else {
        // Specific year
        const year = parseInt(yearFilter);
        filtered = filtered.filter(movie => movie.year === year);
      }
    }

    // Apply rating filter
    if (this.currentFilters.rating) {
      const ratingThreshold = parseFloat(this.currentFilters.rating.replace('+', ''));
      filtered = filtered.filter(movie => (movie.rating || movie.imdbRating || 0) >= ratingThreshold);
    }

    return filtered;
  }

  getResultsTitle(): string {
    if (this.isLoading) {
      return 'Searching...';
    }

    if (this.searchResults.length === 0) {
      return `No results for "${this.currentQuery}"`;
    }

    const filtersApplied = Object.keys(this.currentFilters).length > 0;
    return `${this.totalResults} result${this.totalResults !== 1 ? 's' : ''} for "${this.currentQuery}"${filtersApplied ? ' (filtered)' : ''}`;
  }

  // Action handlers
  onMovieClick(movie: MovieCardData): void {
    this.router.navigate(['/movies', movie.id]);
  }

  onPlayMovie(movie: MovieCardData): void {
    // TODO: Implement direct play functionality
    console.log('Play movie:', movie.title);
    this.router.navigate(['/movies', movie.id]);
  }

  onBookmarkMovie(movie: MovieCardData): void {
    // TODO: Implement bookmark functionality
    console.log('Bookmark movie:', movie.title);
  }

  // Navigation handlers
  onBookmarkClick(): void {
    this.router.navigate(['/watchlist']);
  }

  onUserClick(): void {
    this.router.navigate(['/profile']);
  }
}
