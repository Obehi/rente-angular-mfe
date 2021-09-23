import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'virdi-error-choice-dialog',
  templateUrl: './virdi-error-choice-dialog.component.html',
  styleUrls: ['./virdi-error-choice-dialog.component.scss']
})
export class VirdiErrorChoiceDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<VirdiErrorChoiceDialogComponent>,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public onClose(): void {
    this.data.onClose && this.data.onClose();
    this.dialogRef.close();
  }

  public onConfirm(): void {
    this.dialogRef.close();
    this.data.onConfirm && this.data.onConfirm();
  }
}
