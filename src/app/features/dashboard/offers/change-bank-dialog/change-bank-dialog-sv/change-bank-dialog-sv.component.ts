import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangeBankServiceService } from '../../../../../shared/services/remote-api/change-bank-service.service';

@Component({
  selector: 'rente-change-bank-dialog',
  templateUrl: './change-bank-dialog-sv.component.html',
  styleUrls: ['./change-bank-dialog-sv.component.scss']
})
export class ChangeBankDialogSvComponent implements OnInit {
  public confirmForm: FormGroup;
  public isConfirmed: boolean;
  public isLoading: boolean;
  public closeState: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangeBankDialogSvComponent>,
    private changeBankServiceService: ChangeBankServiceService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.confirmForm = this.fb.group({
      confirmation: ['', Validators.required]
    });
  }

  public sendRequest(): void {
    this.isLoading = true;
    this.changeBankServiceService
      .sendBankOfferRequest(this.data.offerId)
      .subscribe(
        (_) => {
          this.isLoading = false;
          this.closeState = 'procced';
          this.dialogRef.close();
        },
        (err) => {
          this.isLoading = false;
          this.closeState = 'error';
          this.dialogRef.close();
        }
      );
  }

  public close(): void {
    this.closeState = 'canceled';
    this.dialogRef.close();
  }
}
