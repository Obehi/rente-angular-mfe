import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OfferInfo } from '@shared/models/offers';
import { Router } from '@angular/router';
@Component({
  selector: 'rente-bank-rating-dialog-blue',
  templateUrl: './bank-rating-dialog.component.html',
  styleUrls: ['./bank-rating-dialog.component.scss']
})
export class BankRatingDialogSvComponent {
  public closeState: string;

  constructor(
    public dialogRef: MatDialogRef<BankRatingDialogSvComponent>,
    private router: Router
  ) {}

  public onClick() {
    window.open('', '_blank');
  }

  public onClose(): void {
    this.closeState = 'canceled';
    this.dialogRef.close();
  }

  public close(): void {
    this.closeState = 'canceled';

    this.dialogRef.close();
  }

  public onSeeMoreClick(): void {
    this.closeState = 'procced';
    this.dialogRef.close();
  }
}
