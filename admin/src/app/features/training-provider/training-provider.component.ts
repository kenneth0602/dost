import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

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
import { MatPaginator, PageEvent } from '@angular/material/paginator';

// Component
import { AddComponent } from './add/add.component';
import { UploadComponent } from './upload/upload.component';

// Service
import { FeaturesService } from '../features.service';
import { ViewComponent } from './view/view.component';

interface trainingProvider {
  provID: number,
  providerName: string,
  pointofContact: string,
  address: string,
  website: string,
  telNo: string,
  mobileNo: string,
  emailAdd: string,
  status: string
}

@Component({
  selector: 'app-training-provider',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, MatButtonModule, MatInputModule,
    MatDialogModule
  ],
  templateUrl: './training-provider.component.html',
  styleUrl: './training-provider.component.scss'
})
export class TrainingProviderComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageNo: number = 1;
  pageSize: number = 5;
  keyword: string = '';
  total: number = 0;

  dataSource: trainingProvider[] = [];

  displayedColumns: string[] = ['providerName', 'pointofContact', 'emailAdd', 'telNo', 'rating', 'status'];


  constructor(private dialog: MatDialog,
    private service: FeaturesService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.getAll(this.pageNo, this.pageSize, this.keyword)
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

  view(row: trainingProvider) {
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

  details(row: trainingProvider) {
    sessionStorage.setItem('selectedProviderId', row.provID.toString());
    this.router.navigate(['admin/training-provider/details']);
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

  getAll(pageNo: number, pageSize: number, keyword: string) {
    const token = sessionStorage.getItem('token');

    this.service.getAllTrainingProviders(token, pageNo, keyword, pageSize).subscribe(
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

}
