import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

// Service
import { FeaturesService } from '../../../features.service';

// Component
import { ConfirmMessageComponent } from '../../../../shared/components/confirm-message/confirm-message.component';

// Validators
import { disallowCharacters, allowOnlyNumeric, cellphoneNumberValidator, emailValidator } from '../../../../shared/utils/validators';

interface trainingProvider {
  provID: number,
  providerName: string
}

interface trainingProgram {
  pprogID: number,
  programName: string,
  Description: string,
  status: string
}

@Component({
  selector: 'app-add-training-provider',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, MatSelectModule, ReactiveFormsModule
  ],
  templateUrl: './add-training-provider.component.html',
  styleUrl: './add-training-provider.component.scss'
})
export class AddTrainingProviderComponent {

  trainingProgramFormGroup: FormGroup;
  dataSource: trainingProvider[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddTrainingProviderComponent>,
    private dialog: MatDialog,
    private service: FeaturesService,
    @Inject(MAT_DIALOG_DATA) public data: trainingProgram | null,
    private fb: FormBuilder,) {
      console.log('Received dialog data:', data);
      this.trainingProgramFormGroup = this.fb.group({
        cost: ['', Validators.required],
        provID: ['', Validators.required]
      })
  }
                                  
  ngOnInit(): void {
    this.getTrainingProviders();
  }

  getTrainingProviders() {
    const token = sessionStorage.getItem('token');

    this.service.getTrainingProvidersDropDown(token).subscribe(
      (response) => {
        console.log('API Response:', response);
        const providers = response?.results?.[0] || [];

        this.dataSource = providers;
      },
      (error) => {
        console.error('Error fetching training providers:', error);
      }
    );
  }

submitProvider(): void {
  const formData = this.trainingProgramFormGroup.value;
  const token = sessionStorage.getItem('token') ?? '';

  if (!token) {
    alert("Authentication token not found.");
    return;
  }
  console.log('id', this.data?.pprogID)
  const id = this.data?.pprogID;

  if (typeof id !== 'number') {
    alert("Training program ID is missing or invalid.");
    return;
  }

  this.service.createTrainingProviderInProgram(id, formData, token).subscribe({
    next: () => this.dialogRef.close(true),
    error: (err) => {
      console.error('Failed to create provider', err);
      alert('Error creating training provider.');
    }
  });
}

  onSubmit(): void {
    if (this.trainingProgramFormGroup.invalid) return;

    const dialogRef = this.dialog.open(ConfirmMessageComponent, {
      width: '400px',
      data: { message: 'Confirm: Are you sure you want to add this training program?' }
    });

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result === true) {
        this.submitProvider(); // Only submit if confirmed
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
