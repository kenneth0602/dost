import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

// Service
import { FeaturesService } from '../../features.service';

// Component
import { ViewComponent as ViewDetails } from '../view/view.component';
import { ViewComponent as ViewPaymentOption } from '../payment-option/view/view.component';
import { PaymentOptionComponent } from '../payment-option/payment-option.component';
import { ConfirmMessageComponent } from '../../../shared/components/confirm-message/confirm-message.component';

export interface trainingProvider {
  provID: number;
  providerName: string;
  pointofContact: string;
  address: string;
  website: string;
  telNo: string;
  mobileNo: string;
  emailAdd: string;
  status: string;
}

interface Payment {
  paymentOptID: number;
  payee: string;
  accountNo: string;
  ddPaymentOpt: string;
  bankName: string;
  TIN: string;
  status: string;
}

interface trainingProgram {
  programsOffered: string,
  trainingSchedule: string,
  trainingFee: string
}

@Component({
  selector: 'app-details',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, MatDividerModule,
    MatTabsModule, MatTableModule, CommonModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {

  training_provider_id: number = 0;
  training_provider_data?: trainingProvider;
  payments_data: Payment[] = [];
  inactive_payments_data: Payment[] = [];

  dataSource: trainingProgram[] = [];

  displayedColumns: string[] = ['programsOffered', 'trainingSchedule', 'trainingFee']

  constructor(private route: ActivatedRoute, private service: FeaturesService, private dialog: MatDialog, private router: Router) {

  }

  ngOnInit(): void {
    const isBrowser = typeof window !== 'undefined';

    const idFromQuery = this.route.snapshot.queryParams['id'];
    let idFromSession: string | null = null;

    if (isBrowser) {
      idFromSession = sessionStorage.getItem('selectedProviderId');
    }

    if (idFromQuery) {
      this.training_provider_id = +idFromQuery;
    } else if (idFromSession) {
      this.training_provider_id = +idFromSession;
    }

    if (!this.training_provider_id || isNaN(this.training_provider_id)) {
      console.error('Training provider ID not found in query params or sessionStorage');
      // Optional: Redirect back to the list page
      return;
    }

    this.getTrainingProviderById(this.training_provider_id);
    this.getPaymentById(this.training_provider_id);
    this.getInactivePaymentById(this.training_provider_id);
  }

  getTrainingProviderById(id: number): void {
    const jwt = sessionStorage.getItem('token');
    if (!jwt) {
      console.error('JWT token is missing');
      return;
    }

    this.service.viewTrainingProviderDetails(jwt, id).subscribe({
      next: (res: any) => {
        const provider = res?.[0]?.[0];
        if (provider) {
          this.training_provider_data = provider;

          // Save to sessionStorage for fallback usage (e.g. ViewComponent without MAT_DIALOG_DATA)
          sessionStorage.setItem('selectedProviderId', provider.provID.toString());
        } else {
          console.error('Training provider data not found in response:', res);
        }
      },
      error: (error) => {
        console.error('Error fetching training provider details:', error);
      }
    });
  }


  getPaymentById(id: number): void {
    const jwt = sessionStorage.getItem('token');
    if (!jwt) {
      console.error('JWT token is missing');
      return;
    }

    this.service.getPaymentById(jwt, id).subscribe({
      next: (res: any) => {
        const payments = res?.[0];
        if (Array.isArray(payments)) {
          this.payments_data = payments;
        } else {
          console.error('No valid payment data found:', res);
        }
      },
      error: (error) => {
        console.error('Error fetching payment details:', error);
      }
    });
  }

  getInactivePaymentById(id: number): void {
    const jwt = sessionStorage.getItem('token');
    if (!jwt) {
      console.error('JWT token is missing');
      return;
    }

    this.service.getInactivePaymentById(jwt, id).subscribe({
      next: (res: any) => {
        const inactivePayments = res?.results?.[0];
        if (Array.isArray(inactivePayments)) {
          this.inactive_payments_data = inactivePayments;
        } else {
          console.error('Inactive payment data not found in response:', res);
        }
      },
      error: (error) => {
        console.error('Error fetching inactive payment details:', error);
      }
    });
  }

  activatePayment(id: number): void {
    const dialogRef = this.dialog.open(ConfirmMessageComponent, {
      width: '400px',
      data: { message: 'Are you sure you want to enable this payment option?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {

        this.service.activatePaymentById(id).subscribe({
          next: (res: any) => {
            console.log('Payment option activated:', res);
            // Refresh lists
            this.getPaymentById(this.training_provider_id);
            this.getInactivePaymentById(this.training_provider_id);
          },
          error: (error) => {
            console.error('Error activating payment option:', error);
            alert('Failed to activate payment option.');
          }
        });
      }
    });
  }

  deactivatePayment(id: number): void {
    const dialogRef = this.dialog.open(ConfirmMessageComponent, {
      width: '400px',
      data: { message: 'Are you sure you want to disable this payment option?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const jwt = sessionStorage.getItem('token');
        if (!jwt) {
          console.error('JWT token is missing');
          return;
        }
        this.service.deactivatePaymentById(jwt, id).subscribe({
          next: (res: any) => {
            console.log('Payment option deactivated:', res);
            // Refresh lists
            this.getPaymentById(this.training_provider_id);
            this.getInactivePaymentById(this.training_provider_id);
          },
          error: (error) => {
            console.error('Error activating payment option:', error);
            alert('Failed to activate payment option.');
          }
        });
      }
    });
  }


  view(): void {
    console.log('data', this.training_provider_data);
    console.log('edit clicked')
    if (!this.training_provider_data) return;

    this.dialog.open(ViewDetails, {
      data: this.training_provider_data,
      maxWidth: '100%',
      width: '60%',
      height: '70%',
      disableClose: true
    }).afterClosed().subscribe(() => {
      this.getTrainingProviderById(this.training_provider_id);
      this.getPaymentById(this.training_provider_id);
      this.getInactivePaymentById(this.training_provider_id);
    });
  }

  viewPaymentOption(row: Payment) {
    console.log('Opening dialog for payment:', row);
    this.dialog.open(ViewPaymentOption, {
      data: row,
      maxWidth: '100%',
      width: '60%',
      height: '70%',
      disableClose: true
    }).afterClosed().subscribe(
      data => {
        this.getTrainingProviderById(this.training_provider_id);
        this.getPaymentById(this.training_provider_id);
        this.getInactivePaymentById(this.training_provider_id);
      }
    );
  }

  addPaymentOption(): void {
    console.log('provID', this.training_provider_id)
    this.dialog.open(PaymentOptionComponent, {
      data: { provID: this.training_provider_id },
      maxWidth: '100%',
      width: '60%',
      height: '70%',
      disableClose: true
    }).afterClosed().subscribe(() => {
      this.getTrainingProviderById(this.training_provider_id);
    });
  }
}
