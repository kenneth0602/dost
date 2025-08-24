import { Component, Inject } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

// Service
import { FeaturesService } from '../../../features.service';

import { ConfirmMessageComponent } from '../../../../shared/components/confirm-message/confirm-message.component';

// Validators
import { disallowCharacters, allowOnlyNumeric, cellphoneNumberValidator, emailValidator } from '../../../../shared/utils/validators';

interface PaymentOption {
  value: string
}

interface TrainingProvider {
  provID: string;
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
  provID: string,
  paymentOptID: number;
  payee: string;
  accountNo: string;
  ddPaymentOpt: string;
  bankName: string;
  TIN: string;
  status: string;
}

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, FormsModule, ReactiveFormsModule, CommonModule, MatSelectModule
  ],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {

  paymentOptionsForm: FormGroup;

  payment_option: PaymentOption[] = [
    {
      value: 'Bank'
    },
    {
      value: 'E-wallet'
    },
    {
      value: 'Cash'
    }
  ]

constructor(
  private dialogRef: MatDialogRef<ViewComponent>,
  private fb: FormBuilder,
  private service: FeaturesService,
  private dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: Payment | null
) {
  this.paymentOptionsForm = this.fb.group({
    provID: [''], // optional
    accountNo: ['', [Validators.required, allowOnlyNumeric(), disallowCharacters()]],
    payee: ['', [Validators.required, disallowCharacters()]],
    ddPaymentOpt: ['', [Validators.required]],
    bankName: ['', [Validators.required, disallowCharacters()]],
    TIN: ['', [Validators.required, allowOnlyNumeric(), disallowCharacters()]]
  });

  // Pre-fill form if existing payment is passed
  if (this.data) {
    this.paymentOptionsForm.patchValue({
      provID: String(this.data.provID),
      accountNo: this.data.accountNo,
      payee: this.data.payee,
      ddPaymentOpt: this.data.ddPaymentOpt,
      bankName: this.data.bankName,
      TIN: this.data.TIN
    });
  }
}

  onClose(): void {
    this.dialogRef.close();
  }

  private submitProvider(): void {
    const formData = this.paymentOptionsForm.value;
    const token = sessionStorage.getItem('token') ?? '';

    if (!token) {
      alert("Authentication token not found.");
      return;
    }

    if (!this.data) {
      console.error('No data passed to ViewComponent.');
      return;
    }

    const id = this.data.paymentOptID;

    this.service.updatePaymentOptions(id, formData, token).subscribe({
      next: (res) => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Failed to payment option', err);
        alert('Error creating payment option.');
      }
    });
  }
  
  onSubmit(): void {
    if (this.paymentOptionsForm.invalid) return;

    const dialogRef = this.dialog.open(ConfirmMessageComponent, {
      width: '400px',
      data: { message: 'Confirm: Are you sure you want to update this payment option?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.submitProvider(); // Only submit if confirmed
      }
    });
  }

}
