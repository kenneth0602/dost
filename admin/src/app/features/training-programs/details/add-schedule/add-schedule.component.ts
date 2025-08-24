import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

// Service
import { FeaturesService } from '../../../features.service';

// Component
import { ConfirmMessageComponent } from '../../../../shared/components/confirm-message/confirm-message.component';

// Validators
import { disallowCharacters, allowOnlyNumeric, cellphoneNumberValidator, emailValidator } from '../../../../shared/utils/validators';

interface TrainingProvider {
  provID: number;
  providerName: string;
  pointofContact: string;
}

interface trainingProgram {
  pprogID: number,
  programName: string,
  Description: string,
  status: string
}

@Component({
  selector: 'app-add-schedule',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, MatSelectModule, ReactiveFormsModule, MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-schedule.component.html',
  styleUrl: './add-schedule.component.scss'
})
export class AddScheduleComponent {

  trainingScheduleFormGroup: FormGroup;
  dataSource: TrainingProvider[] = [];
  timeOptions: string[] = [];
  constructor(
    private dialogRef: MatDialogRef<AddScheduleComponent>,
    private dialog: MatDialog,
    private service: FeaturesService,
    @Inject(MAT_DIALOG_DATA) public data: { provID: number; pprogID: number } | null,
    private fb: FormBuilder,) {
    console.log('Received dialog data:', data);
    this.trainingScheduleFormGroup = this.fb.group({
      pprogID: [''],
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
      fromTime: ['', Validators.required],
      toTime: ['', Validators.required],
    });

    if (data?.pprogID) {
      this.trainingScheduleFormGroup.patchValue({ pprogID: String(data.pprogID) });
    }
  }

  ngOnInit(): void {
    this.generateTimeOptions();
    this.getTrainingProviders();
  }

  generateTimeOptions(): void {
    const times: string[] = [];
    const start = 6; // 6:00 AM
    const end = 21; // 9:00 PM

    for (let hour = start; hour <= end; hour++) {
      ['00', '30'].forEach(minute => {
        const h = hour < 10 ? `0${hour}` : `${hour}`;
        times.push(`${h}:${minute}:00`);
      });
    }

    this.timeOptions = times;
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
    let formData = this.trainingScheduleFormGroup.value;
    const token = sessionStorage.getItem('token') ?? '';

    if (!token) {
      alert("Authentication token not found.");
      return;
    }

    const id = this.data?.provID;
    if (typeof id !== 'number' && typeof id !== 'string') {
      alert("Training program ID is missing or invalid.");
      return;
    }

    // Format dates to 'YYYY-MM-DD'
    formData = {
      ...formData,
      dateFrom: formatDate(formData.dateFrom, 'yyyy-MM-dd', 'en-US'),
      dateTo: formatDate(formData.dateTo, 'yyyy-MM-dd', 'en-US'),
    };

    this.service.createTrainingSchedule(id, formData, token).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => { 
        console.error('Failed to create provider', err);
        alert('Error creating training provider.'); 
      } 
    }); 
  } 

  onSubmit(): void {
    if (this.trainingScheduleFormGroup.invalid) return;

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
