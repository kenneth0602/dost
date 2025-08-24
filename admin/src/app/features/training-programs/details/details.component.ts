import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Service
import { FeaturesService } from '../../features.service';

// Component
import { ViewComponent } from '../view/view.component';
import { AddTrainingProviderComponent } from './add-training-provider/add-training-provider.component';
import { AddScheduleComponent } from './add-schedule/add-schedule.component';

interface trainingProgram {
  pprogID: number,
  programName: string,
  Description: string,
  status: string
}

interface TrainingProvider {
  provID: number;
  providerName: string;
  pointofContact: string;
}

interface AvailabilityData {
  dateFrom: string;
  fromTime: string;
  dateTo: string;
  toTime: string;
  cost: number;
  status: string;
}

@Component({
  selector: 'app-details',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, MatDividerModule,
    MatTabsModule, MatTableModule, MatCheckboxModule, CommonModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {

  training_program_id: number = 0;
  training_program_data?: trainingProgram;
  providerDataSource = new MatTableDataSource<TrainingProvider>([]);
  providerDisplayedColumns: string[] = ['select', 'providerName', 'pointofContact'];
  dataSource: trainingProgram[] = [];
  selection = new SelectionModel<any>(false, []);
  displayedColumns: string[] = ['programsOffered', 'trainingSchedule', 'trainingFee']
  availabilityData: AvailabilityData[] = [];
  constructor(private route: ActivatedRoute, private service: FeaturesService, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    const isBrowser = typeof window !== 'undefined';

    const idFromQuery = this.route.snapshot.queryParams['id'];
    let idFromSession: string | null = null;

    if (isBrowser) {
      idFromSession = sessionStorage.getItem('selectedProviderProgramId');
    }

    if (idFromQuery) {
      this.training_program_id = +idFromQuery;
    } else if (idFromSession) {
      this.training_program_id = +idFromSession;
    }

    if (!this.training_program_id || isNaN(this.training_program_id)) {
      console.error('Training provider ID not found in query params or sessionStorage');
      // Optional: Redirect back to the list page
      return;
    }

    this.getTrainingProgramById(this.training_program_id);
  }
  
  getTrainingProgramById(id: number): void {
    const jwt = sessionStorage.getItem('token');
    if (!jwt) {
      console.error('JWT token is missing');
      return;
    }

    this.service.getTrainingProgramDetails(jwt, id).subscribe({
      next: (res: any) => {
        const programData = res?.[0]?.[0];
        const providers = res?.[1];

        if (programData) {
          this.training_program_data = programData;
          console.log('Training Program:', this.training_program_data);
        }

        if (Array.isArray(providers)) {
          this.providerDataSource.data = providers;
          console.log('Training Providers:', providers);
        } else {
          console.warn('No training providers found.');
        }
      },
      error: (error) => {
        console.error('Error fetching training program details:', error);
      }
    });
  }

onSelectRow(row: TrainingProvider): void {
  this.selection.clear();
  this.selection.select(row);

  const jwt = sessionStorage.getItem('token');
  if (!jwt || !this.training_program_id) {
    console.error('JWT or training program ID missing');
    return;
  }

  console.log('Selected row provID:', row.provID); // ← DEBUG LOG

  this.service.getTrainingAvailability(jwt, row.provID, this.training_program_id)
    .subscribe({
      next: (availabilityData) => {
        this.availabilityData = availabilityData.results?.[0] || [];
        console.log('Availability:', this.availabilityData);
      },
      error: (error) => {
        console.error('Error fetching training availability:', error);
        this.availabilityData = [];
      }
    });
}

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.providerDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.providerDataSource.data.forEach(row => this.selection.select(row));
  }

  view(): void {
    console.log('data', this.training_program_data);
    console.log('edit clicked')
    if (!this.training_program_data) return;

    this.dialog.open(ViewComponent, {
      data: this.training_program_data,
      maxWidth: '100%',
      width: '60%',
      height: '75%',
      disableClose: true
    }).afterClosed().subscribe(() => {
      this.getTrainingProgramById(this.training_program_id);
    });
  }

  addTrainingProvider(): void {
    console.log('data', this.training_program_data);
    console.log('edit clicked')
    if (!this.training_program_data) return;

    this.dialog.open(AddTrainingProviderComponent, {
      data: {
        ...this.training_program_data,
        pprogID: this.training_program_id,
      },
      maxWidth: '100%',
      width: '60%',
      height: '75%',
      disableClose: true
    }).afterClosed().subscribe(() => {
      this.getTrainingProgramById(this.training_program_id);
    });
  }

addTrainingSchedule(): void {
  const selectedProvider = this.selection.selected[0];

  if (!this.training_program_data || !selectedProvider) {
    console.warn('No training program or provider selected');
    return;
  }

  this.dialog.open(AddScheduleComponent, { 
    data: {
      provID: selectedProvider.provID,
      pprogID: this.training_program_id
    },
    maxWidth: '100%',
    width: '60%',
    height: '75%',
    disableClose: true
  }).afterClosed().subscribe(() => {
    this.getTrainingProgramById(this.training_program_id);
  });
}

}
