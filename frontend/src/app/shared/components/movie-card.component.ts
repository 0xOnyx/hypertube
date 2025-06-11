import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MovieCardData {
  id: string | number;
  title: string;
  subtitle?: string;
  posterUrl: string;
  year?: number;
  rating?: number | string;
  genres?: string[];
  isBookmarked?: boolean;
}

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-3 pb-3 group cursor-pointer" (click)="onCardClick()">
      <!-- Poster Image -->
      <div 
        class="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg relative overflow-hidden transition-transform group-hover:scale-105"
        [style.background-image]="'url(' + movie.posterUrl + ')'"
      >
        <!-- Overlay on hover -->
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <!-- Play Button -->
            <button 
              (click)="onPlayClick($event)"
              class="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full hover:bg-opacity-30 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256">
                <path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13a15.86,15.86,0,0,0,8.12,13.82,16,16,0,0,0,16.2-.3L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,201.07V54.93L216.16,128Z"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Bookmark button -->
        <button 
          *ngIf="showBookmark"
          (click)="onBookmarkClick($event)"
          class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8 bg-black bg-opacity-50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-70"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" [attr.fill]="movie.isBookmarked ? 'white' : 'none'" stroke="white" viewBox="0 0 256 256">
            <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z"></path>
          </svg>
        </button>

        <!-- Rating badge -->
        <div 
          *ngIf="movie.rating"
          class="absolute bottom-2 left-2 flex items-center gap-1 bg-black bg-opacity-60 backdrop-blur-sm rounded px-2 py-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#FFD700" viewBox="0 0 256 256">
            <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
          </svg>
          <span class="text-white text-xs font-medium">{{movie.rating}}</span>
        </div>
      </div>

      <!-- Movie Info -->
      <div class="space-y-1">
        <p class="text-white text-base font-medium leading-normal line-clamp-2">{{movie.title}}</p>
        <p *ngIf="movie.subtitle" class="text-text-secondary text-sm font-normal leading-normal">{{movie.subtitle}}</p>
        
        <!-- Genres -->
        <div *ngIf="movie.genres && movie.genres.length > 0" class="flex flex-wrap gap-1 mt-2">
          <span 
            *ngFor="let genre of movie.genres.slice(0, 2)" 
            class="text-xs px-2 py-1 bg-card-bg text-text-secondary rounded"
          >
            {{genre}}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class MovieCardComponent {
  @Input() movie!: MovieCardData;
  @Input() showBookmark = true;
  
  @Output() cardClick = new EventEmitter<MovieCardData>();
  @Output() playClick = new EventEmitter<MovieCardData>();
  @Output() bookmarkClick = new EventEmitter<MovieCardData>();

  onCardClick() {
    this.cardClick.emit(this.movie);
  }

  onPlayClick(event: Event) {
    event.stopPropagation();
    this.playClick.emit(this.movie);
  }

  onBookmarkClick(event: Event) {
    event.stopPropagation();
    this.bookmarkClick.emit(this.movie);
  }
} 