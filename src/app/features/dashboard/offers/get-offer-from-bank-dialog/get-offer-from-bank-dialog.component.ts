import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OfferInfo } from '@shared/models/offers';

@Component({
  selector: 'rente-get-offer-from-bank-dialog',
  templateUrl: './get-offer-from-bank-dialog.component.html',
  styleUrls: ['./get-offer-from-bank-dialog.component.scss']
})
export class GetOfferFromBankDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<GetOfferFromBankDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OfferInfo) {}

  public onClose(): void {
    this.dialogRef.close();
  }
}
