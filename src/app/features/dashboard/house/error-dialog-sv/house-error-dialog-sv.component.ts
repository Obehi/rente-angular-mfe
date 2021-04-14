import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OfferInfo } from '@shared/models/offers';

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
