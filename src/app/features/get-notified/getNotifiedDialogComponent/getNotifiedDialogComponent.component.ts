import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OfferInfo } from '@shared/models/offers';
import { CustomLangTextService } from '@shared/services/custom-lang-text.service';
import { Router } from '@angular/router';

@Component({
  selector: 'get-notified-dialog',
  templateUrl: './getNotifiedDialogComponent.component.html',
  styleUrls: ['./getNotifiedDialogComponent.component.scss']
})
export class GetNotifiedDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<GetNotifiedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public offer: OfferInfo,
    public customLangTextSerice: CustomLangTextService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.offer.establishmentFee == undefined) {
      this.offer.establishmentFee = 0;
    }
  }
  public onClose(): void {
    this.dialogRef.close();
    this.router.navigate(['/']);
  }
}
