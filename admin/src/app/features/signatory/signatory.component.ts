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
  selector: 'app-signatory',
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule
  ],
  templateUrl: './signatory.component.html',
  styleUrl: './signatory.component.scss'
})
export class SignatoryComponent {

  displayedColumns: string[] = ['Name', 'position', 'division'];

  dataSource = new MatTableDataSource([
  {
    Name: 'Daniel Mendoza',
    position: 'Team Leader',
    division: 'Operations'
  },
  {
    Name: 'Alyssa Santos',
    position: 'HR Officer',
    division: 'Human Resources'
  },
  {
    Name: 'Miguel Torres',
    position: 'IT Specialist',
    division: 'Information Technology'
  },
  {
    Name: 'Patricia Reyes',
    position: 'Finance Analyst',
    division: 'Finance'
  },
  {
    Name: 'Joshua Garcia',
    position: 'Marketing Associate',
    division: 'Marketing'
  }
  ]);

  constructor(private dialog: MatDialog) {

  }
}
