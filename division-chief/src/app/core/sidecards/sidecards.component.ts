import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CoreService } from '../core.service';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

interface Notification {
  id: number,
  notified_role: string,
  notified_user_id: number,
  message: string,
  source_module: string,
  created_at: Date
}

@Component({
  selector: 'app-sidecards',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule, MatDividerModule, MatCardModule, MatDatepickerModule],
  templateUrl: './sidecards.component.html',
  styleUrl: './sidecards.component.scss'
})
export class SidecardsComponent implements OnInit{

  selected: Date | any;
  url: any = '';
  pageSize: number = 5;
  pageNo: number = 1;
  notifications: Notification[] = [];
  username: string = '';

  constructor(private router: Router, private service: CoreService, private dialogRef: MatDialogRef<SidecardsComponent>) {

  }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('user') || '';
    this.getNotifications(this.pageSize, this.pageNo);
  }

    closeDialog(): void {
    this.dialogRef.close();
  }

getNotifications(pageSize: number, pageNo: number) {
  const token = sessionStorage.getItem('token');

  if (!token) {
    console.error('Token not found in sessionStorage!');
    return;
  }

  this.service.getNotifications(token, pageSize, pageNo).subscribe((res) => {
    console.log(res);
    const notification = res?.data || [];

    this.notifications = notification.map((item: Notification) => ({
      id: item.id,
      notified_role: item.notified_role,
      notified_user_id: item.notified_user_id,
      message: item.message,
      source_module: item.source_module,
      created_at: item.created_at
    }));
  });
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
    this.closeDialog();
    this.router.navigate(['login']);
  }

}
