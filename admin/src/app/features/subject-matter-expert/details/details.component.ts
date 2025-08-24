import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

// Service
import { FeaturesService } from '../../features.service';

// Component
import { ViewComponent } from '../view/view.component';

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
  selector: 'app-details',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, MatDividerModule,
    MatTabsModule, MatTableModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {

  sme_id: number = 0;
  sme_data?: SubjectMatterExpert;

  dataSource: SubjectMatterExpert[] = [];

  displayedColumns: string[] = ['programsOffered', 'trainingSchedule', 'trainingFee']
 
  constructor(private route: ActivatedRoute, private service: FeaturesService, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.sme_id = +this.route.snapshot.queryParams['id'];
    if (this.sme_id) {
      this.getSmeById(this.sme_id);
    }
  }

  getSmeById(id: number): void {
    const jwt = sessionStorage.getItem('token');
    if (!jwt) {
      console.error('JWT token is missing');
      return;
    }

    this.service.getSmeDetails(jwt, id).subscribe({
      next: (res: any) => {
        // ✅ Fix: properly extract the training provider object
        const provider = res?.[0]?.[0];
        if (provider) {
          this.sme_data = provider;
          console.log('Provider loaded:', this.sme_data);
        } else {
          console.error('Training provider data not found in response:', res);
        }
      },
      error: (error) => {
        console.error('Error fetching training provider details:', error);
      }
    });
  }

  view(): void {
    console.log('data', this.sme_data);
    console.log('edit clicked')
    if (!this.sme_data) return;

    this.dialog.open(ViewComponent, {
      data: this.sme_data,
      maxWidth: '100%',
      width: '60%',
      height: '75%',
      disableClose: true
    }).afterClosed().subscribe(() => {
      this.getSmeById(this.sme_id);
    });
  }
}
