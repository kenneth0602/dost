import { Component, Inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-view-deliberation',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './view-deliberation.html',
  styleUrl: './view-deliberation.scss'
})
export class ViewDeliberation {
  pdfUrl: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ViewDeliberation>
  ) {
    // Suppose your PDF is in `assets/deliberation-sample.pdf`
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('Evaluation_Sheet_Science and Tech Grant (62).pdf');
  }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
