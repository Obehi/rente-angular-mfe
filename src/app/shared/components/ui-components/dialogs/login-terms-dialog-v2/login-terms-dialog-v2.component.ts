import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ROUTES_MAP } from '@config/routes-config';
@Component({
  selector: 'rente-login-terms-dialog-v2',
  templateUrl: './login-terms-dialog-v2.component.html',
  styleUrls: ['./login-terms-dialog-v2.component.scss']
})
export class LoginTermsDialogV2Component {
  public routes = ROUTES_MAP;

  constructor(
    public dialogRef: MatDialogRef<LoginTermsDialogV2Component>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public onClose(): void {
    this.dialogRef.close();
  }
}
