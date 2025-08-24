import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

//Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-library',
  imports: [MatIconModule, MatCardModule, MatDividerModule, MatButtonToggleModule, CommonModule],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent {

  gridView: boolean = true;

  libraryCards = [
    {
      icon: 'work',
      title: 'Competency-Based L&D Needs',
      image: '/library-images/COMPETENCY-BASED-L&D-NEEDS.png',
      description: 'Competency-Based L&D Needs',
      route: '/division-chief/competency'
    },
    {
      icon: 'group',
      title: 'Employees',
      image: '/library-images/EMPLOYEES.png',
      description: 'Employees',
      route: '/division-chief/employees'
    },
    {
      icon: 'file_copy',
      title: 'Forms',
      image: '/library-images/FORMS-AND-CERTIFICATES.png',
      description: 'Forms',
      route: '/division-chief/forms-and-certificates'
    },
  {
    icon: 'diversity_3',
    title: 'Scholarships',
    image: '/library-images/SCHOLARSHIPS.png',
    description: 'Scholarships',
    route: '/division-chief/scholarship'
  }
  ];

  constructor(private router: Router) { }

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
