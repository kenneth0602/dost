import { Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

// Service
import { CertificatesService } from '../../certificates.service';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, CommonModule, MatDatepickerModule, FormsModule, ReactiveFormsModule
  ],
  providers: [provideNativeDateAdapter(), FormBuilder],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {

  selectedFile: File | null = null;
  isDragOver: boolean = false;
  form: FormGroup

  constructor(private dialogRef: MatDialogRef<AddComponent>,
    private service: CertificatesService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      program: [''],
      provider: [''],
      startDate: [''],
      endDate: [''],
      description: ['']
    });
  }

  onClose(): void {
    this.dialogRef.close();
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

  onUpload(): void {
    console.log('uploading...')
    if (this.form.valid) {
      const jwt = sessionStorage.getItem('token');
      const id = sessionStorage.getItem('userId');

      if (!jwt || !id) {
        console.error('Missing JWT or ID');
        return;
      }
      
      const formattedStart = formatDate(this.form.value.startDate, 'yyyy-MM-dd', 'en-US');
      const formattedEnd = formatDate(this.form.value.endDate, 'yyyy-MM-dd', 'en-US');

      const formData = new FormData();
      formData.append('programName', this.form.value.program);
      formData.append('trainingProvider', this.form.value.provider);
      formData.append('startDate', formattedStart); 
      formData.append('endDate', formattedEnd); 
      formData.append('description', this.form.value.description);

      console.log('form data:', formData)

      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      this.service.createCertificate(id, formData, jwt).subscribe({
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


}
