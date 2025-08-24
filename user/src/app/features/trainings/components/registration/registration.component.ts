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
import { TrainingsService } from '../../trainings.service';

// Components
import { ConfirmMessageComponent } from '../../../../shared/components/confirm-message/confirm-message.component';

interface employmentStatus {
  value: string;
}

interface division {
  value: string
}

interface Sex {
  value: string
}

interface videoConsent {
  name: string,
  value: string
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, MatSelectModule, ReactiveFormsModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {

  registraionFormGroup: FormGroup;

  employmentStatus: employmentStatus[] = [
    { value: 'Contract of Service' },
    { value: 'Regular' },
    { value: 'Temporary' },
    { value: 'Job Order' }
  ]

  division: division[] = [
    {value: 'IT'},
    {value: 'Accounting'},
    {value: 'HR'}
  ]

  sex: Sex[] = [
    {value: 'Male'},
    {value: 'Female'}
  ]

  videoConsent: videoConsent[] = [
    {name: 'Allow', value: 'Yes'},
    {name: 'Do not allow', value: 'No'},
  ]

  constructor(
    private dialogRef: MatDialogRef<RegistrationComponent>,
    private dialog: MatDialog,
    private service: TrainingsService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    const id = sessionStorage.getItem('userId');
    const apcID = data?.apcID || '';
    this.registraionFormGroup = this.fb.group({
      apcID: [apcID || ''],
      empID: [id || ''],
      division: [''],
      email: ['', Validators.email],
      employment_status: [''],
      f_name: [''],
      l_name: [''],
      m_name: [''],
      photoVideoConsent: [''],
      sex: [''],
    })
  }

  submitProvider(): void {
    const formData = this.registraionFormGroup.value;
    const token = sessionStorage.getItem('token') ?? '';

    if (!token) {
      alert("Authentication token not found.");
      return;
    }

    this.service.createRegistration(formData, token).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error('Failed to create provider', err);
        alert('Error creating training provider.');
      }
    });
  }

  onSubmit(): void {
    if (this.registraionFormGroup.invalid) return;

    const dialogRef = this.dialog.open(ConfirmMessageComponent, {
      width: '400px',
      data: { message: 'Confirm: Are you sure you want to add this registration?' }
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
