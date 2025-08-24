import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Shared } from '../../shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.scss'
})
export class Loader {
  isLoading = false;
  message?: string;
  private subscription: Subscription;
  readonly sharedService = inject(Shared);

  constructor() {
    this.subscription = this.sharedService.isLoading$.subscribe((state) => {
      this.isLoading = state.show;
      this.message = state.message;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
