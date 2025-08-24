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

import { ScholarshipService } from '../../scholarship-service';
import { getOutputFileNames } from 'typescript';

@Component({
  selector: 'app-upload-scholarship',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, CommonModule, MatDatepickerModule, FormsModule, ReactiveFormsModule
  ],
  templateUrl: './upload-scholarship.html',
  styleUrl: './upload-scholarship.scss'
})
export class UploadScholarship {

  selectedFile: File | null = null;
  isDragOver: boolean = false;
  form: FormGroup

  constructor(private dialogRef: MatDialogRef<UploadScholarship>,
    private service: ScholarshipService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      title: [''],
      category: [''],
      sponsor: [''],
      participation_fee: [''],
      venue: ['']
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

      if (!jwt) {
        console.error('Missing JWT or ID');
        return;
      }


      const formData = new FormData();
      formData.append('title', this.form.value.title);
      formData.append('category', this.form.value.category);
      formData.append('sponsor', this.form.value.sponsor);
      formData.append('participation_fee', this.form.value.participation_fee);
      formData.append('venue', this.form.value.venue);

      console.log('form data:', formData)

      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      this.service.uploadScholarship(formData, jwt).subscribe({
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
