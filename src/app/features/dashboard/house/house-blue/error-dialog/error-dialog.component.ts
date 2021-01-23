import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OfferInfo } from '@shared/models/offers';

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
