import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangeBankServiceService } from '../../../../shared/services/remote-api/change-bank-service.service';

@Component({
  selector: 'rente-change-bank-dialog',
  templateUrl: './change-bank-dialog.component.html',
  styleUrls: ['./change-bank-dialog.component.scss']
})
export class ChangeBankDialogComponent implements OnInit {
  public confirmForm: FormGroup;
  public isConfirmed: boolean;
  isLoading: boolean;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangeBankDialogComponent>,
    private changeBankServiceService: ChangeBankServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.confirmForm = this.fb.group({
      confirmation: ['', Validators.required]
    });
  }

  public sendRequest(): void {
    this.isLoading = true;
    this.changeBankServiceService.sendBankOfferRequest(this.data.offerId).subscribe(_ => {
      this.isLoading = false;
      this.dialogRef.close();
    });
  }
  public close(): void {
    this.dialogRef.close();
  }

}
