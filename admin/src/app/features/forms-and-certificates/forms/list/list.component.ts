import { Component, ViewChild, OnInit } from '@angular/core';
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
import { FeaturesService } from '../../../features.service';
import { CreateFormComponent } from './create-form/create-form.component';
import { ViewFormComponent } from './view-form/view-form.component';
import { GenerateNtpComponent } from './generate-ntp/generate-ntp.component';

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
  selector: 'app-list',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule, MatTabsModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
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
  displayedResponseColumns: string[] = ['type', 'fullName', 'user_total_points', 'dateAnswered'];
  displayedNtpColumns: string[] = ['email', 'fullName', 'divName', 'participant_confirmation', 'date_of_filling_out', 'divchief_approval', 'divchiefName', 'remarks', 'approved_date'];
  displayedRegistrationColumns: string[] = ['email', 'fullName', 'sex', 'division', 'employment_status', 'consent'];

  constructor(private dialog: MatDialog, private service: FeaturesService, private router: Router) {

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
      this.getAldpFormsById(this.apID);
      this.getFormNtpById(this.apcID);
      this.getFormRegisterById(this.apcID);

      // Load responses for first tab (Pre-Test) by default
      this.getResponseById(this.apID, this.tabTypes[0]);
    } else {
      console.warn('No formData passed in history.state.');
    }
  }


  getAllEmployeesCert(pageNo: number, pageSize: number, keyword: string) {
    const token = sessionStorage.getItem('token');

    this.service.getAllEmployeesCertificates(token, pageNo, keyword, pageSize).subscribe(
      (response) => {
        console.log('API Response:', response);
        const employees = response?.results?.[0] || [];
        const total = response?.results?.[1]?.[0]?.total || 0;

        this.formsDataSource = employees;

        this.total = total;
      },
      (error) => {
        console.error('Error fetching unplanned competency:', error);
      }
    );
  }

  getAldpFormsById(id: number) {
    const token = sessionStorage.getItem('token');

    this.service.getAldpById(token, id).subscribe(
      (response) => {
        console.log('API Response:', response);

        const results = response?.results || [];

        // Extract the counts from top-level keys
        const pretestCount = response?.pretest_response_count || 0;
        const posttestCount = response?.posttest_response_count || 0;
        const feedbackCount = response?.feedback_response_count || 0;

        // Map each form and assign the correct response count
        this.formsDataSource = results.map((form: any) => {
          let noOfResponse = 0;

          if (form.type === 'Pre-Test') {
            noOfResponse = pretestCount;
          } else if (form.type === 'Post-Test') {
            noOfResponse = posttestCount;
          } else if (form.type === 'Feedback') {
            noOfResponse = feedbackCount;
          }

          return {
            ...form,
            noOfResponse
          };
        });

      },
      (error) => {
        console.error('Error fetching ALDP forms:', error);
      }
    );
  }

  rowClicked(row: any): void {
    const existingTypes = this.formsDataSource.map(f => f.type);
    if (row.noOfResponse === 0) {
      const token = sessionStorage.getItem('token');

      this.service.getFormByFormID(token, row.formID).subscribe({
        next: (response) => {
          const formData = response?.results;

          const dialogRef = this.dialog.open(ViewFormComponent, {
            maxWidth: '100%',
            width: '60%',
            height: '90%',
            disableClose: true,
            data: {
              apID: this.apID,
              formType: row.type,
              formData: formData,
              formId: row.formID,
              usedFormTypes: existingTypes
            }
          });

          dialogRef.afterClosed().subscribe(() => {
            // 🔁 Refresh data after closing the dialog
            this.getAldpFormsById(this.apID);
            this.getFormNtpById(this.apcID);
            this.getFormRegisterById(this.apcID);
          });

          console.log('Passing formId to dialog:', row.formId);
        },
        error: (err) => {
          console.error('Failed to fetch form by formID:', err);
        }
      });
    } else {
      console.log(`Cannot edit "${row.type}" because it already has responses.`);
    }
  }

  generateNtp(): void {
    const token = sessionStorage.getItem('token');

    this.service.getDetailsForGenerateNTP(token, this.apcID).subscribe({
      next: (response) => {
        const formData = response?.results;

        const dialogRef = this.dialog.open(GenerateNtpComponent, {
          maxWidth: '100%',
          width: '70%',
          height: '90%',
          disableClose: true,
          data: {
            apID: this.apID,
            apcID: this.apcID,
            dateFrom: this.fromDate,
            dateTo: this.toDate,
            programName: this.programName,
            formData: formData,
          }
        });

        dialogRef.afterClosed().subscribe(() => {
          // 🔁 Call methods after dialog closes
          this.getAldpFormsById(this.apID);
          this.getFormNtpById(this.apcID);
          this.getFormRegisterById(this.apcID);
        });

        console.log('Passing data to dialog:', formData);
      },
      error: (err) => {
        console.error('Failed to fetch form by formID:', err);
      }
    });
  }

  add() {
    const existingTypes = this.formsDataSource.map(f => f.type);
    this.dialog.open(CreateFormComponent,
      {
        maxWidth: '100%',
        width: '60%',
        height: '90%',
        disableClose: true,
        data: {
          apID: this.apID,
          usedFormTypes: existingTypes
        }
      }
    ).afterClosed().subscribe(
      data => {
        this.getAldpFormsById(this.apID);
        this.getFormNtpById(this.apcID);
        this.getFormRegisterById(this.apcID);
      }
    )
  }


  getResponseById(id: number, type: string) {
    const token = sessionStorage.getItem('token');

    if (!token) {
      console.error('No token found in sessionStorage.');
      return;
    }

    this.service.getResponseById(token, id, type).subscribe(
      (response) => {
        console.log('API Response:', response);

        const employees = Array.isArray(response?.results) ? response.results : [];
        this.responseDataSource.data = employees;

        // Optional: format date if needed
        this.responseDataSource.data = this.responseDataSource.data.map((e: any) => ({
          ...e,
          dateAnswered: new Date(e.dateAnswered).toLocaleDateString(),
        }));

        // Bind paginator and sort after assigning data
        this.responseDataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('Error fetching response data:', error);
        this.responseDataSource.data = [];
      }
    );
  }

  onTabChange(event: MatTabChangeEvent) {
    const index = event.index;
    const formType = this.tabTypes[index];
    if (this.apID && formType) {
      this.getResponseById(this.apID, formType);
    }
  }

  getFormNtpById(id: number) {
    const token = sessionStorage.getItem('token');

    if (!token) {
      console.error('No token found in sessionStorage.');
      return;
    }

    this.service.getFormNtpById(token, id).subscribe(
      (response) => {
        console.log('API Response:', response);

        const rawResults = response?.results;
        const employees = Array.isArray(rawResults?.[0]) ? rawResults[0] : [];

        this.ntpDataSource.data = employees.map((e: any) => ({
          ...e,
          date_of_filling_out: new Date(e.date_of_filling_out).toLocaleDateString(),
          approved_date: new Date(e.approved_date).toLocaleDateString(),
          due_date: new Date(e.due_date).toLocaleDateString(),
        }));

        this.ntpDataSource.paginator = this.paginator;

        // ✅ Set flag depending on whether NTP exists
        this.ntpExists = employees.length > 0;
      },
      (error) => {
        console.error('Error fetching response data:', error);
        this.ntpDataSource.data = [];
        this.ntpExists = false;
      }
    );
  }

  getFormRegisterById(id: number) {
    const token = sessionStorage.getItem('token');

    if (!token) {
      console.error('No token found in sessionStorage.');
      return;
    }

    this.service.getFormRegisterById(token, id).subscribe(
      (response) => {
        console.log('API Response:', response);

        const rawResults = response?.results;
        const employees = Array.isArray(rawResults?.[0]) ? rawResults[0] : [];

        this.registrationDataSource.data = employees.map((e: any) => ({
          ...e,
          date_of_filling_out: new Date(e.date_of_filling_out).toLocaleDateString(),
          approved_date: new Date(e.approved_date).toLocaleDateString(),
          due_date: new Date(e.due_date).toLocaleDateString(),
        }));

        this.registrationDataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('Error fetching response data:', error);
        this.registrationDataSource.data = [];
      }
    );
  }

}
