import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import {MatSelectModule} from '@angular/material/select';

// Service
import { FeaturesService } from '../../features.service';

// Component
import { ConfirmMessageComponent } from '../../../shared/components/confirm-message/confirm-message.component';

// Validators
import { disallowCharacters, allowOnlyNumeric, cellphoneNumberValidator, emailValidator } from '../../../shared/utils/validators';

interface trainingProvider {
  provID: number,
  providerName: string
}

interface Source {
  value: string
}

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, MatStepperModule, ReactiveFormsModule, CommonModule,
    MatSelectModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent implements AfterViewInit, OnInit {

  @ViewChild('stepper') stepper!: MatStepper;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  stepperStepsCount = 0;

  dataSource: trainingProvider[] = [];

    resource: Source[] = [
    {
      value: 'Internal'
    },
    {
      value: 'External'
    }
  ]

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddComponent>,
    private dialog: MatDialog,
    private service: FeaturesService
  ) {
    this.firstFormGroup = this.fb.group({
      firstname: ['', Validators.required],
      middlename: [''],
      lastname: ['', Validators.required],
      provID: [''],
      resource: [''],
      companyName: [''],
      companyAddress: [''],
      companyNo: [''],
      affiliation: [''],
      mobileNo: [''],
    });

    this.secondFormGroup = this.fb.group({
      telNo: [''],
      website: [''],
      emailAdd: [''],
      fbMessenger: [''],
      viberAccount: [''],
      areaOfExpertise: [''],
      honorariaRate: [''],
      TIN: [''],
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.stepperStepsCount = this.stepper?.steps?.length || 0;
    });
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

  submitSME(): void {
    const formData = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
    };

    const token = sessionStorage.getItem('token') ?? '';

    if (!token) {
      alert("Authentication token not found.");
      return;
    }

    this.service.createSme(formData, token).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error('Failed to create sme', err);
        alert('Error creating training sme.');
      }
    });
  }

  onSubmit(): void {
    if (this.firstFormGroup.invalid || this.secondFormGroup.invalid) return;

    const dialogRef = this.dialog.open(ConfirmMessageComponent, {
      width: '400px',
      data: { message: 'Confirm: Are you sure you want to add this subject matter expert?' }
    });

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result === true) {
        this.submitSME(); // Only submit if confirmed
      }
    });
  }


  onClose(): void {
    this.dialogRef.close();
  }
}
