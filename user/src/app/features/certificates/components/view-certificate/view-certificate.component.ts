import { Component, OnInit, Inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { CertificatesService } from '../../certificates.service';

interface Certificates {
  certID: number,
  programName: string,
  description: string,
  trainingprovider: string,
  type: string,
  startDate: string,
  endDate: string,
  cert_status: string,
  filename: string
}

@Component({
  selector: 'app-view-certificate',
  imports: [MatDialogModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatDividerModule,
    MatIconModule, MatInputModule, ReactiveFormsModule
  ],
  templateUrl: './view-certificate.component.html',
  styleUrl: './view-certificate.component.scss'
})
export class ViewCertificateComponent {
  pdfContent: any;
  isforDivApproval: boolean = true;
  pdfUrl?: string;
  pdfSrc: string | ArrayBuffer | null = null;
  pdf?: SafeResourceUrl;
  fileName: string = '';
  remarks: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Certificates | null,
    public dialogRef: MatDialogRef<ViewCertificateComponent>,
    private service: CertificatesService  ,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
  ) {
    console.log('Received data:', data); // Check the entire data object
    const certId = data?.certID;
    console.log('Cert ID:', certId); // Ensure certId is being passed correctly
  }

  private convertBufferToString(bufferData: number[]): string {
    return String.fromCharCode.apply(null, bufferData);
  }
  
  ngOnInit(): void {
    if (this.data?.certID) {
      const certId = this.data.certID;
      this.fileName = this.data.filename;
      this.viewCertificate(certId);
    } else {
      console.error('certId is missing in the passed data:', this.data);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  viewCertificate(certId: number) {
    const token = sessionStorage.getItem('token');

    this.service.viewEmployeeCertificateByID(certId, token).subscribe(
      (blob: Blob) => {
        // Validate if Blob has the correct MIME type
        if (blob.type === 'application/pdf') {
          const objectURL = URL.createObjectURL(blob);
          this.pdf = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL); // Sanitization step
          console.log('PDF successfully loaded:', objectURL);
        } else {
          console.error('Invalid Blob Type:', blob.type); // Log unexpected types
        }
      },
      (error) => {
        console.error('Error fetching PDF:', error); // Log errors for further investigation
      }
    );
  }
}
