import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

// Service
import { FeaturesService } from '../../features.service';

// Component
import { ConfirmMessageComponent } from '../../../shared/components/confirm-message/confirm-message.component';

interface trainingProvider {
  provID: number,
  providerName: string
}

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, MatSelectModule, ReactiveFormsModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent implements OnInit{

  trainingProgramFormGroup: FormGroup;
  dataSource: trainingProvider[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddComponent>,
    private dialog: MatDialog,
    private service: FeaturesService,
    private fb: FormBuilder,) {
      this.trainingProgramFormGroup = this.fb.group({
        description: ['', Validators.required],
        programName: ['', Validators.required],
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

    this.service.createTrainingProgram(formData, token).subscribe({
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
