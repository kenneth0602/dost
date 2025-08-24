import { Component, ViewChild, AfterViewInit, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';

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

interface SubjectMatterExpert {
  profileID: number;
  provID: number;
  lastname: string;
  firstname: string;
  middlename: string;
  mobileNo: string;
  telNo: string;
  companyName: string;
  companyAddress: string;
  companyNo: string;
  emailAdd: string;
  fbMessenger: string;
  viberAccount: string;
  website: string;
  areaOfExpertise: string;
  affiliation: string;
  resource: string;
  honorariaRate: number;
  TIN: string;
  status: string;
  createdOn: string; // ISO string format
  disabledOn: string | null;
  updatedOn: string;
}

interface Source {
  value: string
}

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, MatStepperModule, ReactiveFormsModule, CommonModule,
    MatSelectModule
  ],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {

  @ViewChild('stepper') stepper!: MatStepper;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  stepperStepsCount = 0;
  isDisabled = true;
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
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ViewComponent>,
    private dialog: MatDialog,
    private service: FeaturesService,
    @Inject(MAT_DIALOG_DATA) public data: SubjectMatterExpert | null
  ) {
    this.firstFormGroup = this._formBuilder.group({
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

    this.secondFormGroup = this._formBuilder.group({
      telNo: [''],
      website: [''],
      emailAdd: [''],
      fbMessenger: [''],
      viberAccount: [''],
      areaOfExpertise: [''],
      honorariaRate: [''],
      TIN: [''],
    });

    if (data) {
      this.firstFormGroup.patchValue(data);
      this.secondFormGroup.patchValue(data);
      this.firstFormGroup.disable();   // disable if view-only
      this.secondFormGroup.disable();  // disable if view-only
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.stepperStepsCount = this.stepper?.steps?.length || 0;
    });
  }

  ngOnInit(): void {
    this.getTrainingProviders();
  }

  toggleEdit(): void {
    this.isDisabled = !this.isDisabled;

    if (this.isDisabled) {
      this.firstFormGroup.disable();
      this.secondFormGroup.disable();
    } else {
      this.firstFormGroup.enable();
      this.secondFormGroup.enable();
    }
  }

  getTrainingProviders() {
    const token = sessionStorage.getItem('token');

    this.service.getTrainingProvidersDropDown(token).subscribe(
      (response) => {
        console.log('API Response:', response);
        const sme = response?.results?.[0] || [];

        this.dataSource = sme;
      },
      (error) => {
        console.error('Error fetching training sme:', error);
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

    if (!this.data) {
      console.error('No data passed to ViewComponent.');
      return;
    }

    const id = this.data.profileID;

    this.service.updateSme(id, formData, token).subscribe({
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
      data: { message: 'Confirm: Are you sure you want to update the details of this subject matter expert?' }
    });

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result === true) {
        this.submitSME(); // Only submit if confirmed
      }
    });
  }

  activateSME(): void {
    const dialogRef = this.dialog.open(ConfirmMessageComponent, {
      width: '400px',
      data: { message: 'Are you sure you want to activate this subject matter expert?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const token = sessionStorage.getItem('token');
        if (!token) {
          return;
        }

        if (!this.data) {
          console.error("No sme data found.");
          return;
        }

        this.service.activateSme(this.data.profileID, token).subscribe({
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

  deactivateSME(): void {
    const dialogRef = this.dialog.open(ConfirmMessageComponent, {
      width: '400px',
      data: { message: 'Are you sure you want to deactivate this subject matter expert?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const token = sessionStorage.getItem('token');
        if (!token) {
          return;
        }

        if (!this.data) {
          console.error("No sme data found.");
          return;
        }

        this.service.deactivateSme(this.data.profileID, token).subscribe({
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


  onClose(): void {
    this.dialogRef.close();
  }
}
