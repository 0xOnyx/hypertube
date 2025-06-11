import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MovieDetailData {
  id: string | number;
  title: string;
  year: number;
  plot: string;
  genre: string[];
  imdbRating: number;
  runtime: string;
  director: string;
  actors: string;
  posterUrl: string;
  backdropUrl?: string;
  trailerUrl?: string;
}

@Component({
  selector: 'app-movie-detail-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="@container">
      <div class="@[480px]:px-4 @[480px]:py-3">
        <div
          class="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-dark-bg @[480px]:rounded-lg min-h-80 relative"
          [style.background-image]="'linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 25%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.3) 100%), url(' + (movie.backdropUrl || movie.posterUrl) + ')'"
        >
          <!-- Content overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <!-- Movie Info -->
          <div class="relative z-10 flex p-6 gap-6">
            <!-- Poster -->
            <div class="hidden md:block w-48 h-72 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                [src]="movie.posterUrl" 
                [alt]="movie.title"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Details -->
            <div class="flex-1 space-y-4">
              <div>
                <h1 class="text-white tracking-light text-[28px] md:text-[36px] font-bold leading-tight">
                  {{movie.title}}
                </h1>
                <div class="flex items-center gap-4 mt-2 text-text-secondary">
                  <span>{{movie.year}}</span>
                  <span>•</span>
                  <span>{{movie.runtime}}</span>
                  <span>•</span>
                  <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFD700" viewBox="0 0 256 256">
                      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                    </svg>
                    <span class="text-white">{{movie.imdbRating}}/10</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 flex-wrap">
                <button 
                  (click)="onPlayClick()"
                  class="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13a15.86,15.86,0,0,0,8.12,13.82,16,16,0,0,0,16.2-.3L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,201.07V54.93L216.16,128Z"></path>
                  </svg>
                  Play
                </button>

                <button 
                  (click)="onWatchlistClick()"
                  class="flex items-center gap-2 px-6 py-3 bg-card-bg text-white rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" [attr.fill]="isBookmarked ? 'currentColor' : 'none'" [attr.stroke]="isBookmarked ? 'none' : 'currentColor'" viewBox="0 0 256 256">
                    <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z"></path>
                  </svg>
                  {{isBookmarked ? 'Remove from List' : 'Add to List'}}
                </button>

                <button 
                  *ngIf="movie.trailerUrl"
                  (click)="onTrailerClick()"
                  class="flex items-center gap-2 px-6 py-3 bg-transparent border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13a15.86,15.86,0,0,0,8.12,13.82,16,16,0,0,0,16.2-.3L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,201.07V54.93L216.16,128Z"></path>
                  </svg>
                  Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Movie Description -->
    <div class="px-4 py-3">
      <p class="text-white text-base font-normal leading-normal pb-3 pt-1">
        {{movie.plot}}
      </p>

      <!-- Genres -->
      <div class="flex gap-3 flex-wrap mb-4">
        <div 
          *ngFor="let genre of movie.genre" 
          class="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-card-bg pl-4 pr-4"
        >
          <p class="text-white text-sm font-medium leading-normal">{{genre}}</p>
        </div>
      </div>

      <!-- Credits -->
      <div class="space-y-2 text-sm">
        <div class="flex">
          <span class="text-text-secondary w-20">Director:</span>
          <span class="text-white">{{movie.director}}</span>
        </div>
        <div class="flex">
          <span class="text-text-secondary w-20">Cast:</span>
          <span class="text-white">{{movie.actors}}</span>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MovieDetailHeroComponent {
  @Input() movie!: MovieDetailData;
  @Input() isBookmarked = false;

  @Output() playClick = new EventEmitter<void>();
  @Output() watchlistClick = new EventEmitter<void>();
  @Output() trailerClick = new EventEmitter<void>();

  onPlayClick() {
    this.playClick.emit();
  }

  onWatchlistClick() {
    this.watchlistClick.emit();
  }

  onTrailerClick() {
    this.trailerClick.emit();
  }
} 