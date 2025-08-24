import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
import { FeaturesService } from '../../../features.service';
import { ViewRequestCertificateComponent } from '../view-request-certificate/view-request-certificate.component';
import { ViewEmployeeCertificateComponent } from './view-employee-certificate/view-employee-certificate.component';

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
  empID: number;
  certID: number;
  programName: string;
  description: string;
  trainingprovider: string;
  type: string;
  cert_status: string;
  filename: string;
  startDate: string;
  endDate: string;       
  pdf_content: {
    type: string;
    data: number[];  
  };
  createdOn: string;     
  remarks: string | null;
}

@Component({
  selector: 'app-employee-certificate',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule, MatTabsModule
  ],
  templateUrl: './employee-certificate.component.html',
  styleUrl: './employee-certificate.component.scss'
})
export class EmployeeCertificateComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageNo: number = 1;
  pageSize: number = 5;
  keyword: string = '';
  total: number = 0;
  employee_id: number = 0;
  employeeDataSource: employeesCertificate[] = []
  requestDataSource: requestCertificate[] = []
  displayedEmployeesColumns: string[] = ['fullName', 'gender', 'position', 'employmentStat'];
  displayedRequestColumns: string[] = ['programName', 'description', 'trainingprovider', 'type', 'cert_status'];

  constructor(private route: ActivatedRoute, private dialog: MatDialog, private service: FeaturesService) {

  }

  ngOnInit(): void {
    const isBrowser = typeof window !== 'undefined';

    const idFromQuery = this.route.snapshot.queryParams['id'];
    let idFromSession: string | null = null;

    if (isBrowser) {
      idFromSession = sessionStorage.getItem('selectedEmployeeId');
    }

    if (idFromQuery) {
      this.employee_id = +idFromQuery;
    } else if (idFromSession) {
      this.employee_id = +idFromSession;
    }

    if (!this.employee_id || isNaN(this.employee_id)) {
      console.error('Training provider ID not found in query params or sessionStorage');
      // Optional: Redirect back to the list page
      return;
    }
    this.getEmployeeCertificates(this.employee_id)
  }

  getEmployeeCertificates(id: number): void {
    const jwt = sessionStorage.getItem('token');
    if (!jwt) {
      console.error('JWT token is missing');
      return;
    }

    this.service.getEmployeeCertificateById(id, jwt).subscribe({
      next: (res: any) => {
        const certificates = res?.[0];
        if (Array.isArray(certificates) && certificates.length > 0) {
          this.requestDataSource = certificates;
        } else {
          console.error('Employee Certificates data not found in response:', res);
        }
      },
      error: (error) => {
        console.error('Error fetching training provider details:', error);
      }
    });
  }

  onPaginateChange(event: PageEvent) {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getEmployeeCertificates(this.employee_id)
  }

  viewRequestCertificate(row: requestCertificate) {
    console.log('row data:', row)
    this.dialog.open(ViewEmployeeCertificateComponent, {
      data: row,
      maxWidth: '100%',
      width: '60%',
      height: '75%',
      disableClose: true
    }).afterClosed().subscribe(() => {
      this.getEmployeeCertificates(this.employee_id)
    });
  }
}
