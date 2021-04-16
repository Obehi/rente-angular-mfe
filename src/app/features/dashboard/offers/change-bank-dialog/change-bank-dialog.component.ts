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
  public closeState: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangeBankDialogComponent>,
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
        (error) => {
          this.isLoading = false;
          if (error.detail === 'Less than week since last email') {
            this.closeState = 'error-to-many-bargains';
            this.dialogRef.close();
          } else {
            this.isLoading = false;
            this.closeState = 'error';
            this.dialogRef.close();
          }
        }
      );
  }

  public close(): void {
    this.closeState = 'canceled';
    this.dialogRef.close();
  }
}
