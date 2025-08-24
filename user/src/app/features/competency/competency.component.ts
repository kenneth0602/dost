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
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { CompetencyService } from './competency.service';

@Component({
  selector: 'app-competency',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule, MatTabsModule, MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './competency.component.html',
  styleUrl: './competency.component.scss'
})
export class CompetencyComponent {

  employeeDataSource = new MatTableDataSource<any>();
  requestDataSource = new MatTableDataSource<any>();

  tabs: any[] = [];

  ngOnInit() {
    this.getAllAssignedCompetency();
    this.getAllCompletedCompetency();
    this.getAllUnservedCompetency();

    this.tabs = [
      {
        label: 'Assigned',
        dataSource: this.employeeDataSource,
      columns: [
        { key: 'competency', label: 'Competency' },
        { key: 'ldNeeds', label: 'Specific L&D Needs' },
        { key: 'targetDate', label: 'Target Date' },
        { key: 'status', label: 'Status' },
        { key: 'remarks', label: 'Remarks' },
      ],
      columnKeys: ['competency', 'ldNeeds', 'targetDate', 'status', 'remarks']
    },
      {
        label: 'Completed',
        dataSource: this.requestDataSource,
      columns: [
        { key: 'competency', label: 'Competency' },
        { key: 'ldNeeds', label: 'Specific L&D Needs' },
        { key: 'targetDate', label: 'Target Date' },
        { key: 'status', label: 'Status' },
        { key: 'remarks', label: 'Remarks' },
      ],
      columnKeys: ['competency', 'ldNeeds', 'targetDate', 'status', 'remarks']
    },
      {
        label: 'Not Attended',
        dataSource: this.requestDataSource,
       columns: [
        { key: 'competency', label: 'Competency' },
        { key: 'ldNeeds', label: 'Specific L&D Needs' },
        { key: 'targetDate', label: 'Target Date' },
        { key: 'status', label: 'Status' },
        { key: 'remarks', label: 'Remarks' },
      ],
      columnKeys: ['competency', 'ldNeeds', 'targetDate', 'status', 'remarks']
    },
    ];
  }

  constructor(private dialog: MatDialog, private service: CompetencyService) {

  }

  getAllAssignedCompetency() {
    const token = sessionStorage.getItem('token');
    const id = sessionStorage.getItem('userId');

    this.service.getAllAssignedCompetency(token, id).subscribe(
      (response) => {

      }
    )
  }

  getAllCompletedCompetency() {
    const token = sessionStorage.getItem('token');
    const id = sessionStorage.getItem('userId');

    this.service.getAllCompletedCompetency(token, id).subscribe(
      (response) => {

      }
    )
  }

  getAllUnservedCompetency() {
    const token = sessionStorage.getItem('token');
    const id = sessionStorage.getItem('userId');

    this.service.getAllUnservedCompetency(token, id).subscribe(
      (response) => {

      }
    )
  }
}
