import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OfferInfo } from '@shared/models/offers';

@Component({
  selector: 'rente-dialog-choice',
  templateUrl: './generic-choice-dialog.component.html',
  styleUrls: ['./generic-choice-dialog.component.scss']
})
export class GenericChoiceDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GenericChoiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public onClose(): void {
    this.data.onClose && this.data.onClose();
    this.dialogRef.close();
  }

  public onConfirm(): void {
    this.dialogRef.close();
    this.data.onConfirm && this.data.onConfirm();
  }
}
