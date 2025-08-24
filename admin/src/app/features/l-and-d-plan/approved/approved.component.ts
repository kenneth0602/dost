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

// Service
import { FeaturesService } from '../../features.service';

interface AldpYear {
  aldpYearID: number,
  aldp_year: number,
  createdOn: string,
  lastModifiedOn: string
}

@Component({
  selector: 'app-approved',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule
  ],
  templateUrl: './approved.component.html',
  styleUrl: './approved.component.scss'
})
export class ApprovedComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageNo: number = 1;
  pageSize: number = 5;
  keyword: string = '';
  total: number = 0;
  dataSource: AldpYear[] = [];
  displayedColumns: string[] = ['aldp_year', 'createdOn', 'lastModifiedOn', 'action'];    

  constructor(private dialog: MatDialog, 
              private service: FeaturesService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getAll(this.pageNo, this.pageSize, this.keyword)
  }

  getAll(pageNo: number, pageSize: number, keyword: string) {
    const token = sessionStorage.getItem('token');

    this.service.getAllALDPYear(token, pageNo, keyword, pageSize).subscribe(
      (response) => {
        console.log('API Response:', response);
        const year = response?.results?.[0] || [];
        const total = response?.results?.[1]?.[0]?.total || 0;

        this.dataSource = year;

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
}
