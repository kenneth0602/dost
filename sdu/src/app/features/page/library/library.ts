import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

//Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-library',
  imports: [RouterOutlet, MatIconModule, MatCardModule, MatDividerModule, MatButtonToggleModule, 
            CommonModule, MatDialogModule],
  templateUrl: './library.html',
  styleUrl: './library.scss'
})
export class Library {

  gridView: boolean = true;

  libraryCards = [
  {
    icon: 'list_alt',
    title: 'Scholarships',
    image: '/library-images/SCHOLARSHIPS.png',
    description: 'Scholarships',
    route: '/supervisor/scholarship'
  }
];

  constructor(private router: Router, private dialog: MatDialog) {}

  toggleViewG() {
    this.gridView = true;
  }
  toggleViewL() {
    this.gridView = false;
  }

  goTo(route: string) {
  this.router.navigate([route]);
  }

}
