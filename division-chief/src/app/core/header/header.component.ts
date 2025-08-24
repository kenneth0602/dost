import { Component, Output, EventEmitter } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { SidecardsComponent } from '../sidecards/sidecards.component';

@Component({
  selector: 'app-header',
  providers: [DatePipe],
  imports: [MatDialogModule, MatToolbarModule, CommonModule, MatDividerModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private dialog: MatDialog,) { }

  today = Date.now()

  @Output() menuClickedEvent = new EventEmitter<void>();

  menuClicked() {
    this.menuClickedEvent.emit();
  }

  viewNotifications() {
    this.dialog.open(SidecardsComponent, {
      width: '23%',
      height: '98%',
      disableClose: true,
      position: {
        right: '1%'
      },
      panelClass: 'custom-dialog-right'
    }).afterClosed().subscribe(() => { });
  }

}
