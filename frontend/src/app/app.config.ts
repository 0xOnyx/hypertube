import { ApplicationConfig, provideZoneChangeDetection, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

// Gestionnaire d'erreurs personnalisé pour éviter les erreurs NG0200
class CustomErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Filtrer les erreurs NG0200 liées à l'hydratation qui sont souvent bénignes
    if (error?.code === 'NG0200' || error?.message?.includes('NG0200')) {
      console.warn('Erreur d\'hydratation détectée (NG0200):', error);
      return;
    }
    
    // Logger les autres erreurs normalement
    console.error('Erreur de l\'application:', error);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    { provide: ErrorHandler, useClass: CustomErrorHandler }
  ]
};
