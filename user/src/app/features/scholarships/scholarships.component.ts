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
import { MatRadioModule } from '@angular/material/radio';

// Component
import { ApplyScholarshipComponent } from './components/apply-scholarship/apply-scholarship.component';
import { ViewApplicationComponent } from './components/view-application/view-application.component';
import { UploadDocumentsComponent } from './components/upload-documents/upload-documents.component';

@Component({
  selector: 'app-scholarships',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule, MatTabsModule, MatRadioModule
  ],
  templateUrl: './scholarships.component.html',
  styleUrl: './scholarships.component.scss'
})
export class ScholarshipsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageNo: number = 1;
  pageSize: number = 5;
  keyword: string = '';
  total: number = 0;
  dataSource: any[] = [];
  userApplicationDataSource: any[] = [];
  documentsDataSource: any[] = [];
  displayedColumns: string[] = ['select', 'programName', 'description', 'status'];
displayedUserApplication: string[] = [
  'fullName', 'sex', 'dateOfBirth', 'age', 'position', 'division'
];
  displayedDocuments: string[] = ['type', 'date'];
  selectedRow: any | null = null;

  constructor(private router: Router, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getAllUserScholarships();
    this.listUserApplications();
  }

  selectRow(row: any) {
    this.selectedRow = row;
  }

  getAllUserScholarships(): void {
    // Mock data
    const mockData: any[] = [
      {
        pprogID: 1,
        programName: 'STEM Scholarship',
        description: 'Scholarship for STEM courses.',
        status: 'Active'
      },
      {
        pprogID: 2,
        programName: 'Arts and Humanities Grant',
        description: 'Support for students in arts and humanities.',
        status: 'Closed'
      },
      {
        pprogID: 3,
        programName: 'Engineering Excellence Program',
        description: 'For top engineering students.',
        status: 'Active'
      },
      {
        pprogID: 4,
        programName: 'Medical Scholars Initiative',
        description: 'Grant for medical school tuition.',
        status: 'Pending'
      },
      {
        pprogID: 5,
        programName: 'Law School Scholarship',
        description: 'Scholarship for aspiring lawyers.',
        status: 'Active'
      }
    ];

    // Set data
    this.dataSource = mockData;
    this.total = mockData.length;
  }

  getAllDocuments(): void {
    // Mock data
    const mockData: any[] = [
      {
        type: 'Registration Form',
        date: '2024-08-11'
      },
      {
        type: 'First Quarter Grade',
        date: '2025-11-10'
      },
      {
        type: 'Second Quarter Grade',
        date: '2025-01-01'
      },
      {
        type: 'Third Quarter Grade',
        date: '2025-04-05'
      },
      {
        type: 'Fourth Quarter Grade',
        date: '2025-06-10'
      }
    ];

    // Set data
    this.dataSource = mockData;
    this.total = mockData.length;
  }

  listUserApplications(): void {
    const mockApplications = [
      {
        fullName: 'Maria Santos',
        sex: 'Female',
        dateOfBirth: new Date('1988-07-22'),
        age: 35,
        position: 'Research Assistant',
        division: 'Physics Department',
        office: 'Main Office',
        mobile: '09171234567',
        residence: 'Quezon City',
        email: 'maria.santos@example.com',
        mailingAddress: 'PO Box 123',
        presentDuties: 'Data analysis and reporting',
        period: '2018-2023',
        previousPosition: 'Analyst',
        agency: 'DOST',
        institution: 'UP Diliman',
        yearGraduated: 2012,
        degree: 'BS Physics',
        scholarshipReceived: 'Cum Laude',
        fieldOfStudy: 'Bachelor of Science',
        preferredSchool: 'UP',
        otherPreferredSchool: '',
        option: 'Thesis',
        scholarshipType: 'Full-time',
        otherScholarship: ''
      }
    ];

    console.log('User Applications:', mockApplications);
    // Set data
    this.userApplicationDataSource = mockApplications;
  }

  onPaginateChange(event: PageEvent) {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getAllUserScholarships();
  }

  applyScholarship() {
    if (this.selectedRow) {
      this.dialog.open(ApplyScholarshipComponent, {
        maxWidth: '100%',
        width: '60%',
        height: '80%',
        disableClose: true,
        data: this.selectedRow
      });
    }
  }

  uploadDocument() {
    this.dialog.open(UploadDocumentsComponent, {
      maxWidth: '100%',
      width: '60%',
      height: '60%',
      disableClose: true,
      data: this.selectedRow
    });
  }

  viewAppliedScholarship(row: any) {
    console.log('row', row)
    this.dialog.open(ViewApplicationComponent, {
      maxWidth: '100%',
      width: '60%',
      height: '80%',
      disableClose: true,
      data: row
    });
  }

  details(row: any) {
    sessionStorage.setItem('selectedProviderProgramId', row.pprogID.toString());
    this.router.navigate(['admin/training-programs/details']);
  }

}
