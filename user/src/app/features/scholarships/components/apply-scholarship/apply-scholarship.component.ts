import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { SharedService } from '../../../../shared/shared.service';
import { ScholarshipService } from '../../scholarship.service';

interface LabeledOption { value: string; }

@Component({
  selector: 'app-apply-scholarship',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, MatDatepickerModule, MatSelectModule, CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './apply-scholarship.component.html',
  styleUrl: './apply-scholarship.component.scss'
})
export class ApplyScholarshipComponent {
  graduatedYears: number[] = [];
  availableYears: number[] = [];
  availableEndYears: number[] = [];

  form!: FormGroup;

  // select options
  sex: LabeledOption[] = [{ value: 'Male' }, { value: 'Female' }];

  option: LabeledOption[] = [{ value: 'Thesis' }, { value: 'Non-Thesis' }];

  trainingCategory: LabeledOption[] = [{ value: 'Internal' }, { value: 'External' }];

  origin: LabeledOption[] = [{ value: 'Local' }, { value: 'Foreign' }];

  type: LabeledOption[] = [
    { value: 'Full-time' },
    { value: 'Local' },
    { value: 'New Enrollee' },
    { value: 'Part-time' },
    { value: 'Foreign' },
    { value: 'Continuing Student' },
    { value: 'Thesis Grant' },
    { value: 'Others (Specify)' },
  ];

  study: LabeledOption[] = [
    { value: 'Bachelor of Science' },
    { value: 'Masters' },
    { value: 'Doctorate' },
  ];

  studyTye: LabeledOption[] = [{ value: 'Part Time' }, { value: 'Full Time' }];

  school: LabeledOption[] = [
    { value: 'UP' },
    { value: 'DLSU' },
    { value: 'ADMU' },
    { value: 'UST' },
    { value: 'Others (Specify)' },
  ];

  constructor(
    private dialogRef: MatDialogRef<ApplyScholarshipComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private service: ScholarshipService
  ) { }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();

    // years for selects
    for (let i = currentYear; i <= currentYear + 100; i++) this.availableYears.push(i);
    for (let i = currentYear - 100; i <= currentYear; i++) this.graduatedYears.push(i);

    this.form = this.fb.group({
      // personal
      fullName: ['', [Validators.required, Validators.maxLength(150)]],
      sex: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      age: [{ value: null, disabled: true }],
      position: ['', Validators.required],
      division: ['', Validators.required],

      // contact
      office: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      residence: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mailingAddress: ['', Validators.required],

      // duties
      presentDuties: ['', Validators.required],

      // arrays (keep)
      positions: this.fb.array([this.createPositionGroup()]),
      trainings: this.fb.array([this.createTrainingGroup()]),
      education: this.fb.array([this.createEducationGroup()]),

      // scholarship details
      fieldOfStudy: [''],
      preferredSchool: ['', Validators.required],
      otherPreferredSchool: [''],
      option: [''],
      scholarshipType: ['', Validators.required],
      otherScholarship: [''],

      // school year
      schoolYearStart: [currentYear, Validators.required],
      schoolYearEnd: [currentYear + 1, Validators.required],
    });

    // dynamic: compute age from DOB
    this.form.get('dateOfBirth')!.valueChanges.subscribe((date: Date | null) => {
      this.setAgeFromDob(date);
    });

    // dynamic: update end-year options when start changes
    this.form.get('schoolYearStart')!.valueChanges.subscribe((yr: number) => {
      this.updateEndYear(yr);
    });

    // initialize end-year options once
    this.updateEndYear(currentYear);

    // Show/Hide “other” fields based on selection—optional: clear values when not needed
    this.form.get('preferredSchool')!.valueChanges.subscribe((v) => {
      if (v !== 'Others (Specify)') {
        this.form.get('otherPreferredSchool')!.reset();
      }
    });

    this.form.get('scholarshipType')!.valueChanges.subscribe((v) => {
      if (v !== 'Others (Specify)') {
        this.form.get('otherScholarship')!.reset();
      }
    });
  }

  // === Helpers to create row groups ===
  createPositionGroup(): FormGroup {
    return this.fb.group({
      orgPeriod: [''],
      orgPosition: [''],
      orgAgency: [''],
    });
  }

  createTrainingGroup(): FormGroup {
    return this.fb.group({
      speakerTitle: [''],
      speakerDate: [null],
      trainingCategory: [''],
    });
  }

  createEducationGroup(): FormGroup {
    return this.fb.group({
      institution: [''],
      yearGraduated: [null],
      degree: [''],
      honor: [''],
    });
  }

  // === Typed getters for arrays (handy in template) ===
  get positionsFA(): FormArray<FormGroup> {
    return this.form.get('positions') as FormArray<FormGroup>;
  }
  get trainingsFA(): FormArray<FormGroup> {
    return this.form.get('trainings') as FormArray<FormGroup>;
  }
  get educationFA(): FormArray<FormGroup> {
    return this.form.get('education') as FormArray<FormGroup>;
  }

  // === Add / Remove row handlers ===
  addPosition() { this.positionsFA.push(this.createPositionGroup()); }
  removePosition(i: number) {
    if (this.positionsFA.length > 1) this.positionsFA.removeAt(i);
  }

  addTraining() { this.trainingsFA.push(this.createTrainingGroup()); }
  removeTraining(i: number) {
    if (this.trainingsFA.length > 1) this.trainingsFA.removeAt(i);
  }

  addEducation() { this.educationFA.push(this.createEducationGroup()); }
  removeEducation(i: number) {
    if (this.educationFA.length > 1) this.educationFA.removeAt(i);
  }

  private setAgeFromDob(date: Date | null) {
    const ageCtrl = this.form.get('age');
    if (!date) {
      ageCtrl?.setValue(null);
      return;
    }
    const today = new Date();
    const dob = new Date(date);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    ageCtrl?.setValue(age);
  }

  updateEndYear(selectedStartYear: number): void {
    this.availableEndYears = this.availableYears.filter((y) => y > selectedStartYear);
    const endCtrl = this.form.get('schoolYearEnd')!;
    if (!this.availableEndYears.includes(endCtrl.value)) {
      endCtrl.setValue(this.availableEndYears[0] || selectedStartYear + 1);
    }
  }

  setYear(event: any, type: 'start' | 'end') {
    const year = event.getFullYear?.() ?? event; // support year-only value
    if (type === 'start') this.form.get('schoolYearStart')!.setValue(year);
    else this.form.get('schoolYearEnd')!.setValue(year);
  }

  formatDate(date: any): string {
    if (!date) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  applyScholarship(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const formatDate = (d: Date | null) =>
      d ? d.toISOString().split('T')[0] : 'Not available';

    // format single date fields
    raw.dateOfBirth = formatDate(raw.dateOfBirth);

    // normalize optional fields
    raw.otherPreferredSchool = raw.otherPreferredSchool || 'Not available';
    raw.otherScholarship = raw.otherScholarship || 'Not available';

    // format trainings array
    raw.trainings = raw.trainings.map((t: any) => ({
      ...t,
      speakerDate: formatDate(t.speakerDate),
    }));

    console.log('Applying for scholarship with data:', raw);
    alert('Application submitted successfully!');
    this.dialogRef.close(raw);
  }

}
