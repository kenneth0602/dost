import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

//Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-l-and-d-plan',
  imports: [MatIconModule, MatCardModule, MatDividerModule, MatButtonToggleModule, CommonModule],
  templateUrl: './l-and-d-plan.component.html',
  styleUrl: './l-and-d-plan.component.scss'
})
export class LAndDPlanComponent {
  
  gridView: boolean = true;

  libraryCards = [
    {
      icon: 'list_alt',
      title: 'Approved L & D Plan',
      image: '/l-and-d-images/APPROVED.png',
      description: 'Approved L & D Plan',
      route: '/admin/l-and-d-plan/approved'
    },
    {
      icon: 'star',
      title: 'Proposed L & D Plan',
      image: '/l-and-d-images/PROPOSED.png',
      description: 'Proposed L & D Plan',
      route: '/admin/l-and-d-plan/proposed'
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
