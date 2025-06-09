import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { AuthService } from '../../core/services/auth.service';
import { MovieService } from '../../core/services/movie.service';
import { User } from '../../core/models/user.model';
import { Movie } from '../../core/models/movie.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Hypertube</span>
      <span class="spacer"></span>
      @if (currentUser) {
        <span>Bonjour, {{ currentUser.firstName }} !</span>
        <button mat-button [routerLink]="['/movies']">Films</button>
        <button mat-button [routerLink]="['/movies/search']">Recherche</button>
        <button mat-icon-button (click)="logout()">
          <mat-icon>logout</mat-icon>
        </button>
      }
    </mat-toolbar>

    <div class="dashboard-container">
      <div class="welcome-section">
        <h1>Bienvenue sur Hypertube</h1>
        <p>Découvrez et regardez les meilleurs films en streaming</p>
      </div>

      <div class="quick-actions">
        <mat-card class="action-card" [routerLink]="['/movies']">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>movie</mat-icon>
              Films Populaires
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Découvrez les films les plus populaires du moment</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="action-card" [routerLink]="['/movies/search']">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>search</mat-icon>
              Recherche
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Trouvez vos films préférés par titre ou genre</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="action-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>history</mat-icon>
              Films Regardés
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Retrouvez vos films déjà visionnés</p>
          </mat-card-content>
        </mat-card>
      </div>

      @if (popularMovies.length > 0) {
        <div class="popular-movies">
          <h2>Films Populaires</h2>
          <div class="movies-grid">
            @for (movie of popularMovies; track movie.id) {
              <mat-card class="movie-card" [routerLink]="['/movies', movie.id]">
                <img mat-card-image [src]="movie.poster" [alt]="movie.title">
                <mat-card-header>
                  <mat-card-title>{{ movie.title }}</mat-card-title>
                  <mat-card-subtitle>{{ movie.year }} • ⭐ {{ movie.imdbRating }}/10</mat-card-subtitle>
                </mat-card-header>
              </mat-card>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }

    .dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 48px;
    }

    .welcome-section h1 {
      font-size: 2.5rem;
      margin-bottom: 16px;
      color: #333;
    }

    .welcome-section p {
      font-size: 1.2rem;
      color: #666;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .action-card {
      cursor: pointer;
      transition: transform 0.2s ease-in-out;
      height: 140px;
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .action-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .popular-movies h2 {
      margin-bottom: 24px;
      color: #333;
    }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }

    .movie-card {
      cursor: pointer;
      transition: transform 0.2s ease-in-out;
    }

    .movie-card:hover {
      transform: scale(1.05);
    }

    .movie-card img {
      height: 300px;
      object-fit: cover;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private movieService = inject(MovieService);

  currentUser: User | null = null;
  popularMovies: Movie[] = [];

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadPopularMovies();
  }

  private loadPopularMovies(): void {
    this.movieService.getPopularMovies(1).subscribe({
      next: (response) => {
        this.popularMovies = response.movies.slice(0, 6); // Afficher seulement 6 films
      },
      error: (error) => {
        console.error('Erreur lors du chargement des films populaires:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
} 