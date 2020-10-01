import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'rente-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ReferralComponent>) { }

  ngOnInit(): void {
  }


  public onClose(): void {
    this.dialogRef.close();
  }

}
