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
    icon: 'list_alt',
    title: 'Partners & Providers',
    image: '/library-images/TRAINING-PROVIDERS.png',
    description: 'Training Providers',
    route: '/admin/training-provider'
  },
  {
    icon: 'star',
    title: 'Subject Experts',
    image: '/library-images/SME.png',
    description: 'Subject Matter Experts',
    route: '/admin/subject-matter-expert'
  },  
  { 
    icon: 'work',
    title: 'Competency-Based L&D Needs',
    image: '/library-images/COMPETENCY-BASED-L&D-NEEDS.png',
    description: 'Competency-Based L&D Needs',
    route: '/admin/competency'
  },
  {
    icon: 'quiz',
    title: 'Annual L & D Plan',
    image: '/library-images/LEARNING-&-DEVELOPMENT-PLAN.png',
    description: 'Learning & Development Plan',
    route: '/admin/l-and-d-plan'
  },
  {
    icon: 'view_timeline',
    title: 'Training Programs',
    image: '/library-images/TRAINING-PROGRAMS.png',
    description: 'Training Programs',
    route: '/admin/training-programs'
  },
  {
    icon: 'file_copy',
    title: 'Forms',
    image: '/library-images/FORMS-AND-CERTIFICATES.png',
    description: 'Forms',
    route: '/admin/forms-and-certificates'
  },
  {
    icon: 'diversity_3',
    title: 'Scholarships',
    image: '/library-images/SCHOLARSHIPS.png',
    description: 'Scholarships',
    route: '/admin/sholarship'
  },
  {
    icon: 'group',
    title: 'Employees',
    image: '/library-images/EMPLOYEES.png',
    description: 'Employees',
    route: '/admin/employees'
  },
  {
    icon: 'group',
    title: 'Signatories',
    image: '/library-images/SIGNATORIES.png',
    description: 'Signatories',
    route: '/admin/signatories'
  }
];

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
