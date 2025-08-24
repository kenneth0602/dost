import { Component, OnInit, ViewChild } from '@angular/core';
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

// Component
import { AddComponent } from './components/add/add.component';

// Service
import { CertificatesService } from './certificates.service';
import { ViewCertificateComponent } from './components/view-certificate/view-certificate.component';

interface Certificates {
  certID: number,
  programName: string,
  description: string,
  trainingprovider: string,
  type: string,
  startDate: string,
  endDate: string,
  cert_status: string,
  filename: string
}

@Component({
  selector: 'app-certificates',
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule
  ],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss'
})
export class CertificatesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['programName', 'filename', 'description', 'trainingprovider', 'type', 'startDate', 'endDate', 'cert_status'];
  pageNo: number = 1;
  pageSize: number = 5;
  keyword: string = '';
  total: number = 0;
  dataSource: Certificates[] = [];

  constructor(private dialog: MatDialog, private service: CertificatesService) {

  }

  ngOnInit(): void {
    this.getAll(this.pageNo, this.pageSize, this.keyword)
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Verified':
        return 'status-verified';
      case 'For Verification':
        return 'status-pending';
      case 'Rejected':
        return 'status-rejected';
      default:
        return 'status-default';
    }
  }

  getAll(pageNo: number, pageSize: number, keyword: string) {
    const id = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');

    this.service.getAllCertificates(token, pageNo, keyword, pageSize, id).subscribe(
      (response) => {
        console.log('API Response:', response);

        const user_certificates = response?.data || [];
        const total = response?.total?.[0]?.total || 0;

        this.dataSource = user_certificates;
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
    this.getAll(this.pageNo, this.pageSize, this.keyword);
  }

  add() {
    this.dialog.open(AddComponent,
      {
        maxWidth: '100%',
        width: '60%',
        height: '60%',
        disableClose: true
      }
    ).afterClosed().subscribe(() => {
      this.getAll(this.pageNo, this.pageSize, this.keyword)
    })
  }

    viewCertificate(row: Certificates) {
    console.log('row data:', row)
    this.dialog.open(ViewCertificateComponent, {
      data: row,
      maxWidth: '100%',
      width: '60%',
      height: '75%',
      disableClose: true
    }).afterClosed().subscribe(() => {
      this.getAll(this.pageNo, this.pageSize, this.keyword)
    });
  }
}
