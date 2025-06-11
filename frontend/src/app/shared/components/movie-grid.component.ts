import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent, MovieCardData } from './movie-card.component';

@Component({
  selector: 'app-movie-grid',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  template: `
    <div class="p-4">
      <!-- Title Section -->
      <h2 *ngIf="title" class="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        {{title}}
      </h2>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && movies.length === 0" class="text-center py-12">
        <div class="text-text-secondary text-lg mb-2">{{emptyMessage}}</div>
        <div class="text-text-secondary text-sm">{{emptySubMessage}}</div>
      </div>

      <!-- Movies Grid -->
      <div 
        *ngIf="!loading && movies.length > 0"
        class="grid gap-3"
        [class]="gridClasses"
      >
        <app-movie-card
          *ngFor="let movie of movies; trackBy: trackByMovieId"
          [movie]="movie"
          [showBookmark]="showBookmarks"
          (cardClick)="onMovieClick($event)"
          (playClick)="onPlayMovie($event)"
          (bookmarkClick)="onBookmarkMovie($event)"
        ></app-movie-card>
      </div>

      <!-- Load More Button -->
      <div *ngIf="showLoadMore && !loading" class="flex justify-center mt-8">
        <button 
          (click)="onLoadMore()"
          class="px-6 py-3 bg-card-bg hover:bg-opacity-80 text-white rounded-lg transition-colors font-medium"
        >
          Load More
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class MovieGridComponent {
  @Input() title = '';
  @Input() movies: MovieCardData[] = [];
  @Input() loading = false;
  @Input() showBookmarks = true;
  @Input() showLoadMore = false;
  @Input() emptyMessage = 'No movies found';
  @Input() emptySubMessage = 'Try adjusting your search or filters';
  @Input() columns = 'auto'; // 'auto', '2', '3', '4', '5', '6'
  
  @Output() movieClick = new EventEmitter<MovieCardData>();
  @Output() playMovie = new EventEmitter<MovieCardData>();
  @Output() bookmarkMovie = new EventEmitter<MovieCardData>();
  @Output() loadMore = new EventEmitter<void>();

  get gridClasses(): string {
    switch (this.columns) {
      case '2':
        return 'grid-cols-2';
      case '3':
        return 'grid-cols-3';
      case '4':
        return 'grid-cols-4';
      case '5':
        return 'grid-cols-5';
      case '6':
        return 'grid-cols-6';
      case 'auto':
      default:
        return 'grid-cols-[repeat(auto-fit,minmax(158px,1fr))]';
    }
  }

  trackByMovieId(index: number, movie: MovieCardData): any {
    return movie.id;
  }

  onMovieClick(movie: MovieCardData) {
    this.movieClick.emit(movie);
  }

  onPlayMovie(movie: MovieCardData) {
    this.playMovie.emit(movie);
  }

  onBookmarkMovie(movie: MovieCardData) {
    this.bookmarkMovie.emit(movie);
  }

  onLoadMore() {
    this.loadMore.emit();
  }
} 