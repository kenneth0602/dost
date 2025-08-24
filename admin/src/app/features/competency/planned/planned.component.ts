import { Component, ChangeDetectionStrategy } from '@angular/core';
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
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';

interface Status {
  value: string;  
  viewValue: string;        
} 

@Component({
  selector: 'app-planned',
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
            MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
            MatDialogModule, MatDatepickerModule, MatSelectModule
           ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './planned.component.html',
  styleUrl: './planned.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlannedComponent {

  statuses: Status[] = [
    {value: 'Pending Approval from L&D', viewValue: 'Pending Approval from L&D'},
    {value: 'Rejected by L&D', viewValue: 'Rejected by L&D'},
    {value: 'Approved', viewValue: 'Approved'},
    {value: 'Completed', viewValue: 'Completed'}
  ];
  displayedColumns: string[] = ['competency', 'divisionName', 'divisionchief', 'dateSubmitted', 'status'];

  dataSource = new MatTableDataSource([
    {
      competency: 'Leadership Training',
      divisionName: 'Human Resources',
      divisionchief: 'Anna Reyes',
      dateSubmitted: '2025-04-10',
      status: 'Approved'
    },
    {
      competency: 'Project Management',
      divisionName: 'Operations',
      divisionchief: 'Carlos Dela Cruz',
      dateSubmitted: '2025-04-15',
      status: 'Pending'
    },
    {
      competency: 'Cybersecurity Awareness',
      divisionName: 'IT Services',
      divisionchief: 'Joan Ramirez',
      dateSubmitted: '2025-04-18',
      status: 'Rejected'
    },
    {
      competency: 'Financial Planning',
      divisionName: 'Finance',
      divisionchief: 'Michael Tan',
      dateSubmitted: '2025-05-02',
      status: 'Approved'
    },
    {
      competency: 'Customer Service Excellence',
      divisionName: 'Client Relations',
      divisionchief: 'Rachel Santos',
      dateSubmitted: '2025-05-05',
      status: 'Under Review'
    }
  ]);

  constructor(private dialog: MatDialog) {

  }

}
