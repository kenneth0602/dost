import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-certificates',
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule
  ],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss'
})
export class CertificatesComponent {

  displayedColumns: string[] = ['fullName', 'gender', 'position', 'status'];

  dataSource = new MatTableDataSource([
   {
    fullName: 'Alice Johnson',
    gender: 'Female',
    position: 'Software Engineer',
    status: 'Active'
  },
  {
    fullName: 'Brian Smith',
    gender: 'Male',
    position: 'Project Manager',
    status: 'Inactive'
  },
  {
    fullName: 'Carla Reyes',
    gender: 'Female',
    position: 'UX Designer',
    status: 'Active'
  },
  {
    fullName: 'Daniel Lee',
    gender: 'Male',
    position: 'QA Analyst',
    status: 'Pending'
  },
  {
    fullName: 'Ella Cruz',
    gender: 'Female',
    position: 'Product Owner',
    status: 'Active'
  }
  ]);

  constructor(private dialog: MatDialog) {

  }

}
