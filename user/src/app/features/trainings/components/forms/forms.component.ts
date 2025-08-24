import { Component, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTabChangeEvent } from '@angular/material/tabs';

// Service
import { TrainingsService } from '../../trainings.service';
import { RegistrationComponent } from '../registration/registration.component';
import { AnswerFormComponent } from '../answer-form/answer-form.component';

interface programForms {
  apcID: number,
  apID: number,
  programName: string,
  dateFrom: string,
  dateTo: string,
  fromTime: string,
  toTime: string,
  providerName: string,
  cost: number
}

interface forms {
  type: string;
  createdOn: string;
  pretest_response_count?: number;
  feedback_response_count?: number;
  posttest_response_count?: number;
  noOfResponse?: number;
}

interface response {
  type: string,
  fullName: string,
  user_total_points: string,
  dateAnswered: string,
}

interface noticeOfParticipation {
  email: string,
  lastname: string,
  firstname: string,
  middle_name: string,
  divName: string,
  participant_confirmation: string
  date_of_filling_out: string,
  divchief_approval: string
  divchiefName: string,
  remarks: string,
  due_date: string
}

interface registration {
  email: string,
  l_name: string,
  f_name: string,
  m_name: string,
  sex: string,
  division: string,
  employment_status: string,
  consent: string,
}

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule, MatTabsModule
  ],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;
  pageNo: number = 1;
  pageSize: number = 5;
  keyword: string = '';
  total: number = 0;
  selectedForm!: programForms;
  formsDataSource: forms[] = [];
  responseDataSource = new MatTableDataSource<response>();
  ntpDataSource = new MatTableDataSource<noticeOfParticipation>();
  registrationDataSource = new MatTableDataSource<registration>();
  due_date?: string;
  apID!: number;
  apcID!: number;
  programName!: string;
  fromDate!: string;
  toDate!: string;
  ntpExists: boolean = false;
  selectedTabIndex: number = 0;
  tabTypes: string[] = ['Pre-Test', 'Post-Test', 'Feedback'];
  displayedFormsColumns: string[] = ['type', 'createdOn', 'noOfResponse'];
  displayedResponseColumns: string[] = ['type', 'user_total_points', 'dateAnswered'];
  displayedNtpColumns: string[] = ['email', 'fullName', 'divName', 'participant_confirmation', 'date_of_filling_out', 'divchief_approval', 'divchiefName', 'remarks', 'approved_date', 'actions'];
  displayedRegistrationColumns: string[] = ['email', 'fullName', 'sex', 'division', 'employment_status', 'consent'];

  constructor(private dialog: MatDialog, private service: TrainingsService, private router: Router) {

  }

  ngOnInit(): void {
    this.selectedForm = history.state?.['formData'] as programForms;

    if (this.selectedForm && this.selectedForm.apID) {
      this.apID = this.selectedForm.apID;
      this.apcID = this.selectedForm.apcID;
      this.programName = this.selectedForm.programName;
      this.fromDate = this.selectedForm.dateFrom;
      this.toDate = this.selectedForm.dateTo;
      console.log('Selected full data:', this.selectedForm);
      this.getFormsById(this.apID)
      this.getSelectedFormsResponseById(this.apID)
      this.getNtp(this.apcID)
      this.getRegistration(this.apcID)

      // Load responses for first tab (Pre-Test) by default
    } else {
      console.warn('No formData passed in history.state.');
    }
  }

  openConfirmDialog(element: any) {
    const dialogRef = this.dialog.open(this.confirmDialog, {
      data: element
    });

    dialogRef.afterClosed().subscribe((decision: 'approve' | 'decline' | null) => {
      if (decision === 'approve' || decision === 'decline') {
        const jwt = sessionStorage.getItem('token');

        const payload = {
          empID: String(element.empID),
          ntpID: String(element.ID),
        };

        console.log('payload', payload)

        this.service.ntpParticipation(decision, payload, jwt).subscribe({
          next: (res) => {
            console.log(`Participant ${decision}d successfully:`, res);
            this.getFormsById(this.apID)
            this.getSelectedFormsResponseById(this.apID)
            this.getNtp(this.apcID)
            this.getRegistration(this.apcID)
          },
          error: (err) => {
            console.error(`Error on ${decision}:`, err);
          }
        });
      }
    });
  }


  getFormsById(id: any) {
    const token = sessionStorage.getItem('token');

    this.service.getFormById(token, id).subscribe(
      (response) => {
        console.log('API Response:', response);

        const training_program = response?.results || [];
        const total = response?.total?.[0]?.total || 0;

        this.formsDataSource = training_program;
        this.total = total;
      },
      (error) => {
        console.error('Error fetching unplanned competency:', error);
      }
    );
  }

  rowClicked(row: any): void {
    const token = sessionStorage.getItem('token');

    this.service.getFormsContentById(token, row.formID).subscribe({
      next: (response) => {
        const formData = response?.results;

        const dialogRef = this.dialog.open(AnswerFormComponent, {
          maxWidth: '100%',
          width: '60%',
          height: '90%',
          disableClose: true,
          data: {
            apID: this.apID,
            formType: row.type,
            formData: formData,
            formId: row.formID
          }
        });

        dialogRef.afterClosed().subscribe(() => {
          this.getFormsById(this.apID)
          this.getSelectedFormsResponseById(this.apID)
          this.getNtp(this.apcID)
          this.getRegistration(this.apcID)
        });

        console.log('Passing formId to dialog:', row.formId);
      },
      error: (err) => {
        console.error('Failed to fetch form by formID:', err);
      }
    });
  }

  getSelectedFormsResponseById(apId: any) {
    const id = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');

    this.service.getSelectedFormResponse(token, apId, id).subscribe(
      (response) => {
        console.log('API Response:', response);

      const results = response?.results || [];
      this.responseDataSource.data = results;
      },
      (error) => {
        console.error('Error fetching unplanned competency:', error);
      }
    );
  }

  getRegistration(apId: any) {
    const id = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');

    this.service.geRegister(token, apId, id).subscribe(
      (response) => {
        console.log('API Response:', response);

        const registrationData = response?.results || [];
        this.registrationDataSource.data = registrationData;
      },
      (error) => {
        console.error('Error fetching registration:', error);
      }
    );
  }

  getNtp(apcID: any) {
    const id = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');

    this.service.getNtp(token, apcID, id).subscribe(
      (response) => {
        console.log('API Response:', response);

        // ✅ Access the actual training program data
        const training_program = response?.results?.[0] || [];

        // ✅ Optionally compute total count (if needed)
        const total = training_program.length;

        // ✅ Bind to your table
        this.ntpDataSource = training_program;
        this.total = total;
      },
      (error) => {
        console.error('Error fetching NTP:', error);
      }
    );
  }

  onClickRegistration() {
    this.dialog.open(RegistrationComponent,
      {
        maxWidth: '100%',
        width: '60%',
        height: '90%',
        disableClose: true,
        data: {
          apcID: this.apcID
        }
      }
    ).afterClosed().subscribe(
      data => {
        this.getFormsById(this.apID)
        this.getSelectedFormsResponseById(this.apID)
        this.getNtp(this.apcID)
        this.getRegistration(this.apcID)
      }
    )
    console.log('id', this.apcID)
  }

}
