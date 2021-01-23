import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'rente-success-change-bank-dialog',
  templateUrl: './success-change-bank-dialog.component.html',
  styleUrls: ['./success-change-bank-dialog.component.scss']
})
export class SuccessChangeBankDialogComponent implements OnInit {
  public isErrorState: boolean;

  constructor(
    public dialogRef: MatDialogRef<SuccessChangeBankDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.isErrorState = this.data.isError;
  }

  public close(): void {
    this.dialogRef.close();
  }
}
