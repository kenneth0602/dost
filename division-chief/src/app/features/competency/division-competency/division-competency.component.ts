import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

//Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-division-competency',
  imports: [MatIconModule, MatCardModule, MatDividerModule, MatButtonToggleModule, CommonModule],
  templateUrl: './division-competency.component.html',
  styleUrl: './division-competency.component.scss'
})
export class DivisionCompetencyComponent {

  gridView: boolean = true;

  libraryCards = [
    {
      icon: 'list_alt',
      title: 'PLANNED',
      image: '/competency-images/PLANNED.png',
      description: 'PLANNED',
      route: '/division-chief/competency/division-competency/planned'
    },
    {
      icon: 'star',
      title: 'UNPLANNED',
      image: '/competency-images/UNPLANNED.png',
      description: 'UNPLANNED',
      route: '/division-chief/competency/division-competency/unplanned'
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
