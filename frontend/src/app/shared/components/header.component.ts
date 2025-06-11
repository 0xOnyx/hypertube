import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-color px-10 py-3 bg-dark-bg">
      <div class="flex items-center gap-8">
        <!-- Logo Section -->
        <div class="flex items-center gap-4 text-white">
          <div class="size-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_6_319)">
                <path
                  d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                  fill="currentColor"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_6_319"><rect width="48" height="48" fill="white"></rect></clipPath>
              </defs>
            </svg>
          </div>
          <h2 class="text-white text-lg font-bold leading-tight tracking-[-0.015em]">{{appName}}</h2>
        </div>

        <!-- Navigation Links -->
        <nav class="flex items-center gap-9">
          <a
            *ngFor="let link of navigationLinks"
            [routerLink]="link.route"
            routerLinkActive="text-white font-medium"
            class="text-text-secondary hover:text-white transition-colors text-sm font-medium leading-normal"
          >
            {{link.label}}
          </a>
        </nav>
      </div>

      <!-- Right Section -->
      <div class="flex flex-1 justify-end gap-8">
        <!-- Search Bar -->
        <div class="flex flex-col min-w-40 !h-10 max-w-64" *ngIf="showSearch">
          <div class="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div class="text-text-secondary flex border-none bg-card-bg items-center justify-center pl-4 rounded-l-lg border-r-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </div>
            <input
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange($event)"
              (keyup.enter)="onSearch()"
              placeholder="Search"
              class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-card-bg focus:border-none h-full placeholder:text-text-secondary px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
            />
          </div>
        </div>

        <!-- Bookmark Button -->
        <button
          *ngIf="showBookmarks"
          (click)="onBookmarkClick()"
          class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-card-bg text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-opacity-80 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z"></path>
          </svg>
        </button>

        <!-- User Avatar -->
        <div
          (click)="onUserClick()"
          class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer hover:ring-2 hover:ring-white hover:ring-opacity-30 transition-all"
          [style.background-image]="'url(' + userAvatar + ')'"
        ></div>
      </div>
    </header>
  `,
  styles: []
})
export class HeaderComponent {
  @Input() appName = 'Hypertube';
  @Input() navigationLinks: Array<{label: string, route: string}> = [
    { label: 'Home', route: '/home' },
    { label: 'Movies', route: '/movies' },
    { label: 'Series', route: '/series' },
    { label: 'My List', route: '/watchlist' }
  ];
  @Input() showSearch = true;
  @Input() showBookmarks = true;
  @Input() userAvatar = 'https://via.placeholder.com/40';

  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() searchSubmit = new EventEmitter<string>();
  @Output() bookmarkClick = new EventEmitter<void>();
  @Output() userClick = new EventEmitter<void>();

  searchQuery = '';

  onSearchChange(query: string) {
    this.searchQuery = query;
    this.searchQueryChange.emit(query);
  }

  onSearch() {
    this.searchSubmit.emit(this.searchQuery);
  }

  onBookmarkClick() {
    this.bookmarkClick.emit();
  }

  onUserClick() {
    this.userClick.emit();
  }
}
