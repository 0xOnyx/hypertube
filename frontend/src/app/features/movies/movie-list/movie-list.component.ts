import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { MovieService } from '../../../core/services/movie.service';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  template: `
    <div class="movie-list-container">
      <h1>Films Populaires</h1>
      
      @if (isLoading) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        <div class="movies-grid">
          @for (movie of movies; track movie.id) {
            <mat-card class="movie-card" [routerLink]="['/movies', movie.id]">
              <img mat-card-image [src]="movie.poster" [alt]="movie.title">
              <mat-card-header>
                <mat-card-title>{{ movie.title }}</mat-card-title>
                <mat-card-subtitle>{{ movie.year }} • ⭐ {{ movie.imdbRating }}/10</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p class="plot">{{ movie.plot | slice:0:100 }}...</p>
              </mat-card-content>
            </mat-card>
          }
        </div>

        @if (totalResults > 0) {
          <mat-paginator 
            [length]="totalResults"
            [pageSize]="20"
            [pageIndex]="currentPage - 1"
            (page)="onPageChange($event)">
          </mat-paginator>
        }
      }
    </div>
  `,
  styles: [`
    .movie-list-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 24px;
      color: #333;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .movie-card {
      cursor: pointer;
      transition: transform 0.2s ease-in-out;
      height: 500px;
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
    }
  `]
})
export class MovieListComponent implements OnInit {
  private movieService = inject(MovieService);

  movies: Movie[] = [];
  isLoading = false;
  currentPage = 1;
  totalResults = 0;

  ngOnInit(): void {
    this.loadMovies();
  }

  private loadMovies(): void {
    this.isLoading = true;
    this.movieService.getPopularMovies(this.currentPage).subscribe({
      next: (response) => {
        this.movies = response.movies;
        this.totalResults = response.totalResults;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des films:', error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.loadMovies();
  }
} 