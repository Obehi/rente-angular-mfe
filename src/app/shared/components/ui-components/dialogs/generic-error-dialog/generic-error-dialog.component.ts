import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'rente-generic-error-dialog',
  templateUrl: './generic-error-dialog.component.html',
  styleUrls: ['./generic-error-dialog.component.scss']
})
export class GenericErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GenericErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorDialogData
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

export interface ErrorDialogData {
  header?: string;
  text?: string;
  confirmText: string;
  cancelText?: string;
  error?: any;
  onConfirm?: () => void;
  onClose?: () => void;
}
