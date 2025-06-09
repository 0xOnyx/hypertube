import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { MovieService } from '../../../core/services/movie.service';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="search-container">
      <h1>Recherche de Films</h1>
      
      <div class="search-form">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Rechercher un film...</mat-label>
          <input matInput [formControl]="searchControl" placeholder="Titre du film">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      @if (isLoading) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      }

      @if (searchResults.length > 0) {
        <div class="results-section">
          <h2>Résultats de recherche ({{ totalResults }} films trouvés)</h2>
          <div class="movies-grid">
            @for (movie of searchResults; track movie.id) {
              <mat-card class="movie-card" [routerLink]="['/movies', movie.id]">
                <img mat-card-image [src]="movie.poster" [alt]="movie.title">
                <mat-card-header>
                  <mat-card-title>{{ movie.title }}</mat-card-title>
                  <mat-card-subtitle>{{ movie.year }} • ⭐ {{ movie.imdbRating }}/10</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p class="plot">{{ movie.plot | slice:0:100 }}...</p>
                  <div class="genres">
                    @for (genre of movie.genres; track genre) {
                      <span class="genre-chip">{{ genre }}</span>
                    }
                  </div>
                </mat-card-content>
              </mat-card>
            }
          </div>
        </div>
      }

      @if (hasSearched && searchResults.length === 0 && !isLoading) {
        <div class="no-results">
          <mat-icon>movie_filter</mat-icon>
          <h3>Aucun film trouvé</h3>
          <p>Essayez avec d'autres mots-clés</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .search-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 24px;
      color: #333;
    }

    .search-form {
      margin-bottom: 32px;
    }

    .search-field {
      width: 100%;
      max-width: 500px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    .results-section h2 {
      margin-bottom: 24px;
      color: #333;
    }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 24px;
    }

    .movie-card {
      cursor: pointer;
      transition: transform 0.2s ease-in-out;
      height: 550px;
    }

    .movie-card:hover {
      transform: scale(1.02);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .movie-card img {
      height: 300px;
      object-fit: cover;
    }

    .plot {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
      margin-bottom: 12px;
    }

    .genres {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .genre-chip {
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
    }

    .no-results {
      text-align: center;
      padding: 48px;
      color: #666;
    }

    .no-results mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
  `]
})
export class MovieSearchComponent {
  private movieService = inject(MovieService);

  searchControl = new FormControl('');
  searchResults: Movie[] = [];
  isLoading = false;
  hasSearched = false;
  totalResults = 0;

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query && query.trim().length > 2) {
          this.isLoading = true;
          return this.movieService.searchMovies(query.trim());
        } else {
          this.searchResults = [];
          this.hasSearched = false;
          return of(null);
        }
      })
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response) {
          this.searchResults = response.movies;
          this.totalResults = response.totalResults;
          this.hasSearched = true;
        }
      },
      error: (error) => {
        console.error('Erreur lors de la recherche:', error);
        this.isLoading = false;
        this.hasSearched = true;
      }
    });
  }
} 