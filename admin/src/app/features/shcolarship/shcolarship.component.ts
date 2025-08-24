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
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CriteriaResult, Signatories } from './selection-criteria/selection-criteria.component';

import { SharedService } from '../../shared/shared.service';
import { ScholarshipService } from './scholarship.service';
import { ViewGeneratedPdfComponent } from './view-generated-pdf/view-generated-pdf.component';
import { ViewEmployeeApplicationComponent } from './view-employee-application/view-employee-application.component';
import { UploadScholarshipComponent } from './upload-scholarship/upload-scholarship.component';
import { ViewScholarshipComponent } from './view-scholarship/view-scholarship.component';
import { SelectionCriteriaComponent } from './selection-criteria/selection-criteria.component';
import { ScholarshipSignatoriesComponent } from './scholarship-signatories/scholarship-signatories.component';

@Component({
  selector: 'app-shcolarship',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule, MatTabsModule, MatCheckboxModule
  ],
  templateUrl: './shcolarship.component.html',
  styleUrl: './shcolarship.component.scss'
})
export class ShcolarshipComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  activeTab: string = 'Available Scholarships';
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
  ddisplayedColumnsEmployeeApplications = ['select', ...this.columnDefsEmployeeApplications.map(col => col.key)];
  displayedColumnsDeliberation = this.columnsDefsDeliberation.map(col => col.key);
  displayedColumnsContracts = this.columnDefsContracts.map(col => col.key);
  localDataSource = new MatTableDataSource<any>([]);
  scholarshipData: any[] = [];
  employeeApplicationsDataSource = new MatTableDataSource<any>([]);
  contractDataSource = new MatTableDataSource<any>([]);
  deliberationDataSource = new MatTableDataSource<any>([]);
  selectionEndorsed = new SelectionModel<any>(false, []);

  constructor(private dialog: MatDialog,
    private service: ScholarshipService,) {

  }

  ngAfterViewInit() {
    this.localDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getAllScholarship(this.pageNo, this.pageSize, this.keyword)

    // 👇 Mock deliberation data
    const deliberationMockData = [
      {
        scholarshipTitle: 'Science and Tech Grant',
        date: '2025-02-15',
        scholarshipOrigin: 'Department of Science and Technology',
        schoolYearStart: '2025',
        schoolYearEnd: '2026',
      },
      {
        scholarshipTitle: 'Arts and Culture Scholarship',
        date: '2025-03-01',
        scholarshipOrigin: 'National Commission for Culture',
        schoolYearStart: '2025',
        schoolYearEnd: '2026',
      },
      {
        scholarshipTitle: 'Overseas Graduate Program',
        date: '2025-04-10',
        scholarshipOrigin: 'CHED',
        schoolYearStart: '2025',
        schoolYearEnd: '2027',
      },
      {
        scholarshipTitle: 'Engineering Excellence Award',
        date: '2025-05-20',
        scholarshipOrigin: 'Private Corporation',
        schoolYearStart: '2025',
        schoolYearEnd: '2026',
      }
    ];

    this.deliberationDataSource = new MatTableDataSource<any>(deliberationMockData);

    // 👇 Mock employee applications
    const employeeApplicationsMock = [
      {
        fullName: 'Juan Dela Cruz',
        sex: 'Male',
        dateOfBirth: '1998-07-12',
        age: 27,
        position: 'IT Specialist',
        division: 'Information Technology',
        scholarshipTitle: 'Science and Tech Grant',
      },
      {
        fullName: 'Maria Santos',
        sex: 'Female',
        dateOfBirth: '1999-03-05',
        age: 26,
        position: 'HR Officer',
        division: 'Human Resources',
        scholarshipTitle: 'Arts and Culture Scholarship',
      },
      {
        fullName: 'Pedro Garcia',
        sex: 'Male',
        dateOfBirth: '1997-11-20',
        age: 28,
        position: 'Engineer',
        division: 'Engineering',
        scholarshipTitle: 'Engineering Excellence Award',
      }
    ];
    this.employeeApplicationsDataSource = new MatTableDataSource<any>(employeeApplicationsMock);

    // 👇 Mock endorsed employees (subset of applicants, endorsed by deliberation)
    const endorsedEmployeesMock = [
      {
        fullName: 'Juan Dela Cruz',
        scholarshipTitle: 'Science and Tech Grant',
        endorsedDate: '2025-02-20',
        remarks: 'Strong academic background, highly recommended'
      },
      {
        fullName: 'Pedro Garcia',
        scholarshipTitle: 'Engineering Excellence Award',
        endorsedDate: '2025-05-25',
        remarks: 'Top performer in engineering division'
      }
    ];
    // You can add another datasource if you want a separate table
    this.localDataSource = new MatTableDataSource<any>(endorsedEmployeesMock);
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

  onTabChange(ev: MatTabChangeEvent) {
  this.activeTab = ev.tab.textLabel; // keeps a current tab if you need it elsewhere
}

// Toggle one row only
selectSingleEndorsed(row: any) {
  if (this.selectionEndorsed.isSelected(row)) {
    this.selectionEndorsed.clear();            // optional: allow deselect
  } else {
    this.selectionEndorsed.clear();            // ensure only one
    this.selectionEndorsed.select(row);
  }
}

onRowClick(row: any, tab?: string) {
  const which = tab || this.activeTab;

  switch (which) {
    case 'Available Scholarships':
      this.viewScholarship(row);
      break;

    case 'Endorsed Employees':
      // If you have a dedicated view for endorsed employees, call it here.
      // Otherwise reuse the application viewer:
      this.viewScholarshipApplication(row);
      break;

    default:
      // no-op or log
      break;
  }
}

  onPaginateChange(event: PageEvent) {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getAllScholarship(this.pageNo, this.pageSize, this.keyword);
  }

  uploadScholarship() {
    this.dialog.open(UploadScholarshipComponent,
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
    this.dialog.open(ViewScholarshipComponent,
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
    this.dialog.open(ViewEmployeeApplicationComponent,
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

openCriteriaAndGenerate() {
  const selected = this.selectionEndorsed?.selected?.[0];
  if (!selected) {
    console.warn('Please select one endorsed employee first.');
    return;
  }

  // 1) Criteria first
  const ref1 = this.dialog.open(SelectionCriteriaComponent, {
    width: '560px',
    data: { employee: selected },
    disableClose: true
  });

  ref1.afterClosed().subscribe((criteria: CriteriaResult | undefined) => {
    if (!criteria) return;

    // 2) Signatories next
    const ref2 = this.dialog.open<ScholarshipSignatoriesComponent, Partial<Signatories>, Signatories>(
      ScholarshipSignatoriesComponent,
      { width: '720px', disableClose: true }
    );

    ref2.afterClosed().subscribe((signatories?: Signatories) => {
      if (!signatories) return;

      const titleToFilter = selected.scholarshipTitle ?? 'Evaluation';
      const payload = [{ ...selected, criteria }];

      this.service.generateEvaluationSheet(payload, titleToFilter, signatories).then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        this.dialog.open(ViewGeneratedPdfComponent, {
          data: { pdfUrl: blobUrl },
          maxWidth: '90vw',
          width: '90vw',
          height: '90vh',
          enterAnimationDuration: '500ms',
          exitAnimationDuration: '100ms',
        });
      });
    });
  });
}

generateEvaluationSheet() {
  const selected = this.selectionEndorsed?.selected?.[0];
  if (!selected) {
    console.warn('Please select one endorsed employee first.');
    return;
  }

  const titleToFilter = selected.scholarshipTitle ?? 'Selected Endorsed Employee';

  // If your service accepts an array of rows, pass the single selected one:
  const payload = [selected];

  this.service.generateEvaluationSheet(payload, titleToFilter).then(blob => {
    const blobUrl = URL.createObjectURL(blob);
    this.dialog.open(ViewGeneratedPdfComponent, {
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
