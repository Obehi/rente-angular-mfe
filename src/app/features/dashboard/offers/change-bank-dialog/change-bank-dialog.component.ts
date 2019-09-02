import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'rente-change-bank-dialog',
  templateUrl: './change-bank-dialog.component.html',
  styleUrls: ['./change-bank-dialog.component.scss']
})
export class ChangeBankDialogComponent implements OnInit {
  public confirmForm: FormGroup;
  public isConfirmed: boolean;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangeBankDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.confirmForm = this.fb.group({
      confirmation: ['', Validators.required]
    });
  }

  public onClose(): void {
    this.dialogRef.close();
  }

}
