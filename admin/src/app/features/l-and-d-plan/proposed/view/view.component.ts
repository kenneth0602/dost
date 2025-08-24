import { Component, ViewChild, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
import { FeaturesService } from '../../../features.service';

interface trainingProgram {
  pprogID: number,
  programName: string,
  description: string,
  status: string
}

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatTableModule,
    MatPaginatorModule, MatChipsModule, CommonModule, MatButtonModule, MatInputModule,
    MatDialogModule, MatTabsModule
  ],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private service = inject(FeaturesService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageNo: number = 1;
  pageSize: number = 5;
  keyword: string = '';
  total: number = 0;
  dataSource: trainingProgram[] = [];
  displayedColumns: string[] = ['SpecificLearning', 'TargetDate', 'Lastname','Firstname', 'MiddleName', 'Priority'
                               ,'DivisionName', 'DivisionChief', 'CompetencyStatus', 'CreatedOn', 'Competency'];

  displayedAldpColumns: string[] = ['Competency', 'ProgramDescription','Type', 'Classification','NoOfProgram', 'PerSession',
                                    'TotalPax', 'EstimatedCost','Participants', 'TrainingProgram','TrainingProvider', 'TrainingDate'
  ]
  aldp_year: number = 0;


  constructor() {

  }

  ngOnInit(): void {

    this.aldp_year = +this.route.snapshot.queryParams['id'];
    if (this.aldp_year) {
      this.getAlpByYear(this.aldp_year, this.pageSize, this.pageNo);
      this.getProposedALDP(this.aldp_year, this.pageSize, this.pageNo);
    }
  }

getProposedALDP(year: number, pageSize: number, pageNo: number): void {
  const jwt = sessionStorage.getItem('token');
  if (!jwt) {
    console.error('JWT token is missing');
    return;
  }

  this.service.getAllPrposedALDP(year, jwt, pageNo, pageSize, this.keyword).subscribe({
    next: (res: any) => {
      const data = res?.[0] || [];
      const total = res?.[1]?.[0]?.total || 0;

      this.dataSource = data;
      this.total = total;
    },
    error: (error) => {
      console.error('Error fetching proposed ALDP:', error);
    }
  });
}

  getAlpByYear(year: number, pageSize: number, pageNo: number): void {
    const jwt = sessionStorage.getItem('token');
    if (!jwt) {
      console.error('JWT token is missing');
      return;
    }

    this.service.getAllCompetencyAssessmentByYear(year, jwt, pageNo, pageSize).subscribe({
      next: (res: any) => {
        // ✅ Fix: properly extract the training provider object
        const provider = res?.[0]?.[0];
        if (provider) {
        } else {
          console.error('Training provider data not found in response:', res);
        }
      },
      error: (error) => {
        console.error('Error fetching training provider details:', error);
      }
    });
  }

  onPaginateChange(event: PageEvent) {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
     this.getAlpByYear(this.aldp_year, this.pageSize, this.pageNo);
  }

}
