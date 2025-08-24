import { Component, Output, EventEmitter } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Sidecards } from '../sidecards/sidecards';

@Component({
  selector: 'app-header',
  providers: [DatePipe],
  imports: [MatToolbarModule, CommonModule, MatDividerModule, MatIconModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  constructor(private dialog: MatDialog,) { }

  today = Date.now()

  @Output() menuClickedEvent = new EventEmitter<void>();

  menuClicked() {
    this.menuClickedEvent.emit();
  }

  viewNotifications() {
    this.dialog.open(Sidecards, {
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
