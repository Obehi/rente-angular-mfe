import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangeBankServiceService } from '../../../../shared/services/remote-api/change-bank-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'rente-change-bank-dialog',
  templateUrl: './change-bank-dialog.component.html',
  styleUrls: ['./change-bank-dialog.component.scss']
})
export class ChangeBankDialogComponent implements OnInit {
  public confirmForm: FormGroup;
  public isConfirmed: boolean;
  public isLoading: boolean;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangeBankDialogComponent>,
    private changeBankServiceService: ChangeBankServiceService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.confirmForm = this.fb.group({
      confirmation: ['', Validators.required]
    });
  }

  public sendRequest(): void {
    this.isLoading = true;
    this.changeBankServiceService
      .sendBankOfferRequest(this.data.offerId)
      .subscribe(

    _ => {
          this.isLoading = false;
          this.dialogRef.close();

        this.router.navigate(['/dashboard/prute-fullfort'],{ state: { isError: true , fromChangeBankDialog: true} });
        },
        err => {
          this.isLoading = false;
          this.router.navigate(['/dashboard/prute-fullfort'],{ state: { isError: true , fromChangeBankDialog: true} });
          this.dialogRef.close();
        }
      );
  }

  public close(): void {
    this.dialogRef.close();
  }

}
