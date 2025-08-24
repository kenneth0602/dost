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
import { ViewEmployeeApplication } from './components/view-employee-application/view-employee-application';
import { ViewGeneratedPdf } from './components/view-generated-pdf/view-generated-pdf';

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
    { key: 'fullName', label: 'Full Name' },
    { key: 'sex', label: 'Sex' },
    { key: 'dateOfBirth', label: 'Date of Birth' },
    { key: 'age', label: 'Age' },
    { key: 'position', label: 'Position' },
    { key: 'division', label: 'Division' }
  ];

  columnsDefsDeliberation = [
    { key: 'scholarshipTitle', label: 'Scholarship Title' },
    { key: 'date', label: 'Date' },
    { key: 'scholarshipOrigin', label: 'Scholarship Origin' },
    { key: 'schoolYearStart', label: 'School Year Start' },
    { key: 'schoolYearEnd', label: 'School Year End' },
  ]

  columnDefsContracts = [
    { key: 'scholarshipTitle', label: 'Scholarship Title' },
    { key: 'date', label: 'Contract Date' },
  ]

  displayedColumns = this.columnDefs.map(col => col.key);
  displayedColumnsEmployeeApplications = this.columnDefsEmployeeApplications.map(col => col.key);
  displayedColumnsDeliberation = this.columnsDefsDeliberation.map(col => col.key);
  displayedColumnsContracts = this.columnDefsContracts.map(col => col.key);
  localDataSource = new MatTableDataSource<any>([]);
  scholarshipData: any[] = [];
  employeeApplicationsDataSource = new MatTableDataSource<any>([]);
  contractDataSource = new MatTableDataSource<any>([]);
  deliberationDataSource = new MatTableDataSource<any>([]);

  constructor(private dialog: MatDialog,
    private service: ScholarshipService,) {

  }

  ngAfterViewInit() {
    this.localDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getAllScholarship(this.pageNo, this.pageSize, this.keyword)
  }

  getAllScholarship(pageNo: number, pageSize: number, keyword: string) {
    const token = sessionStorage.getItem('token');

    // Commented out actual service call
    this.service.getAllScholarships(pageNo, pageSize, keyword, token).subscribe(
      (response) => {
        this.scholarshipData = response?.data || [];
        this.total = response?.total || 0;
      },
      (error) => {
        console.error('Error fetching scholarships:', error);
      }
    );

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
        enterAnimationDuration: '500ms',
        exitAnimationDuration: '100ms',
        hasBackdrop: false

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
        enterAnimationDuration: '500ms',
        exitAnimationDuration: '100ms',
        disableClose: true
      }
    ).afterClosed().subscribe(() => {
      this.getAllScholarship(this.pageNo, this.pageSize, this.keyword)
    })
  }

  viewScholarshipApplication(row: any) {
    console.log('row data:', row)
    this.dialog.open(ViewEmployeeApplication,
      {
        data: row,
        maxWidth: '100%',
        width: '60%',
        height: '80%',
        enterAnimationDuration: '500ms',
        exitAnimationDuration: '100ms',
        disableClose: true
      }
    ).afterClosed().subscribe(() => {
      this.getAllScholarship(this.pageNo, this.pageSize, this.keyword)
    })
  }

  generateEvaluationSheet() {
    const titleToFilter = 'Science and Tech Grant';
    const filteredApplications = this.employeeApplicationsDataSource.data.filter(
      app => app.scholarshipTitle === titleToFilter
    );

    this.service.generateEvaluationSheet(filteredApplications, titleToFilter).then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      this.dialog.open(ViewGeneratedPdf, {
        data: { pdfUrl: blobUrl },
        maxWidth: '90vw',
        width: '90vw',
        height: '90vh',
        enterAnimationDuration: '500ms',
        exitAnimationDuration: '100ms',
      });
    });
  }

}
