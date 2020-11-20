import { Component } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "rente-dialog-info",
  templateUrl: "./dialog-info.component.html",
  styleUrls: ["./dialog-info.component.scss"]
})
export class ChangeBrowserDialogInfoComponent {
  constructor(
    public dialogRef: MatDialogRef<ChangeBrowserDialogInfoComponent>
  ) {}

  public onClose(): void {
    this.dialogRef.close();
  }
}
