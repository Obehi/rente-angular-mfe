import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'rente-can-not-bargain-dialog',
  templateUrl: './can-not-bargain-dialog.component.html',
  styleUrls: ['./can-not-bargain-dialog.component.scss']
})
export class CanNotBargainDialogComponent implements OnInit {
  public closeState: string;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<CanNotBargainDialogComponent>
  ) {}

  ngOnInit(): void {}

  public close(): void {
    this.closeState = 'do-nothing';
    this.dialogRef.close();
  }
}
