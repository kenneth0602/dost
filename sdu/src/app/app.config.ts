import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes as appRoutes } from './app.routes';
import { routes as authRoutes } from './features/auth/auth.routes';
import { routes as pageRoutes } from './features/page/page.routes';
import { provideClientHydration, withEventReplay, withIncrementalHydration  } from '@angular/platform-browser';
import { provideNativeDateAdapter, MatNativeDateModule } from '@angular/material/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const routes = [
  ...appRoutes,
  ...authRoutes,
  ...pageRoutes
]

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideNativeDateAdapter(),
    provideClientHydration(withIncrementalHydration()),
    provideAnimationsAsync(),]
};
