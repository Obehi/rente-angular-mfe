import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'house-error-dialog-sv',
  templateUrl: './house-error-dialog-sv.component.html',
  styleUrls: ['./house-error-dialog-sv.component.scss']
})
export class HouseErrorDialogSv {
  constructor(public dialogRef: MatDialogRef<HouseErrorDialogSv>) {}

  public onClose(): void {
    this.dialogRef.close();
  }
}
