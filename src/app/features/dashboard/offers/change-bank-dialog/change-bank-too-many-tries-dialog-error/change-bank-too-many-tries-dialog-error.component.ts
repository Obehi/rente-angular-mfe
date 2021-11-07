import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'change-bank-too-many-tries-dialog-error',
  templateUrl: './change-bank-too-many-tries-dialog-error.component.html',
  styleUrls: ['./change-bank-too-many-tries-dialog-error.component.scss']
})
export class ChangeBankTooManyTriesDialogError implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ChangeBankTooManyTriesDialogError>
  ) {}

  ngOnInit(): void {}

  public close(): void {
    this.dialogRef.close();
  }
}
