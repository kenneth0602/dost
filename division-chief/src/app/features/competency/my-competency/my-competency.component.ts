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
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-my-competency',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule, MatTabsModule
  ],  
  templateUrl: './my-competency.component.html',
  styleUrl: './my-competency.component.scss'
})  
export class MyCompetencyComponent {

  displayedColumns = [
    { key: 'ldNeeds', label: 'Specific LD Needs' },
    { key: 'levelOfProficiency', label: 'Level of Proficiency' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'firstName', label: 'First Name' },
    { key: 'middleName', label: 'Middle Name' },
    { key: 'createdOn', label: 'Created On' },
    { key: 'status', label: 'Status' }
  ];

  // Extract just the keys for use in *matHeaderRowDef and *matRowDef
  columnKeys = this.displayedColumns.map(c => c.key);

  // Dummy data
  allData = [
    {
      ldNeeds: 'Advanced Excel Training',
      levelOfProficiency: 'Intermediate',
      lastName: 'Garcia',
      middleName: 'Lopez',
      createdOn: '2024-12-01',
      firstName: 'Maria',
      status: 'Pending'
    },
    {
      ldNeeds: 'Leadership Workshop',
      levelOfProficiency: 'Beginner',
      lastName: 'Santos',
      middleName: 'Rivera',
      createdOn: '2025-01-15',
      firstName: 'Juan',
      status: 'Approved'
    },
    {
      ldNeeds: 'Data Analysis',
      levelOfProficiency: 'Advanced',
      lastName: 'Reyes',
      middleName: 'Torres',
      createdOn: '2025-02-10',
      firstName: 'Angela',
      status: 'Completed'
    },
    {
      ldNeeds: 'Public Speaking',
      levelOfProficiency: 'Intermediate',
      lastName: 'Cruz',
      middleName: 'Delos',
      createdOn: '2025-03-05',
      firstName: 'Carlos',
      status: 'In Progress'
    },
    {
      ldNeeds: 'Project Management',
      levelOfProficiency: 'Beginner',
      lastName: 'Morales',
      middleName: 'Diaz',
      createdOn: '2025-04-20',
      firstName: 'Lucia',
      status: 'Pending'
    }
  ];

  // Create separate filtered data sources
  assignedDataSource = new MatTableDataSource(
    this.allData.filter(d => d.status === 'Pending' || d.status === 'In Progress')
  );

  completedDataSource = new MatTableDataSource(
    this.allData.filter(d => d.status === 'Completed' || d.status === 'Approved')
  );

  notAttendedDataSource = new MatTableDataSource(
    this.allData.filter(d => d.status !== 'Pending' && d.status !== 'In Progress' && d.status !== 'Completed' && d.status !== 'Approved')
  );

  tabData = [
    { label: 'Assigned', dataSource: this.assignedDataSource },
    { label: 'Completed', dataSource: this.completedDataSource },
    { label: 'Not Attended', dataSource: this.notAttendedDataSource }
  ];

  constructor(private dialog: MatDialog) {}
}
