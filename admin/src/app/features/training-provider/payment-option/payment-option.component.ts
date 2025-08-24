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
import { FeaturesService } from '../../features.service';

import { ConfirmMessageComponent } from '../../../shared/components/confirm-message/confirm-message.component';

// Validators
import { disallowCharacters, allowOnlyNumeric, cellphoneNumberValidator, emailValidator } from '../../../shared/utils/validators';
import { ViewComponent } from '../view/view.component';

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
  paymentOptID: number;
  payee: string;
  accountNo: string;
  ddPaymentOpt: string;
  bankName: string;
  TIN: string;
  status: string;
}

@Component({
  selector: 'app-payment-option',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, FormsModule, ReactiveFormsModule, CommonModule, MatSelectModule
  ],
  templateUrl: './payment-option.component.html',
  styleUrl: './payment-option.component.scss'
})
export class PaymentOptionComponent {

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

  constructor(private dialogRef: MatDialogRef<PaymentOptionComponent>,
    private fb: FormBuilder,
    private service: FeaturesService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: TrainingProvider | null) {

    this.paymentOptionsForm = this.fb.group({
      provID: [''],
      accountNo: ['', [Validators.required, allowOnlyNumeric(), disallowCharacters()]],
      payee: ['', [Validators.required, disallowCharacters()]],
      ddPaymentOpt: ['', [Validators.required]],
      bankName: ['', [Validators.required, disallowCharacters()]],
      TIN: ['', [Validators.required, allowOnlyNumeric(), disallowCharacters()]]
    })
    console.log('provID', this.data?.provID)
    if (this.data?.provID) {
      this.paymentOptionsForm.patchValue({ provID: String(this.data.provID) });
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

    this.service.createPaymentOptions(formData, token).subscribe({
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
      data: { message: 'Confirm: Are you sure you want to add this payment option?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.submitProvider(); // Only submit if confirmed
      }
    });
  }

}
