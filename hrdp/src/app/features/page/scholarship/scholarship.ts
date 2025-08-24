import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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

// Service
import { ScholarshipService } from './scholarship-service';
import { UploadScholarship } from './components/upload-scholarship/upload-scholarship';
import { ViewScholarship } from './components/view-scholarship/view-scholarship';
import { ViewDeliberation } from './components/view-deliberation/view-deliberation';
import { UploadContract } from './components/upload-contract/upload-contract';

@Component({
  selector: 'app-scholarship',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule, MatTabsModule
  ],
  templateUrl: './scholarship.html',
  styleUrl: './scholarship.scss'
})
export class Scholarship {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageNo: number = 1;
  pageSize: number = 5;
  keyword: string = '';
  total: number = 0;
  columnDefs = [
    { key: 'title', label: 'Scholarship Title' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Scholarship Status' },
    { key: 'filename', label: 'File Name' }
  ];

  columnDefsEmployeeApplications = [
    { key: 'scholarshipTitle', label: 'Scholarship Title' },
    { key: 'date', label: 'Date' },
    { key: 'scholarshipOrigin', label: 'Scholarship Origin' },
    { key: 'schoolYearStart', label: 'School Year Start' },
    { key: 'schoolYearEnd', label: 'School Year End' },
  ];

  columnDefsContracts = [
    { key: 'scholarshipTitle', label: 'Scholarship Title' },
    { key: 'date', label: 'Contract Date' },
  ]

  displayedColumns = this.columnDefs.map(col => col.key);
  displayedContractColumns = this.columnDefsContracts.map(col => col.key);
  displayedColumnsEmployeeApplications = this.columnDefsEmployeeApplications.map(col => col.key);
  localDataSource = new MatTableDataSource<any>([]);
  foreignDataSource = new MatTableDataSource<any>([]);
  contractDataSource = new MatTableDataSource<any>([]);
  employeeApplicationsDataSource = new MatTableDataSource<any>([]);
  constructor(private dialog: MatDialog,
    private service: ScholarshipService,) {
  }

  ngOnInit(): void {
    this.getAllScholarship(this.pageNo, this.pageSize, this.keyword)
  }

  getAllScholarship(pageNo: number, pageSize: number, keyword: string) {
    const token = sessionStorage.getItem('token');

    // Commented out actual service call
    /*
    this.service.getAllScholarships(pageNo, pageSize, keyword, token).subscribe(
      (response) => {
        const scholarship = response?.data || [];
        const total = response?.total || 0;

        this.localDataSource.data = scholarship;
        this.total = total;
      },
      (error) => {
        console.error('Error fetching scholarships:', error);
      }
    );
    */

    // Mock data instead
    const mockScholarships = [
      { title: 'Science and Tech Grant', category: 'Science', status: 'enabled', filename: 'science_grant.pdf' },
      { title: 'Arts Excellence Award', category: 'Arts', status: 'enabled', filename: 'arts_award.docx' },
      { title: 'Science and Tech Grant', category: 'Science', status: 'enabled', filename: 'sports_scholarship.pdf' },
      { title: 'Science and Tech Grant', category: 'Science', status: 'enabled', filename: 'engg_merit.pdf' },
      { title: 'Medical Assistance Fund', category: 'Medicine', status: 'enabled', filename: 'medical_fund.doc' }
    ];
    
    this.loadMockEmployeeApplications();
    this.loadMockContracts();
    this.localDataSource.data = mockScholarships;
    this.total = mockScholarships.length;
  }

  loadMockContracts() {
    const mockApplications = [
            {
        scholarshipTitle: 'Science and Tech Grant',
        date: '2025-06-01',
      },
      {
        scholarshipTitle: 'Medical Assistance Fund',
        date: '2025-06-05',
      },
      {
        scholarshipTitle: 'Science and Tech Grant',
        date: '2025-06-10',
      },
    ]
    this.contractDataSource.data = mockApplications;
  }

  loadMockEmployeeApplications() {
    const mockApplications = [
      {
        scholarshipTitle: 'Science and Tech Grant',
        date: '2025-06-01',
        scholarshipOrigin: 'Local',
        schoolYearStart: '2025',
        schoolYearEnd: '2026',
      },
      {
        scholarshipTitle: 'Science and Tech Grant',
        date: '2025-06-05',
        scholarshipOrigin: 'Local',
        schoolYearStart: '2025',
        schoolYearEnd: '2027',
      },
      {
        scholarshipTitle: 'Science and Tech Grant',
        date: '2025-06-10',
        scholarshipOrigin: 'Foreign',
        schoolYearStart: '2025',
        schoolYearEnd: '2026',
      },
      {
        scholarshipTitle: 'Science and Tech Grant',
        date: '2025-06-12',
        scholarshipOrigin: 'Local',
        schoolYearStart: '2025',
        schoolYearEnd: '2026',
      },
      {
        scholarshipTitle: 'Science and Tech Grant',
        date: '2025-06-15',
        scholarshipOrigin: 'Local',
        schoolYearStart: '2025',
        schoolYearEnd: '2027',
      }
    ];
    this.employeeApplicationsDataSource.data = mockApplications;
  }

  viewScholarshipDeliberation(row: any) {
    console.log('row data:', row) 
    this.dialog.open(ViewDeliberation,
      { 
        data: row,
        maxWidth: '100%',
        width: '80%',
        height: '90%',
        disableClose: true
      }
    ).afterClosed().subscribe(() => {
      this.getAllScholarship(this.pageNo, this.pageSize, this.keyword)
    })
  }

  onPaginateChange(event: PageEvent) {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getAllScholarship(this.pageNo, this.pageSize, this.keyword);
  }

  uploadScholarship() {
    this.dialog.open(UploadScholarship,
      {
        maxWidth: '100%',
        width: '60%',
        height: '60%',
        disableClose: true
      }
    ).afterClosed().subscribe(() => {
      this.getAllScholarship(this.pageNo, this.pageSize, this.keyword)
    })
  }

  uploadContract() {
    this.dialog.open(UploadContract,
      {
        maxWidth: '100%',
        width: '60%',
        height: '60%',
        disableClose: true
      }
    ).afterClosed().subscribe(() => {
      this.getAllScholarship(this.pageNo, this.pageSize, this.keyword)
    })
  }

  viewScholarship(row: any) {
    console.log('row data:', row)
    this.dialog.open(ViewScholarship,
      {
        data: row,
        maxWidth: '100%',
        width: '60%',
        height: '60%',
        disableClose: true
      }
    ).afterClosed().subscribe(() => {
      this.getAllScholarship(this.pageNo, this.pageSize, this.keyword)
    })
  }

}
