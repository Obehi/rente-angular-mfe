import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'rente-dialog-info',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class HouseFormErrorDialogComponent {
  constructor(public dialogRef: MatDialogRef<HouseFormErrorDialogComponent>) {}

  public onClose(): void {
    this.dialogRef.close();
  }
}
