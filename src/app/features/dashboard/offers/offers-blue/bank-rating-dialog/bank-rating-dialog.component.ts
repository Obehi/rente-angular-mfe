
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { OfferInfo } from "@shared/models/offers";

@Component({
  selector: 'rente-bank-rating-dialog-blue',
  templateUrl: './bank-rating-dialog.component.html',
  styleUrls: ['./bank-rating-dialog.component.scss']
})
export class BankRatingDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<BankRatingDialogComponent>
  ) {}

  public onClick() {
    window.open("", "_blank");
  }


  public onClose(): void {
    this.dialogRef.close();
  }

}


