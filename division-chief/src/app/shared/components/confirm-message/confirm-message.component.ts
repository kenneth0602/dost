import { Component, Inject, Input } from '@angular/core';

// Angular Material
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-confirm-message',
  imports: [
    MatDividerModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './confirm-message.component.html',
  styleUrl: './confirm-message.component.scss'
})
export class ConfirmMessageComponent {
  @Input() message: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.message = data.message.substring(data.message.indexOf(":") + 1);
  }

  decision(decision: boolean) {
    this.dialogRef.close(decision);
  }
}
