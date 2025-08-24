import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes as appRoutes } from './app.routes';
import { routes as authRoutes } from './features/auth/auth.routes';
import { routes as featuresRoutes } from './features/features.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideNativeDateAdapter, MatNativeDateModule } from '@angular/material/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const routes = [...appRoutes, ...authRoutes, ...featuresRoutes];

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
              provideRouter(routes), 
              provideClientHydration(withEventReplay()),
              provideHttpClient(withFetch()),
              provideNativeDateAdapter(),
              provideAnimationsAsync(),]
};
