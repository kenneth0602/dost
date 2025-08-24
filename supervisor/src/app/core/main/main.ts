import { Component } from '@angular/core';
import { Header } from '../header/header';
import { RouterOutlet } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { Sidecards } from '../sidecards/sidecards';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [Header, RouterOutlet, MatSidenavModule, Breadcrumbs,
            CommonModule
           ],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {

  sideNavVisible:boolean = false;

  toggleSideNav() {
    this.sideNavVisible = !this.sideNavVisible;
  }

}
