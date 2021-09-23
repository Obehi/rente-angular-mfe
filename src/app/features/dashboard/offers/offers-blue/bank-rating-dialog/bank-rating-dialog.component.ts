import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'rente-bank-rating-dialog-blue',
  templateUrl: './bank-rating-dialog.component.html',
  styleUrls: ['./bank-rating-dialog.component.scss']
})
export class BankRatingDialogNoComponent {
  public closeState: string;

  constructor(public dialogRef: MatDialogRef<BankRatingDialogNoComponent>) {}

  public onClick(): void {
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
