import { Component, Inject, inject, OnInit } from '@angular/core';
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
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ScholarshipService } from '../../scholarship-service';

import { ConfirmMessage } from '../../../../../shared/components/confirm-message/confirm-message';
import { Shared } from '../../../../../shared/shared';

interface scholarship {
  id: number,
  title: string,
  category: string,
  status: string,
  filename: string,
}

@Component({
  selector: 'app-view-scholarship',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, FormsModule, ReactiveFormsModule, MatTableModule, MatCheckboxModule
  ],
  templateUrl: './view-scholarship.html',
  styleUrl: './view-scholarship.scss'
})
export class ViewScholarship implements OnInit {
  private readonly sharedService = inject(Shared);
  scholarshipForm!: FormGroup;
  isDisabled = true;
  selectedFile: File | null = null;
  isDragOver: boolean = false;
  showEmployeeSelection = false;
  employees: any[] = [];
  selectedEmployees: number[] = [];
  keyword: string = '';

  constructor(
    private dialogRef: MatDialogRef<ViewScholarship>,
    private fb: FormBuilder,
    private service: ScholarshipService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: scholarship | null
  ) {
    this.scholarshipForm = this.fb.group({
      title: [''],
      category: [''],
      sponsor: [''],
      participation_fee: [''],
      venue: ['']
    });

    if (data) {
      this.scholarshipForm.patchValue(data);
    }
  }
  
  ngOnInit(): void {
    // this.getScholarshipById();
    this.getEmployeeList(this.keyword);
  }

  showForm(): void {
    this.showEmployeeSelection = false;
  }

  toggleForm(): void {
    if (this.scholarshipForm.disabled) {
      this.scholarshipForm.enable();
      this.isDisabled = false;
    } else {
      this.scholarshipForm.disable();
      this.isDisabled = true;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  private submitProvider(): void {
    const formData = this.scholarshipForm.value;
    const token = sessionStorage.getItem('token');

    if (!token) {
      return;
    }

    if (!this.data) {
      console.error('No data passed to ViewComponent.');
      return;
    }

    const id = this.data.id;

    this.service.updateScholarship(id, formData, token).subscribe({
      next: (res) => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Failed to create provider', err);
      }
    });
  }

  showAssignEmployees(): void {
    this.showEmployeeSelection = true;
    this.getEmployeeList(this.keyword); // Load employees when switching view
  }

  // assignSelectedEmployees(): void {
  //   const assignedEmployees = this.employees.filter(e =>
  //     this.selectedEmployees.includes(e.id)
  //   );

  //   console.log('Assigned Employees:', assignedEmployees);

  //   // Mock assigning process
  //   this.sharedService.handleSuccess('Employees assigned successfully.');
  //   this.dialogRef.close(true);
  //   // Optionally reset selection and return to form view
  //   this.selectedEmployees = [];
  //   this.showEmployeeSelection = false;
  // }

  assignScholarshipToEmployees() {
    const token = sessionStorage.getItem('token')
    const id = Number(this.data?.id);

    const payload = {
      scholarship_id: id,
      employee_ids: this.selectedEmployees
    }

    this.service.assignScholarshipToEmployees(payload, token).subscribe(
      (response) => {
        this.sharedService.handleSuccess('Employees assigned successfully.');
        this.dialogRef.close(true);
        this.selectedEmployees = [];
        this.showEmployeeSelection = false;
      }
    )
  }
  
  getEmployeeList(keyword: string): void {
    const token = sessionStorage.getItem('token');
    this.service.getEmployeeList(token, keyword).subscribe(
      (response) => {
        this.employees = response.data || [];
        console.log(this.employees);
      },
      (error) => {
        console.error('Failed to fetch employees', error);
      }
    );
  }

  // Selection logic
  isSelected(empID: number): boolean {
    return this.selectedEmployees.includes(empID);
  }

  toggleSelection(empID: number): void {
    if (this.isSelected(empID)) {
      this.selectedEmployees = this.selectedEmployees.filter(empID => empID !== empID);
    } else {
      this.selectedEmployees.push(empID);
    }
  }

  toggleSelectAll(event: any): void {
    if (event.checked) {
      this.selectedEmployees = this.employees.map(e => e.empID);
    } else {
      this.selectedEmployees = [];
    }
  }

  isAllSelected(): boolean {
    return this.employees.length > 0 && this.selectedEmployees.length === this.employees.length;
  }

  onSubmit(): void {
    if (this.scholarshipForm.invalid) return;

    const dialogRef = this.dialog.open(ConfirmMessage, {
      width: '400px',
      data: { message: 'Confirm: Are you sure you want to update the details of this scholarship?' }
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
      this.scholarshipForm.disable();
    } else {
      this.scholarshipForm.enable();
    }
  }

  getScholarshipById() {
    const id = Number(this.data?.id);
    const token = sessionStorage.getItem('token')

    this.service.getScholarshipById(id, token).subscribe(
      (response) => { }
    )
  }

  activateScholarship(): void {
    const dialogRef = this.dialog.open(ConfirmMessage, {
      width: '400px',
      data: { message: 'Are you sure you want to activate this scholarship?' }
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

        this.service.activateScholarship(this.data.id, token).subscribe({
          next: (res) => {
            if (res.result === 'INVALID') {
              this.sharedService.handleError(res.message || 'Something went wrong.');
              return;
            }

            if (this.data) {
              this.data.status = 'Active';
            }
            this.dialogRef.close(true);
          },
          error: (err) => {
            console.error('Activation failed', err);
            this.sharedService.handleError('Activation failed. Please try again.');
          }
        });
      }
    });
  }

  deactivateScholarship(): void {
    const dialogRef = this.dialog.open(ConfirmMessage, {
      width: '400px',
      data: { message: 'Are you sure you want to deactivate this scholarship?' }
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

        this.service.deactivateScholarship(this.data.id, token).subscribe({
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

  onUpload(): void {
    console.log('uploading...')
    if (this.scholarshipForm.valid) {
      const jwt = sessionStorage.getItem('token');

      if (!jwt) {
        console.error('Missing JWT or ID');
        return;
      }

      const payload = this.scholarshipForm.value;

      const id = Number(this.data?.id);

      this.service.updateScholarship(id, payload, jwt).subscribe({
        next: (res) => {
          console.log('Certificate created:', res);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Upload failed:', err);
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }


}
