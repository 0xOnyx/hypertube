import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterOption {
  value: string;
  label: string;
}

export interface SearchFilters {
  genre?: string;
  releaseYear?: string;
  popularity?: string;
  rating?: string;
  language?: string;
}

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex gap-3 p-3 flex-wrap pr-4">
      <!-- Search Bar avec Clear -->
      <div *ngIf="showSearchBar" class="flex flex-col min-w-40 h-12 w-full max-w-md">
        <div class="flex w-full flex-1 items-stretch rounded-lg h-full">
          <div class="text-text-secondary flex border-none bg-card-bg items-center justify-center pl-4 rounded-l-lg border-r-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
            </svg>
          </div>
          <input
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-card-bg focus:border-none h-full placeholder:text-text-secondary px-4 rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
            [value]="searchQuery"
            [placeholder]="searchPlaceholder"
          />
          <div *ngIf="searchQuery" class="flex items-center justify-center rounded-r-lg border-l-0 border-none bg-card-bg pr-2 pr-4">
            <button
              (click)="clearSearch()"
              class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-transparent text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] h-auto min-w-0 px-0 hover:text-text-secondary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Filter Dropdowns -->
      <div class="flex gap-3 flex-wrap">
        <!-- Genre Filter -->
        <div class="relative" *ngIf="genreOptions.length > 0">
          <button 
            (click)="toggleDropdown('genre')"
            class="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-card-bg pl-4 pr-2 hover:bg-opacity-80 transition-colors"
          >
            <p class="text-white text-sm font-medium leading-normal">
              {{filters.genre ? getOptionLabel(genreOptions, filters.genre) : 'Genre'}}
            </p>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20px" 
              height="20px" 
              fill="currentColor" 
              viewBox="0 0 256 256"
              class="text-white transition-transform"
              [class.rotate-180]="dropdownOpen === 'genre'"
            >
              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
          </button>
          
          <div 
            *ngIf="dropdownOpen === 'genre'" 
            class="absolute top-full left-0 mt-1 bg-card-bg border border-border-color rounded-lg shadow-lg z-10 min-w-full"
          >
            <button 
              *ngFor="let option of genreOptions"
              (click)="selectFilter('genre', option.value)"
              class="block w-full text-left px-4 py-2 text-white hover:bg-accent text-sm whitespace-nowrap"
            >
              {{option.label}}
            </button>
            <button 
              (click)="selectFilter('genre', '')"
              class="block w-full text-left px-4 py-2 text-text-secondary hover:bg-accent text-sm border-t border-border-color"
            >
              Clear
            </button>
          </div>
        </div>

        <!-- Release Year Filter -->
        <div class="relative" *ngIf="yearOptions.length > 0">
          <button 
            (click)="toggleDropdown('year')"
            class="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-card-bg pl-4 pr-2 hover:bg-opacity-80 transition-colors"
          >
            <p class="text-white text-sm font-medium leading-normal">
              {{filters.releaseYear ? getOptionLabel(yearOptions, filters.releaseYear) : 'Release Year'}}
            </p>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20px" 
              height="20px" 
              fill="currentColor" 
              viewBox="0 0 256 256"
              class="text-white transition-transform"
              [class.rotate-180]="dropdownOpen === 'year'"
            >
              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
          </button>
          
          <div 
            *ngIf="dropdownOpen === 'year'" 
            class="absolute top-full left-0 mt-1 bg-card-bg border border-border-color rounded-lg shadow-lg z-10 min-w-full"
          >
            <button 
              *ngFor="let option of yearOptions"
              (click)="selectFilter('releaseYear', option.value)"
              class="block w-full text-left px-4 py-2 text-white hover:bg-accent text-sm whitespace-nowrap"
            >
              {{option.label}}
            </button>
            <button 
              (click)="selectFilter('releaseYear', '')"
              class="block w-full text-left px-4 py-2 text-text-secondary hover:bg-accent text-sm border-t border-border-color"
            >
              Clear
            </button>
          </div>
        </div>

        <!-- Other filters... -->
        <div class="relative" *ngFor="let filterType of additionalFilters">
          <button 
            (click)="toggleDropdown(filterType.key)"
            class="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-card-bg pl-4 pr-2 hover:bg-opacity-80 transition-colors"
          >
            <p class="text-white text-sm font-medium leading-normal">
              {{getSelectedFilterLabel(filterType) || filterType.label}}
            </p>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20px" 
              height="20px" 
              fill="currentColor" 
              viewBox="0 0 256 256"
              class="text-white transition-transform"
              [class.rotate-180]="dropdownOpen === filterType.key"
            >
              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
          </button>
          
          <div 
            *ngIf="dropdownOpen === filterType.key" 
            class="absolute top-full left-0 mt-1 bg-card-bg border border-border-color rounded-lg shadow-lg z-10 min-w-full"
          >
            <button 
              *ngFor="let option of filterType.options"
              (click)="selectFilter(filterType.key, option.value)"
              class="block w-full text-left px-4 py-2 text-white hover:bg-accent text-sm whitespace-nowrap"
            >
              {{option.label}}
            </button>
            <button 
              (click)="selectFilter(filterType.key, '')"
              class="block w-full text-left px-4 py-2 text-text-secondary hover:bg-accent text-sm border-t border-border-color"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SearchFiltersComponent {
  @Input() showSearchBar = true;
  @Input() searchPlaceholder = 'Search movies...';
  @Input() genreOptions: FilterOption[] = [];
  @Input() yearOptions: FilterOption[] = [];
  @Input() additionalFilters: Array<{key: string, label: string, options: FilterOption[]}> = [];
  
  @Output() filtersChange = new EventEmitter<SearchFilters>();
  @Output() searchChange = new EventEmitter<string>();

  searchQuery = '';
  filters: SearchFilters = {};
  dropdownOpen: string | null = null;

  onSearchChange(query: string) {
    this.searchQuery = query;
    this.searchChange.emit(query);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchChange.emit('');
  }

  toggleDropdown(type: string) {
    this.dropdownOpen = this.dropdownOpen === type ? null : type;
  }

  selectFilter(filterType: string, value: string) {
    this.filters = { ...this.filters, [filterType]: value || undefined };
    this.dropdownOpen = null;
    this.filtersChange.emit(this.filters);
  }

  getOptionLabel(options: FilterOption[], value: string): string {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  getSelectedFilterLabel(filterType: any): string | undefined {
    const selectedValue = (this.filters as any)[filterType.key];
    if (!selectedValue) return undefined;
    return this.getOptionLabel(filterType.options, selectedValue);
  }
} 