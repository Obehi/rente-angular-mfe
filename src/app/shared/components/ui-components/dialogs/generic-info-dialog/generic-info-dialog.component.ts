import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'rente-dialog-info',
  templateUrl: './generic-info-dialog.component.html',
  styleUrls: ['./generic-info-dialog.component.scss']
})
export class GenericInfoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GenericInfoDialogComponent>,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public onClose(): void {
    this.dialogRef.close();
  }

  public goToLink(url: string): void {
    window.open(url, '_blank');
  }
}
