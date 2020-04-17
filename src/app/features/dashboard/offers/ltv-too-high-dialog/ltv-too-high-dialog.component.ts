import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'rente-ltv-too-high-dialog',
  templateUrl: './ltv-too-high-dialog.component.html',
  styleUrls: ['./ltv-too-high-dialog.component.scss']
})
export class LtvTooHighDialogComponent {
  constructor(public dialogRef: MatDialogRef<LtvTooHighDialogComponent>) { }

  onClose() {
    this.dialogRef.close('Pizza!');
  }
}
