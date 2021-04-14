import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'rente-anti-churn-error-dialog',
  templateUrl: './anti-churn-error-dialog.component.html',
  styleUrls: ['./anti-churn-error-dialog.component.scss']
})
export class AntiChurnErrorDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AntiChurnErrorDialogComponent>) {}

  ngOnInit(): void {}

  public close(): void {
    this.dialogRef.close();
  }
}
