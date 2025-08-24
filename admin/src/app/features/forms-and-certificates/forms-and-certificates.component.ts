import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

//Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-forms-and-certificates',
  imports: [MatIconModule, MatCardModule, MatDividerModule, MatButtonToggleModule, CommonModule],
  templateUrl: './forms-and-certificates.component.html',
  styleUrl: './forms-and-certificates.component.scss'
})
export class FormsAndCertificatesComponent {
  
  gridView: boolean = true;

  libraryCards = [
    {
      icon: 'list_alt',
      title: 'Certificates',
      image: '/forms-and-certificates-images/CERTIFICATES.png',
      description: 'Certificates',
      route: '/admin/forms-and-certificates/certificates'
    },
    {
      icon: 'star', 
      title: 'Forms',
      image: '/forms-and-certificates-images/FORMS.png',
      description: 'Certificates',
      route: '/admin/forms-and-certificates/forms'
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
