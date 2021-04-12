import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeBankServiceService } from '../../../../shared/services/remote-api/change-bank-service.service';

@Component({
  selector: 'rente-anti-churn-dialog',
  templateUrl: './anti-churn-dialog.component.html',
  styleUrls: ['./anti-churn-dialog.component.scss']
})
export class AntiChurnDialogComponent implements OnInit {
  public confirmForm: FormGroup;
  public isConfirmed: boolean;
  public isLoading: boolean;
  public closeState: string;
  public disableAnimation = true;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AntiChurnDialogComponent>,
    private changeBankServiceService: ChangeBankServiceService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.confirmForm = this.fb.group({
      confirmation: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    // timeout required to avoid the dreaded 'ExpressionChangedAfterItHasBeenCheckedError'
    setTimeout(() => (this.disableAnimation = false));
  }

  public sendRequest(): void {
    this.isLoading = true;
    this.changeBankServiceService.sendAntiChurnRequest().subscribe(
      () => {
        /*  this.closeState = 'error-to-many-bargains';
        this.dialogRef.close();

        return; */

        (window as any).dataLayer.push({
          event: 'NordeaAntiChurn',
          category: 'NordeaAntiChurn',
          action: 'anti-churn success',
          label: 'test label',
          value: 'test value'
        });
        this.isLoading = false;
        this.closeState = 'procced-nordea';
        this.dialogRef.close();
      },
      () => {
        if (true) {
          this.closeState = 'error-to-many-bargains';
          this.dialogRef.close();
        }
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
