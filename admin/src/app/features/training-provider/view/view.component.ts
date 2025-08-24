import { Component, Inject } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

// Service
import { FeaturesService } from '../../features.service';

// Component
import { ConfirmMessageComponent } from '../../../shared/components/confirm-message/confirm-message.component';

interface TrainingProvider {
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

@Component({
  selector: 'app-view-training-provider',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, FormsModule, ReactiveFormsModule
  ],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent {

  trainingProviderForm: FormGroup;
  isDisabled = true;

  constructor(
    private dialogRef: MatDialogRef<ViewComponent>,
    private fb: FormBuilder,
    private service: FeaturesService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: TrainingProvider | null
  ) { 
    this.trainingProviderForm = this.fb.group({
      providerName: ['', Validators.required],
      website: ['', Validators.required],
      address: ['', Validators.required],
      pointofContact: ['', Validators.required],
      telNo: ['', Validators.required],
      mobileNo: ['', Validators.required],
      emailAdd: ['', [Validators.required, Validators.email]]
    });

    this.trainingProviderForm.disable();

    if (data) {
      this.trainingProviderForm.patchValue(data);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  private submitProvider(): void {
    const formData = this.trainingProviderForm.value;
    const token = sessionStorage.getItem('token');

    if (!token) {
      return;
    }

    if (!this.data) {
      console.error('No data passed to ViewComponent.');
      return;
    }
    
    const id = this.data.provID;

    this.service.updateTrainingProvider(id, formData, token).subscribe({
      next: (res) => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Failed to create provider', err);
      }
    });
  }

  onSubmit(): void {
    if (this.trainingProviderForm.invalid) return;

    const dialogRef = this.dialog.open(ConfirmMessageComponent, {
      width: '400px',
      data: { message: 'Confirm: Are you sure you want to update the details of this training provider?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.submitProvider(); // Only submit if confirmed
      }
    });
  }

  toggleEdit(): void {
    this.isDisabled = !this.isDisabled;

    if (this.isDisabled) {
      this.trainingProviderForm.disable();
    } else {
      this.trainingProviderForm.enable();
    }
  }

  activateProvider(): void {
    const dialogRef = this.dialog.open(ConfirmMessageComponent, {
      width: '400px',
      data: { message: 'Are you sure you want to activate this training provider?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const token = sessionStorage.getItem('token');
        if (!token) {
          return;
        }

        if (!this.data) {
          console.error("No provider data found.");
          return;
        }

        this.service.activateTrainingProvider(this.data.provID, token).subscribe({
          next: () => {
            if (this.data) {
              this.data.status = 'Active';
            }
            this.dialogRef.close(true);
          },
          error: (err) => {
            console.error('Activation failed', err);
          }
        });
      }
    });
  }


deactivateProvider(): void {
  const dialogRef = this.dialog.open(ConfirmMessageComponent, {
    width: '400px',
    data: { message: 'Are you sure you want to deactivate this training provider?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      const token = sessionStorage.getItem('token');
      if (!token) {
        return;
      }

      if (!this.data) {
        console.error("No provider data found.");
        return;
      }

      this.service.deactivateTrainingProvider(this.data.provID, token).subscribe({
        next: () => {
          if (this.data) {
          this.data.status = 'Inactive';
          }
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Deactivation failed', err);
        }
      });
    }
  });
}

}
