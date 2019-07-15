import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'rente-dialog-info',
  templateUrl: './dialog-info.component.html',
  styleUrls: ['./dialog-info.component.scss']
})
export class DialogInfoComponent {
  public dialogRef: MatDialogRef<DialogInfoComponent>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  public onClose(): void {
    this.dialogRef.close();
  }
}
