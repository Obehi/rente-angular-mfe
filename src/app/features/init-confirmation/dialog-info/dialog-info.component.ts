import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { OfferInfo } from "@shared/models/offers";

@Component({
  selector: "rente-dialog-info",
  templateUrl: "./dialog-info.component.html",
  styleUrls: ["./dialog-info.component.scss"]
})
export class DialogInfoComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OfferInfo
  ) {}

  public onClose(): void {
    this.dialogRef.close();
  }
}
