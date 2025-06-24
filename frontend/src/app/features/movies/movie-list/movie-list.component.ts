import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { MovieService } from '../../../core/services/movie.service';
import { NavigationService } from '../../../core/services/navigation.service';
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
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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
          (searchQueryChange)="onHeaderSearch($event)"
          (searchSubmit)="onHeaderSearchSubmit($event)"
          (bookmarkClick)="onBookmarkClick()"
          (userClick)="onUserClick()"
        ></app-header>

        <!-- Main Content -->
        <div class="px-40 flex flex-1 justify-center py-5">
          <div class="layout-content-container flex flex-col max-w-[960px] flex-1">

            <!-- Search Filters -->
            <app-search-filters
              [showSearchBar]="true"
              searchPlaceholder="Search movies..."
              [genreOptions]="genreOptions"
              [yearOptions]="yearOptions"
              [additionalFilters]="additionalFilters"
              (searchChange)="onSearchChange($event)"
              (filtersChange)="onFiltersChange($event)"
            ></app-search-filters>

            <!-- Movies Grid -->
            <app-movie-grid
              title="Popular Movies"
              [movies]="movieCards"
              [loading]="isLoading"
              [showLoadMore]="hasMorePages"
              emptyMessage="No movies found"
              emptySubMessage="Try adjusting your search or filters"
              (movieClick)="onMovieClick($event)"
              (playMovie)="onPlayMovie($event)"
              (bookmarkMovie)="onBookmarkMovie($event)"
              (loadMore)="onLoadMore()"
            ></app-movie-grid>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MovieListComponent implements OnInit {
  private movieService = inject(MovieService);
  private router = inject(Router);
  private navigationService = inject(NavigationService);

  movies: Movie[] = [];
  isLoading = false;
  currentPage = 1;
  totalResults = 0;
  searchQuery = '';
  currentFilters: SearchFilters = {};

  // Navigation
  navigationLinks = this.navigationService.getNavigationLinks();
  userAvatar = 'https://via.placeholder.com/40';

  // Filter options
  genreOptions: FilterOption[] = [
    { value: 'action', label: 'Action' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'drama', label: 'Drama' },
    { value: 'horror', label: 'Horror' },
    { value: 'sci-fi', label: 'Sci-Fi' },
    { value: 'thriller', label: 'Thriller' }
  ];

  yearOptions: FilterOption[] = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2010s', label: '2010s' },
    { value: '2000s', label: '2000s' },
    { value: '1990s', label: '1990s' }
  ];

  additionalFilters = [
    {
      key: 'rating',
      label: 'Rating',
      options: [
        { value: '9+', label: '9.0+' },
        { value: '8+', label: '8.0+' },
        { value: '7+', label: '7.0+' },
        { value: '6+', label: '6.0+' }
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
        { value: 'it', label: 'Italian' }
      ]
    }
  ];

  get movieCards(): MovieCardData[] {
    return this.movies?.map(movie => ({
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

  get hasMorePages(): boolean {
    const itemsPerPage = 20; // Default limit used by backend
    return this.currentPage * itemsPerPage < this.totalResults;
  }

  ngOnInit(): void {
    this.loadMovies();
  }

  private loadMovies(): void {
    this.isLoading = true;
    this.movieService.getPopularMovies(this.currentPage).subscribe({
      next: (response) => {
        if (response && response.data){
          if (this.currentPage === 1) {
            this.movies = response.data;
          } else {
            this.movies = [...this.movies, ...response.data];
          }
          this.totalResults = response.total;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des films:', error);
        this.isLoading = false;
      }
    });
  }

  // Search and filter handlers
  onHeaderSearch(query: string): void {
    this.searchQuery = query;
    this.performSearch();
  }

  onHeaderSearchSubmit(query: string): void {
    this.searchQuery = query;
    this.performSearch();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.performSearch();
  }

  onFiltersChange(filters: SearchFilters): void {
    this.currentFilters = filters;
    this.currentPage = 1;
    this.performSearch();
  }

  private performSearch(): void {
    // TODO: Implement search with filters
    console.log('Search:', this.searchQuery, 'Filters:', this.currentFilters);
    this.currentPage = 1;
    this.loadMovies();
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

  onLoadMore(): void {
    this.currentPage++;
    this.loadMovies();
  }

  // Navigation handlers
  onBookmarkClick(): void {
    this.router.navigate(['/watchlist']);
  }

  onUserClick(): void {
    this.router.navigate(['/profile']);
  }
}
