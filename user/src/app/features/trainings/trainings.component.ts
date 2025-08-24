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

// Service
import { TrainingsService } from './trainings.service';
import { RegistrationComponent } from './components/registration/registration.component';

interface Trainings {
  apcID: number,
  apID: number,
  programName: string,
  dateFrom: string,
  dateTo: string,
  fromTime: string,
  toTime: string,
  providerName: string,
  cost: number
}

@Component({
  selector: 'app-trainings',
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule
  ],
  templateUrl: './trainings.component.html',
  styleUrl: './trainings.component.scss'
})
export class TrainingsComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageNo: number = 1;
  pageSize: number = 5;
  keyword: string = '';
  total: number = 0;
  dataSource: Trainings[] = [];
  displayedColumns: string[] = ['providerName', 'program', 'dateFrom', 'dateTo', 'fromTime', 'toTime', 'cost'];

  constructor(private router: Router, private dialog: MatDialog, private service: TrainingsService) {

  }

  ngOnInit(): void {
    this.getAll(this.pageNo, this.pageSize, this.keyword)
  }

  getAll(pageNo: number, pageSize: number, keyword: string) {
    const id = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');

    this.service.getAllTrainings(token, pageNo, keyword, pageSize, id).subscribe(
      (response) => {
        console.log('API Response:', response);

        const training_program = response?.results || [];
        const total = response?.total?.[0]?.total || 0;

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

  onRowClick(row: any) {
    console.log('Row Clicked:', row);
    this.router.navigate(['user/trainings/forms'],
      { state: { formData: row } }
    );
  }

}
