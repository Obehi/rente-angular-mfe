import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangeBankServiceService } from '../../../../shared/services/remote-api/change-bank-service.service';
import { LoggingService } from '@services/logging.service';
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
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AntiChurnDialogComponent>,
    private changeBankServiceService: ChangeBankServiceService,
    public dialog: MatDialog,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loggingService: LoggingService
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
        this.loggingService.googleAnalyticsLog({
          category: 'NordeaAntiChurn',
          action: 'anti-churn success',
          label: `$top offer: ${this.data.bankInfo.bank}`
        });
        this.isLoading = false;
        this.closeState = 'procced-nordea';
        this.dialogRef.close();
      },
      (error) => {
        this.isLoading = false;
        if (error.detail === 'Less than week since last email') {
          this.closeState = 'error-to-many-bargains-nordea';
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
