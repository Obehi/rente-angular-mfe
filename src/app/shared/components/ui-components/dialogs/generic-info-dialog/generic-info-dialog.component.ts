import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OfferInfo } from '@shared/models/offers';

@Component({
  selector: 'rente-dialog-info',
  templateUrl: './generic-info-dialog.component.html',
  styleUrls: ['./generic-info-dialog.component.scss']
})
export class GenericInfoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GenericInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public onClose(): void {
    this.dialogRef.close();
  }
}
