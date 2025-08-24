import { Component, OnInit, ViewChild } from '@angular/core';
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
import { AddComponent } from './add/add.component';
import { UploadComponent } from './upload/upload.component';

// Service
import { FeaturesService } from '../features.service';
import { ViewComponent } from './view/view.component';

interface SubjectMatterExpert {
  profileID: number;
  provID: number;
  lastname: string;
  firstname: string;
  middlename: string;
  mobileNo: string;
  telNo: string;
  companyName: string;
  companyAddress: string;
  companyNo: string;
  emailAdd: string;
  fbMessenger: string;
  viberAccount: string;
  website: string;
  areaOfExpertise: string;
  affiliation: string;
  resource: string;
  honorariaRate: number;
  TIN: string;
  status: string;
  createdOn: string; // ISO string format
  disabledOn: string | null;
  updatedOn: string;
}

@Component({
  selector: 'app-subject-matter-expert',
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule
  ],
  templateUrl: './subject-matter-expert.component.html',
  styleUrl: './subject-matter-expert.component.scss'
})
export class SubjectMatterExpertComponent implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageNo: number = 1;
  pageSize: number = 5;
  keyword: string = '';
  total: number = 0;
  dataSource: SubjectMatterExpert[] = [];
  displayedColumns: string[] = [
    'fullName',
    'resource',
    'companyName',
    'emailAdd',
    'mobileNo',
    'telNo',
    'areaOfExpertise',
    'status'
  ];

  constructor(private dialog: MatDialog, 
              private service: FeaturesService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.getAll(this.pageNo, this.pageSize, this.keyword)
  }

  getAll(pageNo: number, pageSize: number, keyword: string) {
    const token = sessionStorage.getItem('token');

    this.service.getAllSme(token, pageNo, keyword, pageSize).subscribe(
      (response) => {
        console.log('API Response:', response);
        const providers = response?.results?.[0] || [];
        const total = response?.results?.[1]?.[0]?.total || 0;

        this.dataSource = providers;

        this.total = total; // Adjust depending on your API structure
      },
      (error) => {
        console.error('Error fetching training providers:', error);
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
        width: '60%',
        height: '70%',
        disableClose: true
      }
    ).afterClosed().subscribe(
      data => {
        this.getAll(this.pageNo, this.pageSize, this.keyword)
      }
    )
  }

  view(row: SubjectMatterExpert) {
    this.dialog.open(ViewComponent, {
      data: row,
      maxWidth: '100%',
      width: '60%',
      height: '70%',
      disableClose: true
    }).afterClosed().subscribe(
      data => {
        this.getAll(this.pageNo, this.pageSize, this.keyword)
      }
    );
  }

  details(row: SubjectMatterExpert) {
    console.log('Provider ID:', row.profileID);
    this.router.navigate(['admin/subject-matter-expert/details'],
      {
        queryParams: {id: row.profileID}
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

      }
    )
  }

}
