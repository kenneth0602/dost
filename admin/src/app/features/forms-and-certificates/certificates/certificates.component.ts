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

// Service
import { FeaturesService } from '../../features.service';
import { ViewRequestCertificateComponent } from './view-request-certificate/view-request-certificate.component';

interface employeesCertificate {
  empID: number,
  position: string,
  employeeNo: number,
  lastName: string,
  firstName: string,
  gender: string,
  employmentStat: string
}

interface requestCertificate {
  empID: number,
  lastname: string,
  firstname: string,
  certID: number,
  programName: string,
  description: string,
  trainingprovider: string,
  type: string,
  cert_status: string,
  filename: string
}

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule, MatTabsModule
  ],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss'
})
export class CertificatesComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageNo: number = 1;
  pageSize: number = 5;
  keyword: string = '';
  total: number = 0;
  employeeDataSource: employeesCertificate[] = []
  requestDataSource: requestCertificate[] = []
  displayedEmployeesColumns: string[] = ['fullName', 'gender', 'position', 'employmentStat'];
  displayedRequestColumns: string[] = ['programName', 'description', 'trainingprovider', 'type', 'cert_status'];

  constructor(private dialog: MatDialog, private service: FeaturesService, private router: Router) {

  }

  ngOnInit(): void {
    this.getAllEmployeesCert(this.pageNo, this.pageSize, this.keyword)
    this.getAllRequestCert(this.pageNo, this.pageSize, this.keyword)
  }

  getAllEmployeesCert(pageNo: number, pageSize: number, keyword: string) {
    const token = sessionStorage.getItem('token');

    this.service.getAllEmployeesCertificates(token, pageNo, keyword, pageSize).subscribe(
      (response) => {
        console.log('API Response:', response);
        const employees = response?.results?.[0] || [];
        const total = response?.results?.[1]?.[0]?.total || 0;

        this.employeeDataSource = employees;

        this.total = total;
      },
      (error) => {
        console.error('Error fetching unplanned competency:', error);
      }
    );
  }

  getAllRequestCert(pageNo: number, pageSize: number, keyword: string) {
    const token = sessionStorage.getItem('token');

    this.service.getAllRequestCertificates(token, pageNo, keyword, pageSize).subscribe(
      (response) => {
        console.log('API Response:', response);
        const request = response?.results?.[0] || [];
        const total = response?.results?.[1]?.[0]?.total || 0;

        this.requestDataSource = request;

        this.total = total;
      },
      (error) => {
        console.error('Error fetching unplanned competency:', error);
      }
    );
  }

  onPaginateChange(event: PageEvent) {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getAllEmployeesCert(this.pageNo, this.pageSize, this.keyword)
    this.getAllRequestCert(this.pageNo, this.pageSize, this.keyword)
  }

  viewRequestCertificate(row: requestCertificate) {
    console.log('row data:', row)
    this.dialog.open(ViewRequestCertificateComponent, {
      data: row,
      maxWidth: '100%',
      width: '60%',
      height: '75%',
      disableClose: true
    }).afterClosed().subscribe(() => {
    this.getAllEmployeesCert(this.pageNo, this.pageSize, this.keyword)
    this.getAllRequestCert(this.pageNo, this.pageSize, this.keyword)
    });
  }

  viewEmployeeCertificates(row: employeesCertificate) {
    sessionStorage.setItem('selectedEmployeeId', row.empID.toString());
    this.router.navigate(['admin/forms-and-certificates/certificates/employee-certificates']);
  }
}
