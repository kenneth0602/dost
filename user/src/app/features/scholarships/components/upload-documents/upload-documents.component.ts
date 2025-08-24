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

import { ScholarshipService } from '../../scholarship.service';
import { getOutputFileNames } from 'typescript';
import { MatSelectModule } from '@angular/material/select';

interface documentType {
  value: string
}

@Component({
  selector: 'app-upload-documents',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatGridListModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, CommonModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatSelectModule
  ],
  templateUrl: './upload-documents.component.html',
  styleUrl: './upload-documents.component.scss'
})
export class UploadDocumentsComponent {

  selectedFile: File | null = null;
  isDragOver: boolean = false;
  form: FormGroup
    document: documentType[] = [
    { value: 'Registration Form' },
    { value: 'First Quarter Grade' },
    { value: 'Second Quarter Grade' },
    { value: 'Third Quarter Grade' },
    { value: 'Fourth Quarter Grade' }
  ]

  constructor(private dialogRef: MatDialogRef<UploadDocumentsComponent>,
    private service: ScholarshipService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      title: [''],
      category: ['']
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

  // onUpload(): void {
  //   console.log('uploading...')
  //   if (this.form.valid) {
  //     const jwt = sessionStorage.getItem('token');

  //     if (!jwt) {
  //       console.error('Missing JWT or ID');
  //       return;
  //     }


  //     const formData = new FormData();
  //     formData.append('title', this.form.value.title);
  //     formData.append('category', this.form.value.category);

  //     console.log('form data:', formData)

  //     if (this.selectedFile) {
  //       formData.append('file', this.selectedFile);
  //     }

  //     this.service.uploadScholarship(formData, jwt).subscribe({
  //       next: (res) => {
  //         console.log('Certificate created:', res);
  //         this.dialogRef.close(true);
  //       },
  //       error: (err) => {
  //         console.error('Upload failed:', err);
  //       }
  //     });
  //   }
  // }

}
