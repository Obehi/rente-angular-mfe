import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  NgForm
} from '@angular/forms';
import { ChangeBankServiceService } from '../../../../shared/services/remote-api/change-bank-service.service';
import { MatStepper } from '@angular/material';
import { LoansService } from '@services/remote-api/loans.service';
import { concat, Observable } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';

@Component({
  selector: 'rente-change-bank-dialog',
  templateUrl: './change-bank-dialog.component.html',
  styleUrls: ['./change-bank-dialog.component.scss']
})
export class ChangeBankDialogComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  public confirmForm: FormGroup;
  public mobileNumberForm: FormGroup;
  public isConfirmed: boolean;
  public isLoading: boolean;
  public closeState: string;
  public stepperPosition: number;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangeBankDialogComponent>,
    private changeBankServiceService: ChangeBankServiceService,
    public dialog: MatDialog,
    private loansService: LoansService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.stepperPosition = 1;
    this.confirmForm = this.fb.group({
      confirmation: ['', Validators.required]
    });
    this.mobileNumberForm = this.fb.group({
      phoneInput: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.phoneShort)
        ])
      ]
    });
  }

  public isErrorState(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  goBack(stepper: MatStepper): void {
    this.stepperPosition = 1;
    stepper.previous();
  }

  goForward(stepper: MatStepper): void {
    if (
      !this.mobileNumberForm.controls['phoneInput'].hasError('required') &&
      !this.mobileNumberForm.controls['phoneInput'].hasError('pattern')
    ) {
      this.stepperPosition = 2;
      stepper.next();
    }
  }

  get signicatPhoneNumber(): string {
    return this.mobileNumberForm.get('phoneInput')?.value;
  }

  get doesNumberExist(): boolean {
    return this.data.preview.clientInfo.phone ? true : false;
  }

  public sendRequest(): void {
    this.isLoading = true;

    concat(
      this.loansService.updateSignicatPhoneNumber(this.signicatPhoneNumber),
      this.changeBankServiceService.sendBankOfferRequest(this.data.offerId)
    )
      .pipe(toArray())
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
