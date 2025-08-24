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
  selector: 'app-employees',
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {

  displayedColumns: string[] = ['Name', 'emailAdd', 'contactNo', 'division', 'status'];

  dataSource = new MatTableDataSource([
  {
    Name: 'Isabella Cruz',
    emailAdd: 'isabella.cruz@example.com',
    contactNo: '09171234567',
    division: 'Finance',
    status: 'Active'
  },
  {
    Name: 'Liam Reyes',
    emailAdd: 'liam.reyes@example.com',
    contactNo: '09281234567',
    division: 'Human Resources',
    status: 'Inactive'
  },
  {
    Name: 'Sophia Dizon',
    emailAdd: 'sophia.dizon@example.com',
    contactNo: '09391234567',
    division: 'Marketing',
    status: 'Pending'
  },
  {
    Name: 'Noah Santiago',
    emailAdd: 'noah.santiago@example.com',
    contactNo: '09181234567',
    division: 'Operations',
    status: 'Active'
  },
  {
    Name: 'Mia Fernandez',
    emailAdd: 'mia.fernandez@example.com',
    contactNo: '09051234567',
    division: 'IT Support',
    status: 'Active'
  }
  ]);

  constructor(private dialog: MatDialog) {

  }
}
