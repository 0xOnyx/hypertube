import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header.component';
import { NavigationService } from '../../../core/services/navigation.service';

@Component({
  selector: 'app-series-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <div class="relative flex size-full min-h-screen flex-col bg-dark-bg overflow-x-hidden font-spline">
      <div class="layout-container flex h-full grow flex-col">
        <!-- Header -->
        <app-header
          appName="Hypertube"
          [navigationLinks]="navigationLinks"
          [userAvatar]="userAvatar"
          (bookmarkClick)="onBookmarkClick()"
          (userClick)="onUserClick()"
        ></app-header>

        <!-- Main Content -->
        <div class="px-40 flex flex-1 justify-center py-5">
          <div class="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div class="text-center py-16">
              <div class="text-6xl mb-4">📺</div>
              <h2 class="text-white text-2xl font-bold mb-2">Séries TV</h2>
              <p class="text-text-secondary text-lg">Cette fonctionnalité sera bientôt disponible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SeriesListComponent {
  private router = inject(Router);
  private navigationService = inject(NavigationService);

  navigationLinks = this.navigationService.getNavigationLinks();
  userAvatar = 'https://via.placeholder.com/40';

  onBookmarkClick(): void {
    this.router.navigate(['/watchlist']);
  }

  onUserClick(): void {
    this.router.navigate(['/profile']);
  }
} 