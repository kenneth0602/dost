import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { SuccessMessageComponent } from './components/success-message/success-message.component';

interface LoaderState {
  show: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private readonly dialog = inject(MatDialog);
  private isLoadingSubject = new BehaviorSubject<LoaderState>({ show: false });
  isLoading$: Observable<LoaderState> = this.isLoadingSubject.asObservable();

  constructor() { }

public handleError(error: any) {
  let message = 'An unexpected error occurred.';

  // Attempt to extract a meaningful message
  if (typeof error === 'string') {
    message = error;
  } else if (error?.error?.message) {
    message = error.error.message;
  } else if (error?.message) {
    message = error.message;
  } else if (error?.status) {
    message = `HTTP ${error.status}: ${error.statusText || 'Unknown error'}`;
  }

  console.error('Error captured:', error);

  return this.dialog
    .open(ErrorMessageComponent, {
      data: { message },
    })
    .afterClosed();
}


  public handleSuccess(message: string) {
    return this.dialog
      .open(SuccessMessageComponent, {
        data: { message: String(message) },
      })
      .afterClosed();
  }

  showLoader(message?: string): void {
    this.isLoadingSubject.next({ show: true, message });
  }

  hideLoader(): void {
    this.isLoadingSubject.next({ show: false });
  }
}
