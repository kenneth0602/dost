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
import { ScholarshipService } from './scholarship.service';
import { ViewScholarshipComponent } from './components/view-scholarship/view-scholarship.component';
import { ViewEmployeeApplicationComponent } from './components/view-employee-application/view-employee-application.component';


@Component({
  selector: 'app-scholarship',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule, MatTabsModule
  ],
  templateUrl: './scholarship.component.html',
  styleUrl: './scholarship.component.scss'
})
export class ScholarshipComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageNo: number = 1;
  pageSize: number = 5;
  keyword: string = '';
  total: number = 0;
  columnDefs = [
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'title', label: 'Scholarship Title' },
    { key: 'category', label: 'Category' },
    { key: 'filename', label: 'File Name' },
    { key: 'supervisor', label: 'Supervisor'},
    { key: 'status', label: 'Scholarship Status' },
  ];

  columnDefsEmployeeApplications = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'sex', label: 'Sex' },
    { key: 'dateOfBirth', label: 'Date of Birth' },
    { key: 'age', label: 'Age' },
    { key: 'position', label: 'Position' },
    { key: 'division', label: 'Division' }
  ];


  displayedColumns = this.columnDefs.map(col => col.key);
  displayedColumnsEmployeeApplications = this.columnDefsEmployeeApplications.map(col => col.key);
  localDataSource = new MatTableDataSource<any>([]);
  foreignDataSource = new MatTableDataSource<any>([]);
  employeeApplicationsDataSource = new MatTableDataSource<any>([]);

  constructor(private dialog: MatDialog,
    private service: ScholarshipService,) {

  }

  ngOnInit(): void {
    this.getAllScholarship(this.pageNo, this.pageSize, this.keyword)
    this.getAllEligibleEmployee(this.pageNo, this.pageSize, this.keyword)
  }

  getAllScholarship(pageNo: number, pageSize: number, keyword: string) {
    const token = sessionStorage.getItem('token');

    // Uncomment this when ready to call API
    // this.service.getAllScholarships(pageNo, pageSize, keyword, token).subscribe(
    //   (response) => {
    //     const scholarship = response?.data || [];
    //     const total = response?.total || 0;
    //     this.localDataSource.data = scholarship;
    //     this.total = total;
    //   },
    //   (error) => {
    //     console.error('Error fetching scholarships:', error);
    //     this.loadMockScholarships();
    //   }
    // );
    // this.loadMockScholarships();
    this.loadMockEmployeeApplications();
  }

  getAllEligibleEmployee(pageNo: number, pageSize: number, keyword: string) {
    const token = sessionStorage.getItem('token');

    // Commented out actual service call
    this.service.getEligibleEMployees(pageNo, pageSize, keyword, token).subscribe(
      (response) => {
        const eligible = response?.data || [];
        const total = response?.total || 0;

        this.localDataSource.data = eligible;
        this.total = total;
      },
      (error) => {
        console.error('Error fetching scholarships:', error);
      }
    );

  }

  loadMockEmployeeApplications() {
    const mockApplications = [
      {
        fullName: 'Carlos Reyes',
        sex: 'Male',
        dateOfBirth: new Date('1990-01-15'),
        age: 35,
        position: 'Researcher I',
        division: 'Materials Science',
        office: 'Main Office',
        mobile: '09171234567',
        residence: 'Quezon City',
        email: 'carlos.reyes@example.com',
        mailingAddress: 'PO Box 123',
        presentDuties: 'Research and data analysis',
        period: '2019-2024',
        previousPosition: 'Assistant Researcher',
        agency: 'DOST',
        institution: 'UP Diliman',
        yearGraduated: 2012,
        degree: 'BS Materials Science',
        scholarshipReceived: 'Cum Laude',
        fieldOfStudy: 'Bachelor of Science',
        preferredSchool: 'UP',
        otherPreferredSchool: '',
        option: 'Thesis',
        scholarshipType: 'Full-time',
        otherScholarship: ''
      },
      {
        fullName: 'Liza Gomez',
        sex: 'Female',
        dateOfBirth: new Date('1988-07-22'),
        age: 36,
        position: 'Engineer II',
        division: 'Mechanical',
        office: 'Engineering Office',
        mobile: '09181234567',
        residence: 'Makati City',
        email: 'liza.gomez@example.com',
        mailingAddress: 'PO Box 456',
        presentDuties: 'Project planning and execution',
        period: '2015-2022',
        previousPosition: 'Junior Engineer',
        agency: 'DPWH',
        institution: 'DLSU',
        yearGraduated: 2010,
        degree: 'BS Mechanical Engineering',
        scholarshipReceived: 'Magna Cum Laude',
        fieldOfStudy: 'Bachelor of Science',
        preferredSchool: 'DLSU',
        otherPreferredSchool: '',
        option: 'Non-thesis',
        scholarshipType: 'Part-time',
        otherScholarship: ''
      },
      {
        fullName: 'Ana Lopez',
        sex: 'Female',
        dateOfBirth: new Date('1992-11-05'),
        age: 32,
        position: 'Lab Technician',
        division: 'Chemical Analysis',
        office: 'Chemistry Lab',
        mobile: '09192223344',
        residence: 'Taguig City',
        email: 'ana.lopez@example.com',
        mailingAddress: 'PO Box 789',
        presentDuties: 'Sample preparation and testing',
        period: '2017-2023',
        previousPosition: 'Lab Assistant',
        agency: 'FDA',
        institution: 'UST',
        yearGraduated: 2014,
        degree: 'BS Chemistry',
        scholarshipReceived: '',
        fieldOfStudy: 'Bachelor of Science',
        preferredSchool: 'UST',
        otherPreferredSchool: '',
        option: 'Thesis',
        scholarshipType: 'Full-time',
        otherScholarship: ''
      },
      {
        fullName: 'Marco Villanueva',
        sex: 'Male',
        dateOfBirth: new Date('1985-03-18'),
        age: 40,
        position: 'Research Assistant',
        division: 'Bio Research',
        office: 'Biology Department',
        mobile: '09223334455',
        residence: 'Pasig City',
        email: 'marco.villanueva@example.com',
        mailingAddress: 'PO Box 321',
        presentDuties: 'Field data gathering',
        period: '2020-2025',
        previousPosition: 'Field Technician',
        agency: 'DENR',
        institution: 'UP Los Baños',
        yearGraduated: 2007,
        degree: 'BS Biology',
        scholarshipReceived: '',
        fieldOfStudy: 'Bachelor of Science',
        preferredSchool: 'UP',
        otherPreferredSchool: '',
        option: 'Thesis',
        scholarshipType: 'Full-time',
        otherScholarship: ''
      },
      {
        fullName: 'Kristine Mendoza',
        sex: 'Female',
        dateOfBirth: new Date('1995-05-10'),
        age: 30,
        position: 'Programmer',
        division: 'IT',
        office: 'IT Department',
        mobile: '09175556677',
        residence: 'Mandaluyong City',
        email: 'kristine.mendoza@example.com',
        mailingAddress: 'PO Box 654',
        presentDuties: 'Software development',
        period: '2016-2024',
        previousPosition: 'Junior Developer',
        agency: 'DICT',
        institution: 'ADMU',
        yearGraduated: 2015,
        degree: 'BS Computer Science',
        scholarshipReceived: 'Dean’s Lister',
        fieldOfStudy: 'Bachelor of Science',
        preferredSchool: 'ADMU',
        otherPreferredSchool: '',
        option: 'Non-thesis',
        scholarshipType: 'Part-time',
        otherScholarship: ''
      }
    ];

    this.employeeApplicationsDataSource.data = mockApplications;
  }


  loadMockScholarships() {
    const mockScholarships = [
      { employeeName: 'Juan Dela Cruz', title: 'DOST-SEI Merit Scholarship', category: 'Undergraduate', status: 'Open', filename: 'sei_merit_scholarship.pdf' },
      { employeeName: 'Maria Santos', title: 'RA 7687 Science & Technology Scholarship', category: 'Undergraduate', status: 'Open', filename: 'ra7687_st_scholarship.pdf' },
      { employeeName: 'Jose Rizal', title: 'Junior Level Science Scholarship', category: 'Undergraduate - JLSS', status: 'Open', filename: 'jlss_scholarship.pdf' },
      { employeeName: 'Andres Bonifacio', title: 'ASTHRDP Graduate Scholarship', category: 'Graduate', status: 'Open', filename: 'asthrdp_graduate_scholarship.pdf' },
      { employeeName: 'Emilio Aguinaldo', title: 'ERDT Engineering Graduate Program', category: 'Graduate', status: 'Open', filename: 'erdt_engineering_program.pdf' }
    ];
    this.localDataSource.data = mockScholarships;
    this.total = mockScholarships.length;
  }

  onPaginateChange(event: PageEvent) {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getAllScholarship(this.pageNo, this.pageSize, this.keyword);
  }

  viewScholarship(row: any) {
    console.log('row data:', row)
    this.dialog.open(ViewScholarshipComponent,
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

  viewScholarshipApplication(row: any) {
    console.log('row data:', row)
    this.dialog.open(ViewEmployeeApplicationComponent,
      {
        data: row,
        maxWidth: '100%',
        width: '60%',
        height: '80%',
        disableClose: true
      }
    ).afterClosed().subscribe(() => {
      this.getAllScholarship(this.pageNo, this.pageSize, this.keyword)
    })
  }

}
