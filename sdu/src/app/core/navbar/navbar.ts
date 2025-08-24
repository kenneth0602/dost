import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  url: any = '';

  constructor(private router: Router) {}

  onSelectFile(event:any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target?.result;
      }
    }
}

  public delete(){
    this.url = null;
  }

  navigateDashboard(){
    this.router.navigate(['admin']);
  }

  navigateAudit(){
    this.router.navigate(['admin/audit']);
  }

  navigateReports(){
    this.router.navigate(['admin/reports']);
  }

  navigateLibrary(){
    this.router.navigate(['admin/library']);
  }

}
