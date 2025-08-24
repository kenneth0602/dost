import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { 
  MatDialogModule,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-success-message',
  imports: [
    MatDividerModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule],
  templateUrl: './success-message.component.html',
  styleUrl: './success-message.component.scss'
})
export class SuccessMessageComponent {

  @Input() message: string;

  constructor(public dialogRef: MatDialogRef<SuccessMessageComponent>, @Inject(MAT_DIALOG_DATA) public data: any){
    this.message = data.message.substring(data.message.indexOf(":") + 1);
  }

  close(){
    this.dialogRef.close(true);
  }
}
