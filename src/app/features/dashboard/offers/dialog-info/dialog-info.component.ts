import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OfferInfo } from '@shared/models/offers';
import { CustomLangTextService } from '@shared/services/custom-lang-text.service';

@Component({
  selector: 'rente-dialog-info',
  templateUrl: './dialog-info.component.html',
  styleUrls: ['./dialog-info.component.scss']
})
export class DialogInfoComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public offer: OfferInfo,
    public customLangTextSerice: CustomLangTextService
  ) {}

  ngOnInit() {
    if (this.offer.establishmentFee == undefined) {
      this.offer.establishmentFee = 0;
    }
  }
  public onClose(): void {
    this.dialogRef.close();
  }
}
