import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'rente-can-not-bargain-dialog',
  templateUrl: './can-not-bargain-dialog.component.html',
  styleUrls: ['./can-not-bargain-dialog.component.scss']
})
export class CanNotBargainDialogComponent implements OnInit {
  public closeState: string;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CanNotBargainDialogComponent>
  ) {}

  ngOnInit(): void {}

  public close(): void {
    this.closeState = 'do-nothing';
    this.dialogRef.close();
  }
}
