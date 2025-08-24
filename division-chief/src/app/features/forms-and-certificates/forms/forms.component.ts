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
  selector: 'app-forms',
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule
  ],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent {

displayedColumns: string[] = [
  'providerName',
  'program',
  'dateFrom',
  'dateTo',
  'fromTime',
  'toTime',
  'cost'
];

  dataSource = new MatTableDataSource([
  {
    providerName: 'TechSkills Inc.',
    program: 'Advanced Angular',
    dateFrom: '2025-06-01',
    dateTo: '2025-06-05',
    fromTime: '09:00 AM',
    toTime: '04:00 PM',
    cost: 5000
  },
  {
    providerName: 'PM Academy',
    program: 'Project Leadership',
    dateFrom: '2025-07-10',
    dateTo: '2025-07-12',
    fromTime: '10:00 AM',
    toTime: '03:00 PM',
    cost: 4500
  },
  {
    providerName: 'Design Hub',
    program: 'User Research Workshop',
    dateFrom: '2025-05-20',
    dateTo: '2025-05-21',
    fromTime: '08:30 AM',
    toTime: '02:00 PM',
    cost: 3000
  },
  {
    providerName: 'TestMasters',
    program: 'Automation Testing Bootcamp',
    dateFrom: '2025-06-15',
    dateTo: '2025-06-17',
    fromTime: '09:00 AM',
    toTime: '05:00 PM',
    cost: 5500
  },
  {
    providerName: 'AgileWorks',
    program: 'Scrum Master Certification',
    dateFrom: '2025-08-01',
    dateTo: '2025-08-03',
    fromTime: '10:00 AM',
    toTime: '04:00 PM',
    cost: 6000
  }
  ]);

  constructor(private dialog: MatDialog) {

  }
  
}
