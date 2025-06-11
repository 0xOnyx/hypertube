import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { MovieService } from '../../../core/services/movie.service';
import { MovieDetails, Torrent } from '../../../core/models/movie.model';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule
  ],
  template: `
    <div class="movie-detail-container">
      @if (isLoading) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (movie) {
        <div class="movie-header">
          <div class="poster-section">
            <img [src]="movie.posterUrl" [alt]="movie.title" class="movie-poster">
          </div>
          
          <div class="info-section">
            <h1>{{ movie.title }}</h1>
            <div class="movie-meta">
              <span class="year">{{ movie.year }}</span>
              <span class="rating">⭐ {{ movie.rating }}/10</span>
              <span class="runtime">{{ movie.runtime }} min</span>
            </div>
            
            <div class="genres">
              @for (genre of movie.genres; track genre) {
                <mat-chip>{{ genre }}</mat-chip>
              }
            </div>
            
            <p class="plot">{{ movie.synopsis }}</p>
            
            <div class="movie-details">
              <div class="detail-item">
                <strong>Réalisateur(s):</strong> {{ movie.directors?.join(', ') }}
              </div>
              <div class="detail-item">
                <strong>Acteurs:</strong> {{ movie.actors?.join(', ') }}
              </div>
              @if (movie.status) {
                <div class="detail-item">
                  <strong>Statut:</strong> {{ movie.status }}
                </div>
              }
            </div>

            @if (movie.torrents && movie.torrents.length > 0) {
              <div class="torrents-section">
                <h3>Qualités disponibles:</h3>
                <div class="torrent-list">
                  @for (torrent of movie.torrents; track torrent.id) {
                    <mat-chip 
                      [class]="'torrent-chip quality-' + torrent.quality"
                      (click)="selectTorrent(torrent)">
                      {{ torrent.quality }} 
                      <span class="seeders">({{ torrent.seeders }} seeders)</span>
                    </mat-chip>
                  }
                </div>
              </div>
            }
            
            <div class="actions">
              <button mat-raised-button color="primary" (click)="watchMovie()">
                <mat-icon>play_arrow</mat-icon>
                Regarder
              </button>
              <button mat-stroked-button (click)="addToWatchlist()">
                <mat-icon>bookmark_add</mat-icon>
                Ajouter à ma liste
              </button>
            </div>
          </div>
        </div>

        @if (streamingUrl) {
          <mat-card class="video-player">
            <mat-card-header>
              <mat-card-title>Lecture en cours</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <video controls width="100%" height="400">
                <source [src]="streamingUrl" type="video/mp4">
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            </mat-card-content>
          </mat-card>
        }

        <mat-divider></mat-divider>

        <div class="comments-section">
          <h2>Commentaires</h2>
          @if (movie.comments && movie.comments.length > 0) {
            @for (comment of movie.comments; track comment.id) {
              <mat-card class="comment-card">
                <mat-card-header>
                  <div mat-card-avatar class="user-avatar">
                    @if (comment.user?.profilePicture) {
                      <img [src]="comment.user?.profilePicture" [alt]="comment.user?.username">
                    } @else {
                      <mat-icon>person</mat-icon>
                    }
                  </div>
                  <mat-card-title>{{ comment.user?.username || 'Utilisateur #' + comment.userId }}</mat-card-title>
                  <mat-card-subtitle>{{ comment.createdAt | date:'short' }}</mat-card-subtitle>
                  @if (comment.rating) {
                    <div class="comment-rating">⭐ {{ comment.rating }}/5</div>
                  }
                </mat-card-header>
                <mat-card-content>
                  <p>{{ comment.content }}</p>
                </mat-card-content>
              </mat-card>
            }
          } @else {
            <p class="no-comments">Aucun commentaire pour ce film.</p>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .movie-detail-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    .movie-header {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 32px;
      margin-bottom: 32px;
    }

    .movie-poster {
      width: 100%;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .info-section h1 {
      margin-bottom: 16px;
      color: #333;
    }

    .movie-meta {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      font-size: 1.1rem;
    }

    .year, .rating, .runtime {
      padding: 4px 8px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .genres {
      margin-bottom: 24px;
    }

    .plot {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 24px;
      color: #555;
    }

    .movie-details {
      margin-bottom: 24px;
    }

    .detail-item {
      margin-bottom: 8px;
      color: #666;
    }

    .torrents-section {
      margin-bottom: 24px;
    }

    .torrents-section h3 {
      margin-bottom: 12px;
      color: #333;
    }

    .torrent-list {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .torrent-chip {
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .torrent-chip:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .torrent-chip.quality-720p {
      background-color: #4caf50;
      color: white;
    }

    .torrent-chip.quality-1080p {
      background-color: #2196f3;
      color: white;
    }

    .torrent-chip.quality-2160p {
      background-color: #9c27b0;
      color: white;
    }

    .seeders {
      font-size: 0.8em;
      opacity: 0.8;
    }

    .actions {
      display: flex;
      gap: 16px;
    }

    .video-player {
      margin-bottom: 32px;
    }

    .comments-section h2 {
      margin-bottom: 24px;
      color: #333;
    }

    .comment-card {
      margin-bottom: 16px;
    }

    .comment-rating {
      font-size: 0.9em;
      color: #ff9800;
      margin-top: 4px;
    }

    .user-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #e0e0e0;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .no-comments {
      color: #666;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .movie-header {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      
      .poster-section {
        text-align: center;
      }
      
      .movie-poster {
        max-width: 300px;
      }

      .torrent-list {
        justify-content: center;
      }
    }
  `]
})
export class MovieDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);

  movie: MovieDetails | null = null;
  isLoading = false;
  streamingUrl: string | null = null;
  selectedTorrent: Torrent | null = null;

  ngOnInit(): void {
    const movieId = Number(this.route.snapshot.paramMap.get('id'));
    if (movieId) {
      this.loadMovieDetails(movieId);
    }
  }

  private loadMovieDetails(id: number): void {
    this.isLoading = true;
    this.movieService.getMovieDetails(id).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du film:', error);
        this.isLoading = false;
      }
    });
  }

  selectTorrent(torrent: Torrent): void {
    this.selectedTorrent = torrent;
    console.log('Torrent sélectionné:', torrent);
  }

  watchMovie(): void {
    if (this.movie) {
      // Note: Le backend ne supporte pas encore la sélection de torrent spécifique
      // TODO: Étendre l'API pour supporter torrentId
      this.movieService.getStreamingUrl(this.movie.id).subscribe({
        next: (response) => {
          this.streamingUrl = response.url;
          this.movieService.watchMovie(this.movie!.id).subscribe();
        },
        error: (error) => {
          console.error('Erreur lors de la récupération du lien de streaming:', error);
        }
      });
    }
  }

  addToWatchlist(): void {
    // Implémentation pour ajouter à la liste de lecture
    console.log('Ajout à la liste de lecture');
  }
} 