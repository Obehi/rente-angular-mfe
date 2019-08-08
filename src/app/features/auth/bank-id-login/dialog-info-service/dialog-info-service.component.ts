import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'rente-dialog-info-service',
  templateUrl: './dialog-info-service.component.html',
  styleUrls: ['./dialog-info-service.component.scss']
})
export class DialogInfoServiceComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogInfoServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  public onClose(): void {
    this.dialogRef.close();
  }

}
