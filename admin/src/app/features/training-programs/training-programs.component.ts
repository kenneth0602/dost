import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

// Component
import { AddComponent } from './add/add.component';

// Service
import { FeaturesService } from '../features.service';

interface trainingProgram {
  pprogID: number,
  programName: string,
  description: string,
  status: string
}

@Component({
  selector: 'app-training-programs',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule, MatTabsModule
  ],
  templateUrl: './training-programs.component.html',
  styleUrl: './training-programs.component.scss'
})
export class TrainingProgramsComponent implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageNo: number = 1;
  pageSize: number = 5;
  keyword: string = '';
  total: number = 0;
  dataSource: trainingProgram[] = [];
  displayedColumns: string[] = ['programName', 'description', 'status'];


  constructor(private router: Router, private dialog: MatDialog, private service: FeaturesService) {

  }

  ngOnInit(): void {
    this.getAll(this.pageNo, this.pageSize, this.keyword)
  }

  getAll(pageNo: number, pageSize: number, keyword: string) {
    const token = sessionStorage.getItem('token');

    this.service.getAllTrainingProgram(token, pageNo, keyword, pageSize).subscribe(
      (response) => {
        console.log('API Response:', response);
        const training_program = response?.results?.[0] || [];
        const total = response?.results?.[1]?.[0]?.total || 0;

        this.dataSource = training_program;

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
        width: '50%',
        height: '40%',
        disableClose: true
      }
    ).afterClosed().subscribe(
      data => {

      }
    )
  } 
    
  details(row: trainingProgram) {
    sessionStorage.setItem('selectedProviderProgramId', row.pprogID.toString());
    this.router.navigate(['admin/training-programs/details']);
  }

}
