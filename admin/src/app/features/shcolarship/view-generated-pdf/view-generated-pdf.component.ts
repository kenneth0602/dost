import { Component, Inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-view-generated-pdf',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './view-generated-pdf.component.html',
  styleUrl: './view-generated-pdf.component.scss'
})
export class ViewGeneratedPdfComponent {
 safePdfUrl: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { pdfUrl: string },
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ViewGeneratedPdfComponent>
  ) {
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.pdfUrl);
  }

    onClose(): void {
    this.dialogRef.close();
  }

  sendForDeliberation() {
    console.log('Mock: Sending for deliberation...');
      alert('You have successfully sent the endorsed employees for deliberation');
      this.onClose();
  }

}
