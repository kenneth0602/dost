import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';

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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-unplanned',
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule, MatDatepickerModule, MatSelectModule, MatCheckboxModule
  ],
  templateUrl: './unplanned.component.html',
  styleUrl: './unplanned.component.scss'
})
export class UnplannedComponent {

  selection = new SelectionModel<any>(true, []);

  displayedColumns: string[] = ['select', 'specificLandDNeeds', 'employeeName', 'requiredProficiency', 'levelOfPriority', 'createdOn', 'status'];

  dataSource = new MatTableDataSource([
    {
      specificLandDNeeds: 'Advanced Excel Training',
      employeeName: 'Juan Dela Cruz',
      requiredProficiency: 'Intermediate',
      levelOfPriority: 'High',
      createdOn: '2025-05-15',
      status: 'Pending'
    },
    {
      specificLandDNeeds: 'Project Management Certification',
      employeeName: 'Maria Santos',
      requiredProficiency: 'Expert',
      levelOfPriority: 'Medium',
      createdOn: '2025-04-28',
      status: 'Approved'
    },
    {
      specificLandDNeeds: 'Communication Skills Workshop',
      employeeName: 'Carlos Reyes',
      requiredProficiency: 'Beginner',
      levelOfPriority: 'Low',
      createdOn: '2025-03-20',
      status: 'Completed'
    },
    {
      specificLandDNeeds: 'Cybersecurity Awareness Training',
      employeeName: 'Ana Martinez',
      requiredProficiency: 'Basic',
      levelOfPriority: 'High',
      createdOn: '2025-05-01',
      status: 'Pending'
    },
    {
      specificLandDNeeds: 'Data Analytics Bootcamp',
      employeeName: 'Luis Gomez',
      requiredProficiency: 'Advanced',
      levelOfPriority: 'High',
      createdOn: '2025-04-10',
      status: 'In Progress'
    }
  ]);

  constructor(private dialog: MatDialog) {

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

}
