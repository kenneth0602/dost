import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

//Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-competency',
  imports: [MatIconModule, MatCardModule, MatDividerModule, MatButtonToggleModule, CommonModule],
  templateUrl: './competency.component.html',
  styleUrl: './competency.component.scss'
})
export class CompetencyComponent {

  gridView: boolean = true;

  libraryCards = [
    {
      icon: 'list_alt',
      title: 'Division Competency',
      image: '/competency-images/DIVISION-COMPETENCY.png',
      description: 'Division Competency',
      route: '/division-chief/competency/division-competency'
    },
    {
      icon: 'star',
      title: 'My Competency',
      image: '/competency-images/MY-COMPETENCY.png',
      description: 'My Competency',
      route: '/division-chief/competency/my-competency'
    },
  ]

  constructor(private router: Router) {}

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
