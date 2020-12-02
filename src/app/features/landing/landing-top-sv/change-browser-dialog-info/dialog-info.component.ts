import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "rente-dialog-info",
  templateUrl: "./dialog-info.component.html",
  styleUrls: ["./dialog-info.component.scss"]
})
export class ChangeBrowserDialogInfoComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ChangeBrowserDialogInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
  }
  public onClose(): void {
    this.dialogRef.close();
  }
}
