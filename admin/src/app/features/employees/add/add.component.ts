import { Component, ViewChild, ChangeDetectionStrategy, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

interface Gender {
  value: string
}

interface employmentStatus {
  value: string
}

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, MatStepperModule, ReactiveFormsModule, CommonModule,
    MatDatepickerModule, MatSelectModule, MatCheckboxModule, MatRadioModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {

  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly labelPosition = model<'before' | 'after'>('after');
  readonly disabled = model(false);

  genders: Gender[] = [
    {
      value: 'Male'
    },
    {
      value: 'Female'
    }
  ]

  employees: employmentStatus[] = [
    {
      value: 'Contractual'
    },
    {
      value: 'Probitionary'
    },
    {
      value: 'Regular'
    },
    {
      value: 'Resigned'
    }
  ]

  @ViewChild('stepper') stepper!: MatStepper;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  stepperStepsCount = 0;

  constructor(private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddComponent>) {
    this.firstFormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      trainingProvider: [''],
      source: [''],
      company: [''],
      companyAddress: [''],
      companyNumber: [''],
      otherAffiliations: [''],
      mobileNumber: [''],
    });

    this.secondFormGroup = this._formBuilder.group({
      telephoneNumber: [''],
      website: [''],
      email: [''],
      fbMessenger: [''],
      viber: [''],
      expertise: [''],
      honoraria: [''],
      tin: [''],
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.stepperStepsCount = this.stepper?.steps?.length || 0;
    });
  }

  onSubmit() {
    const result = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
    };
    console.log(result);
    // submit logic
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
