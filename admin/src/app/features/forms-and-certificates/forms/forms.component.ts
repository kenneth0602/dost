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

interface programForms {
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
  selector: 'app-forms',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule
  ],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageNo: number = 1;
  pageSize: number = 5;
  keyword: string = '';
  total: number = 0;
  dataSource: programForms[] = []
  displayedColumns: string[] = ['providerName', 'programName','dateFrom', 'dateTo','fromTime', 'toTime', 'cost'];


  constructor(private dialog: MatDialog, private service: FeaturesService, private router: Router) {

  }

  ngOnInit(): void {
    this.getAll(this.pageNo, this.pageSize, this.keyword)
  }

  getAll(pageNo: number, pageSize: number, keyword: string) {
    const token = sessionStorage.getItem('token');

    this.service.getAllProgramForms(token, pageNo, keyword, pageSize).subscribe(
      (response) => {
        console.log('API Response:', response);
        const program_forms = response?.results?.filter((item: any) => item?.apcID !== undefined) || [];
        const total = response?.total?.[0]?.total || 0;

        this.dataSource = program_forms;

        this.total = total;
      },
      (error) => {
        console.error('Error fetching program forms:', error);
      }
    );
  }

  viewFormsList(row: programForms) {
    this.router.navigate(['admin/forms-and-certificates/forms/list'],
      { state: { formData: row } }
    );
  }

  onPaginateChange(event: PageEvent) {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getAll(this.pageNo, this.pageSize, this.keyword);
  }

}
