import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { RouterOutlet } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import { BreadcrumbsComponent } from "../breadcrumbs/breadcrumbs.component";
import { SidecardsComponent } from "../sidecards/sidecards.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [HeaderComponent, RouterOutlet, MatSidenavModule, BreadcrumbsComponent, 
            CommonModule
           ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  sideNavVisible:boolean = false;

  toggleSideNav() {
    this.sideNavVisible = !this.sideNavVisible;
  }

}
