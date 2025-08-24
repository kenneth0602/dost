import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FeaturesService } from '../../../../features.service';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-generate-ntp',
  imports: [MatCardModule, CommonModule, MatButtonModule, MatTableModule, MatDatepickerModule, MatFormFieldModule, FormsModule, MatInputModule, MatDividerModule],
  providers: [DatePipe],
  templateUrl: './generate-ntp.component.html',
  styleUrl: './generate-ntp.component.scss'
})
export class GenerateNtpComponent {
  dataSource: any[] = [];
  displayedColumns: string[] = [
    'email', 'last_name', 'first_name', 'middle_i',
    'division', 'participant_confirmation', 'date_of_approval',
    'div_chief', 'divchief_approval', 'remarks', 'date'
  ];

  programName: string = '';
  fromDate: string = '';
  toDate: string = '';
  dueDate: Date | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<GenerateNtpComponent>,
    private service: FeaturesService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    console.log('Received data:', this.data);
    this.dataSource = this.data.formData?.[0] || []; // ✅ clean data extraction
    this.programName = this.data.programName || '';
    this.fromDate = this.data?.dateFrom;
    this.toDate = this.data?.dateTo;
  }

    onClose(): void {
    this.dialogRef.close();
  }

  sendNTP(): void {
    const token = sessionStorage.getItem('token');
    const apcID = this.data.apcID;
    const formattedDueDate = this.datePipe.transform(this.dueDate, 'yyyy-MM-dd');

    console.log('Sending NTP:', {
      apcID,
      dueDate: formattedDueDate,
      dataSource: this.dataSource
    });

    this.service.createNtp(this.dataSource, token, formattedDueDate, apcID).subscribe((res: any) => {
      this.onClose();
    });
  }
}
