import { Component } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

// Service
import { FeaturesService } from '../../features.service';

// Component
import { ConfirmMessageComponent } from '../../../shared/components/confirm-message/confirm-message.component';

// Validators
import { disallowCharacters, allowOnlyNumeric, cellphoneNumberValidator, emailValidator } from '../../../shared/utils/validators';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, FormsModule, ReactiveFormsModule, CommonModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {

  trainingProviderForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<AddComponent>,
    private fb: FormBuilder,
    private service: FeaturesService,
    private dialog: MatDialog) {

    this.trainingProviderForm = this.fb.group({
      providerName: ['', [Validators.required, disallowCharacters()]],
      website: ['', [Validators.required, disallowCharacters()]],
      address: ['', [Validators.required, disallowCharacters()]],
      pointofContact: ['', [Validators.required, disallowCharacters()]],
      telNo: ['', [Validators.required, allowOnlyNumeric()]],
      mobileNo: ['', [Validators.required, cellphoneNumberValidator()]],
      emailAdd: ['', [Validators.required, emailValidator()]]
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  private submitProvider(): void {
    const formData = this.trainingProviderForm.value;
    const token = sessionStorage.getItem('token') ?? '';

    if (!token) {
      alert("Authentication token not found.");
      return;
    }

    this.service.createTrainingProvider(formData, token).subscribe({
      next: (res) => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Failed to create provider', err);
        alert('Error creating training provider.');
      }
    });
  }

  onSubmit(): void {
    if (this.trainingProviderForm.invalid) return;

    const dialogRef = this.dialog.open(ConfirmMessageComponent, {
      width: '400px',
      data: { message: 'Confirm: Are you sure you want to add this training provider?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.submitProvider(); // Only submit if confirmed
      }
    });
  }


}
