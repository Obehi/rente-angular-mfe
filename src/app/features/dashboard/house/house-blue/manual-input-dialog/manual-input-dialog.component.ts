import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OfferInfo } from '@shared/models/offers';

@Component({
  selector: 'manual-input-dialog',
  templateUrl: './manual-input-dialog.component.html',
  styleUrls: ['./manual-input-dialog.component.scss']
})
export class ManualInputDialogComponent {
  constructor(public dialogRef: MatDialogRef<ManualInputDialogComponent>) {}

  public onClose(): void {
    this.dialogRef.close();
  }
}
