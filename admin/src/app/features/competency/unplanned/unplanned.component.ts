import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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

// Component
import { UploadComponent } from '../../training-provider/upload/upload.component';
import { AddComponent } from './add/add.component';

// Service
import { FeaturesService } from '../../features.service';

interface UnplannedCompetency {
  reqID: number,
  specificLDNeeds: string,
  levelOfProficiency: string,
  createdOn: string,
  reqStatus: string,
  reqRemarks: string
}

@Component({
  selector: 'app-unplanned',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule
  ],
  templateUrl: './unplanned.component.html',
  styleUrl: './unplanned.component.scss'
})
export class UnplannedComponent implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageNo: number = 1;
  pageSize: number = 5;
  keyword: string = '';
  total: number = 0;
  dataSource: UnplannedCompetency[] = [];
  displayedColumns: string[] = ['specificLDNeeds', 'levelOfProficiency', 'createdOn', 'reqStatus'];

  constructor(private dialog: MatDialog, private service: FeaturesService) {

  }

  ngOnInit(): void {
    this.getAll(this.pageNo, this.pageSize, this.keyword)
  }

  getAll(pageNo: number, pageSize: number, keyword: string) {
    const token = sessionStorage.getItem('token');

    this.service.getAllUnplannedCompetency(token, pageNo, keyword, pageSize).subscribe(
      (response) => {
        console.log('API Response:', response);
        const unplanned = response?.results?.[0] || [];
        const total = response?.results?.[1]?.[0]?.total || 0;

        this.dataSource = unplanned;

        this.total = total; // Adjust depending on your API structure
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
        width: '30%',
        height: '40%',
        disableClose: true
      }
    ).afterClosed().subscribe(
      data => {
        this.getAll(this.pageNo, this.pageSize, this.keyword)
      }
    )
  }

  upload() {
    this.dialog.open(UploadComponent,
      {
        maxWidth: '100%',
        width: '40%',
        height: '40%',
        disableClose: true
      }
    ).afterClosed().subscribe(
      data => {
        this.getAll(this.pageNo, this.pageSize, this.keyword)
      }
    )
  }

}
