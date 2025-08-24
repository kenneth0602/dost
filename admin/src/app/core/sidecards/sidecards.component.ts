import { Component } from '@angular/core';
import { Router } from '@angular/router';

//Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-sidecards',
  standalone: true,
  imports: [MatIconModule, MatDividerModule, MatCardModule, MatDatepickerModule],
  templateUrl: './sidecards.component.html',
  styleUrl: './sidecards.component.scss'
})
export class SidecardsComponent {

  selected: Date | any;
  url: any = '';

  constructor(private router: Router) {

  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target?.result;
      }
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

}
