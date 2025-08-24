import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ViewportScrollPosition } from '@angular/cdk/scrolling';

interface ScholarshipOption {
  value: string;
}

@Component({
  selector: 'app-view-employee-application',
  standalone: true,
  imports: [
    MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, MatDatepickerModule, MatSelectModule, CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './view-employee-application.component.html',
  styleUrl: './view-employee-application.component.scss'
})
export class ViewEmployeeApplicationComponent {
  form!: FormGroup;
  graduatedYears: number[] = [];
  availableYears: number[] = [];
  availableEndYears: number[] = [];
  selectedScholarship: string = '';
  selectedSchool: string = '';
  @ViewChild('rejectDialog') rejectDialog!: TemplateRef<any>;
  rejectReason: string = '';
  rejectDialogRef!: MatDialogRef<any>;
  rejectReasonControl = new FormControl('', Validators.required);
  sex: ScholarshipOption[] = [
    { value: 'Male' },
    { value: 'Female' }
  ]
  option: ScholarshipOption[] = [
    { value: 'Thesis' },
    { value: 'Non-Thesis' }
  ]
  origin: ScholarshipOption[] = [{ value: 'Local' }, { value: 'Foreign' }];
  type: ScholarshipOption[] = [
    { value: 'Full-time' },
    { value: 'Local' },
    { value: 'New Enrollee' },
    { value: 'Part-time' },
    { value: 'Foreign' },
    { value: 'Continuing Student' },
    { value: 'Thesis Grant' },
    { value: 'Others (Specify)' }
  ]
  study: ScholarshipOption[] = [{ value: 'Bachelor of Science' }, { value: 'Masters' }, { value: 'Doctorate' }];
  studyTye: ScholarshipOption[] = [{ value: 'Part Time' }, { value: 'Full Time' }];
  school: ScholarshipOption[] = [{ value: 'UP' }, { value: 'DLSU' }, { value: 'ADMU' }, { value: 'UST' }, { value: 'Others (Specify)' }];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ViewportScrollPosition>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
    
  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i <= currentYear + 100; i++) {
      this.availableYears.push(i);
    }

    for (let i = currentYear - 100; i <= currentYear; i++) {
      this.graduatedYears.push(i);
    }
    
    this.form = this.fb.group({
      fullName: [this.data.fullName || ''],
      sex: [this.data.sex || ''],
      dateOfBirth: [this.data.dateOfBirth ? new Date(this.data.dateOfBirth) : ''],
      age: [{ value: '', disabled: true }],
      position: [this.data.position || ''],
      division: [this.data.division || ''],
      office: [this.data.office || ''],
      mobile: [this.data.mobile || ''],
      residence: [this.data.residence || ''],
      email: [this.data.email || ''],
      mailingAddress: [this.data.mailingAddress || ''],
      presentDuties: [this.data.presentDuties || ''],
      period: [this.data.period || ''],
      previousPosition: [this.data.previousPosition || ''],
      agency: [this.data.agency || ''],
      institution: [this.data.institution || ''],
      yearGraduated: [this.data.yearGraduated || ''],
      degree: [this.data.degree || ''],
      scholarshipReceived: [this.data.scholarshipReceived || ''],
      fieldOfStudy: [this.data.fieldOfStudy || ''],
      preferredSchool: [this.data.preferredSchool || ''],
      otherPreferredSchool: [this.data.otherPreferredSchool || ''],
      option: [this.data.option || ''],
      scholarshipType: [this.data.scholarshipType || ''],
      otherScholarship: [this.data.otherScholarship || '']
    });

    if (this.data.dateOfBirth) {
      this.form.patchValue({ dateOfBirth: this.data.dateOfBirth });
      this.calculateAge();
    }

    this.updateEndYear(this.form.value.schoolYearStart);
  }

  calculateAge() {
    const date = this.form.get('dateOfBirth')?.value;
    if (date) {
      const today = new Date();
      const dob = new Date(date);
      let calculatedAge = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        calculatedAge--;
      }
      this.form.get('age')?.setValue(calculatedAge);
    } else {
      this.form.get('age')?.setValue(null);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  updateEndYear(selectedStartYear: number): void {
    this.form.patchValue({ schoolYearStart: selectedStartYear });
    this.availableEndYears = this.availableYears.filter(year => year > selectedStartYear);
    this.form.patchValue({ schoolYearEnd: this.availableEndYears[0] || selectedStartYear + 1 });
  }

  applyScholarship(): void {
    console.log('Applying with data:', this.form.value);
    alert('Application submitted successfully!');
    this.dialogRef.close(this.form.value);
  }

  cancelScholarship(): void {
    if (confirm('Are you sure you want to cancel your application?')) {
      // Add cancellation logic here
      console.log('Scholarship application cancelled');
      this.dialogRef.close('cancelled');
    }
  }

 approveApplication(): void {
    console.log('Scholarship application approved!');
    this.dialogRef.close({ status: 'approved' });
  }

  rejectApplication(): void {
    this.rejectReasonControl.reset();
    this.rejectDialogRef = this.dialog.open(this.rejectDialog, {
      width: '400px'
    });
  }

  closeRejectDialog(): void {
    this.rejectDialogRef.close();
  }

  submitRejectReason(): void {
    if (this.rejectReasonControl.valid) {
      const reason = this.rejectReasonControl.value;
      console.log('Rejected with reason:', reason);
      this.dialogRef.close({ status: 'rejected', reason });
      this.rejectDialogRef.close();
    }
  }
}
