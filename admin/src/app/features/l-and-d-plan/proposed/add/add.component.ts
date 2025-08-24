import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';

// Competency
import { ConfirmMessageComponent } from '../../../../shared/components/confirm-message/confirm-message.component';

// Service
import { FeaturesService } from '../../../features.service';
@Component({
  selector: 'app-add',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, MatSelectModule, ReactiveFormsModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {

  proposedAldpYearFormGroup : FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddComponent>,
    private fb: FormBuilder,
    private service: FeaturesService,
    private dialog: MatDialog) {
      this.proposedAldpYearFormGroup = this.fb.group({
        aldp_year: ['', Validators.required],
      })
  }

  private submitProposedYear(): void {
    const formData = this.proposedAldpYearFormGroup.value;
    const token = sessionStorage.getItem('token') ?? '';

    if (!token) {
      alert("Authentication token not found.");
      return;
    }

    this.service.createALDPYear(formData, token).subscribe({
      next: (res) => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Failed to create proposed year', err);
        alert('Error creating wishlist.');
      }
    });
  }

  onSubmit(): void {
    if (this.proposedAldpYearFormGroup.invalid) return;

    const dialogRef = this.dialog.open(ConfirmMessageComponent, {
      width: '400px',
      data: { message: 'Confirm: Are you sure you want to add this proposed year?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.submitProposedYear(); // Only submit if confirmed
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
