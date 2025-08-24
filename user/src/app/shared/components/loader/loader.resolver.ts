import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { SharedService } from '../../shared.service';

export const loaderResolver: ResolveFn<boolean> = (route, state) => {
  const sharedService = inject(SharedService);
  const message = route.data['loadingMessage'] || 'Loading...';

  // Show loader with custom message from route data
  sharedService.showLoader(message);

  return new Promise((resolve) => {
    // Small delay to ensure loader is visible
    setTimeout(() => {
      sharedService.hideLoader();
      resolve(true);
    }, 1000); // Adjust timeout as needed
  });
};
