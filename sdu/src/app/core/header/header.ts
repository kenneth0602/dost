import { Component, Output, EventEmitter } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';

// Angular Material
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  providers: [DatePipe],
  imports: [MatToolbarModule, CommonModule, MatDividerModule, MatIconModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  
  today = Date.now()  

  @Output() menuClickedEvent = new EventEmitter<void>();

  menuClicked(){
    console.log('menu clicked');
    this.menuClickedEvent.emit();
  }

}
