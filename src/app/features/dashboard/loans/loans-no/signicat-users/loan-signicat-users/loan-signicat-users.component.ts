import { Component, Input, Output, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MyLoansService } from '@features/dashboard/loans/myloans.service';
import { bankOfferDto, LoanInfo } from '@models/loans';
import { MessageBannerService } from '@services/message-banner.service';
import { LoansService } from '@services/remote-api/loans.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
import { ButtonFadeInOut } from '@shared/animations/button-fade-in-out';
import { FadeOut } from '@shared/animations/fade-out';
import { Mask } from '@shared/constants/mask';
import { concat, forkJoin, Observable, of, Subscription } from 'rxjs';
import { catchError, toArray } from 'rxjs/operators';

@Component({
  selector: 'rente-loan-signicat-users',
  templateUrl: './loan-signicat-users.component.html',
  styleUrls: ['./loan-signicat-users.component.scss'],
  animations: [FadeOut, ButtonFadeInOut]
})
export class LoanSignicatUsersComponent implements OnInit, OnDestroy {
  @Input() index: number;
  @Input() loan: LoanInfo;
  @Input() allOffers: bankOfferDto[];

  public loanForm: FormGroup;
  public isEditMode = false;
  public inEditMode = false;
  public hideEditIcon = false;
  public setOpacity = false;
  public showDisplayBox = true;
  public showButton = false;
  public isDisabled = true;
  public changesMade = false;
  public isGeneralError = false;
  public isServerError = false;
  public isAbleToSave = false;

  public animationStyle = getAnimationStyles();
  public maskType = Mask;

  // Store value from input emitter
  public incomingValueOutstandingDebt: string;
  public incomingValueRemainingYears: string;
  public incomingValueNominalRate: string;

  // Activate input color when focused
  public inputOutstandingDebtIsActive = false;
  public inputRemainingYearsIsActive = false;
  public inputNominalRateIsActive = false;

  // Error handling
  public outstandingDebtIsError = false;
  public remainingYearsIsError = false;
  public nominalRateIsError = false;
  public isError = false;

  public outstandingDebtString = 'outstandingDebt';
  public remainingYearsString = 'remainingYears';
  public nominalRateString = 'nominalRate';

  // Store the inital value from api
  public initialOutStandingDebt: string;
  public initialRemainingYears: string;
  public initialNominalRate: string;

  public changeOutstandingDebtSubscription: Subscription | undefined;
  public changeRemainingYearsSubscription: Subscription | undefined;
  public changeNominalRateSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private loansService: LoansService,
    private messageBannerService: MessageBannerService,
    private myLoansService: MyLoansService
  ) {}

  ngOnDestroy(): void {
    if (this.changeOutstandingDebtSubscription) {
      this.changeOutstandingDebtSubscription.unsubscribe();
    }
    if (this.changeRemainingYearsSubscription) {
      this.changeRemainingYearsSubscription.unsubscribe();
    }
    if (this.changeNominalRateSubscription) {
      this.changeNominalRateSubscription.unsubscribe();
    }
  }

  public checkIfZero(val: string): boolean {
    return (
      this.loanForm.get(val)?.value.trim() === '' ||
      this.loanForm.get(val)?.value === '0' ||
      this.loanForm.get(val)?.value === ',' ||
      this.loanForm.get(val)?.value === ',0' ||
      this.loanForm.get(val)?.value === ',00' ||
      this.loanForm.get(val)?.value === '0,' ||
      this.loanForm.get(val)?.value === '0,0' ||
      this.loanForm.get(val)?.value === '0,00' ||
      this.loanForm.get(val)?.value === '00' ||
      this.loanForm.get(val)?.value === '00,' ||
      this.loanForm.get(val)?.value === '00,0' ||
      this.loanForm.get(val)?.value === '00,00' ||
      this.loanForm.get(val)?.value === '000' ||
      this.loanForm.get(val)?.value === '0000' ||
      this.loanForm.get(val)?.value === '00000' ||
      this.loanForm.get(val)?.value === '000000' ||
      this.loanForm.get(val)?.value === '0000000' ||
      this.loanForm.get(val)?.value === '0 000' ||
      this.loanForm.get(val)?.value === '00 000' ||
      this.loanForm.get(val)?.value === '000 000' ||
      this.loanForm.get(val)?.value === '0 000 000'
    );
  }

  ngOnInit(): void {
    // Check count of decimals and format it to 0 or 1 decimal
    const format = this.myLoansService.countDecimals(this.loan.remainingYears);
    let correctValue = '';
    if (format < 2) correctValue = String(this.loan.remainingYears);
    if (format > 1) correctValue = this.loan.remainingYears.toFixed(1);

    // Set initial value
    this.initialOutStandingDebt = String(this.loan.outstandingDebt);
    this.initialRemainingYears = String(correctValue);
    this.initialNominalRate = String(this.loan.nominalRate);

    this.loanForm = this.fb.group({
      outstandingDebt: [
        { value: this.initialOutStandingDebt, disabled: true },
        Validators.required
      ],
      remainingYears: [
        { value: this.initialRemainingYears, disabled: true },
        Validators.required
      ],
      nominalRate: [
        { value: this.initialNominalRate, disabled: true },
        Validators.required
      ]
    });

    this.isAbleToSave = false;
    this.disableForm();

    // Set incoming value or it will be undefined if only one input is changed
    this.incomingValueOutstandingDebt = this.initialOutStandingDebt;
    this.incomingValueRemainingYears = this.initialRemainingYears;
    this.incomingValueNominalRate = this.initialNominalRate;

    // Listen for which loan is in editmode (if more than 1 loan is present)
    this.myLoansService
      .loanEditIndexAsObservable()
      .subscribe((currentIndex) => {
        if (currentIndex === null) {
          this.hideEditIcon = false;
          this.setOpacity = false;
        }
        if (currentIndex !== this.index && currentIndex !== null) {
          this.hideEditIcon = true;
          this.setOpacity = true;
        }
      });

    this.changeOutstandingDebtSubscription = this.loanForm
      .get('outstandingDebt')
      ?.valueChanges.subscribe(() => {
        const check = this.checkIfZero('outstandingDebt');

        if (!check) {
          this.outstandingDebtIsError = false;
          this.incomingValueOutstandingDebt = this.loanForm.get(
            'outstandingDebt'
          )?.value;
        } else {
          this.outstandingDebtIsError = true;
        }

        if (
          this.loanForm.get('outstandingDebt')?.dirty &&
          !check &&
          !this.remainingYearsIsError &&
          !this.nominalRateIsError
        ) {
          this.isAbleToSave = true;
        } else {
          this.isAbleToSave = false;
        }
      });

    this.changeRemainingYearsSubscription = this.loanForm
      .get('remainingYears')
      ?.valueChanges.subscribe(() => {
        const check = this.checkIfZero('remainingYears');

        if (!check) {
          this.remainingYearsIsError = false;
          this.incomingValueRemainingYears = this.loanForm.get(
            'remainingYears'
          )?.value;
        } else {
          this.remainingYearsIsError = true;
        }

        if (
          this.loanForm.get('remainingYears')?.dirty &&
          !check &&
          !this.outstandingDebtIsError &&
          !this.nominalRateIsError
        ) {
          this.isAbleToSave = true;
        } else {
          this.isAbleToSave = false;
        }
      });

    this.changeNominalRateSubscription = this.loanForm
      .get('nominalRate')
      ?.valueChanges.subscribe(() => {
        const check = this.checkIfZero('nominalRate');

        if (!check) {
          this.nominalRateIsError = false;
          this.incomingValueNominalRate = this.loanForm.get(
            'nominalRate'
          )?.value;
        } else {
          this.nominalRateIsError = true;
        }

        if (
          this.loanForm.get('nominalRate')?.dirty &&
          !check &&
          !this.outstandingDebtIsError &&
          !this.remainingYearsIsError
        ) {
          this.isAbleToSave = true;
        } else {
          this.isAbleToSave = false;
        }
      });
  } // ngOnInit

  getMask(): any {
    if (typeof this.maskType.currency === 'string') {
      return { mask: this.maskType.currency };
    }
    return this.maskType.currency;
  }

  public isErrorState(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public disableForm(): void {
    this.loanForm.get(this.outstandingDebtString)?.disable();
    this.loanForm.get(this.remainingYearsString)?.disable();
    this.loanForm.get(this.nominalRateString)?.disable();
  }

  public enableForm(): void {
    this.loanForm.get(this.outstandingDebtString)?.enable();
    this.loanForm.get(this.remainingYearsString)?.enable();
    this.loanForm.get(this.nominalRateString)?.enable();
  }

  public setInputOutDebtActive(): void {
    this.inputRemainingYearsIsActive = false;
    this.inputNominalRateIsActive = false;
    this.inputOutstandingDebtIsActive = true;
  }

  public setInputRemYearsActive(): void {
    this.inputOutstandingDebtIsActive = false;
    this.inputNominalRateIsActive = false;
    this.inputRemainingYearsIsActive = true;
  }

  public setInputNominalRateActive(): void {
    this.inputOutstandingDebtIsActive = false;
    this.inputRemainingYearsIsActive = false;
    this.inputNominalRateIsActive = true;
  }

  public deactivateAllInput(): void {
    this.inputOutstandingDebtIsActive = false;
    this.inputRemainingYearsIsActive = false;
    this.inputNominalRateIsActive = false;
  }

  public setEditDisabled(): void {
    // Reset error
    this.outstandingDebtIsError = false;
    this.remainingYearsIsError = false;
    this.nominalRateIsError = false;

    // Run in this order for animation to be smooth
    this.showButton = false;
    setTimeout(() => {
      this.myLoansService.setEditMode(null);

      // Reset the values back to initial
      this.loanForm
        .get('outstandingDebt')
        ?.setValue(this.initialOutStandingDebt);
      this.loanForm.get('remainingYears')?.setValue(this.initialRemainingYears);
      this.loanForm.get('nominalRate')?.setValue(this.initialNominalRate);

      this.inEditMode = false;
      this.isEditMode = false;
      this.hideEditIcon = false;
      this.setOpacity = false;
      this.showDisplayBox = true;
    }, 325);

    this.disableForm();
  }

  public setEditEnabled(): void {
    this.outstandingDebtIsError = false;
    this.remainingYearsIsError = false;
    this.nominalRateIsError = false;

    const check = this.myLoansService.getEditMode();

    if (check !== null) {
      console.log('Check is NULL!!');
      return;
    }

    // Reset the form, mark as pristine and disable save button
    this.myLoansService.setEditMode(this.index);

    this.loanForm.markAsPristine();
    this.isAbleToSave = false;
    this.enableForm();

    this.deactivateAllInput();

    this.showDisplayBox = false;
    this.showButton = true;
    this.isEditMode = true;
    this.hideEditIcon = true;
    // this.setOpacity = true;
    setTimeout(() => {
      this.inEditMode = true;
    }, 500);
  }

  // ----------------------------   SAVE   --------------------------------

  public save(): void {
    if (!this.isAbleToSave) return;

    this.deactivateAllInput();

    this.sendRequest();
  }

  public sendRequest(): void {
    // Get the new values and then set it to initial value then send request
    const getOutstandingDebt = this.myLoansService.getNumericValueFormated(
      this.incomingValueOutstandingDebt
    );

    const outstandingDebtDto = {
      outstandingDebt: getOutstandingDebt
    };

    const getRemainingYears = this.myLoansService.formatComma(
      this.incomingValueRemainingYears
    );

    const remainingYearsDto = {
      remainingYears: getRemainingYears
    };

    const getNominalRate = this.myLoansService.formatComma(
      this.incomingValueNominalRate
    );

    const nominalRateDto = {
      nominalRate: getNominalRate
    };

    concat(
      // of(true)
      this.loansService
        .updateLoanOutstandingDebt(outstandingDebtDto)

        .pipe(
          catchError((err) => {
            console.log(err);
            this.outstandingDebtIsError = true;
            this.isError = true;
            if (err.status < 500) {
              this.isGeneralError = true;
            }
            if (err.status > 499) {
              this.isServerError = true;
            }
            return of(err);
          })
        ),
      // of(true)
      this.loansService.updateLoanReminingYears(remainingYearsDto).pipe(
        catchError((err) => {
          console.log(err);
          this.remainingYearsIsError = true;
          this.isError = true;
          if (err.status < 500) {
            this.isGeneralError = true;
          }
          if (err.status > 499) {
            this.isServerError = true;
          }
          return of(err);
        })
      ),
      // of(true)

      this.loansService.updateLoanNominalRate(nominalRateDto).pipe(
        catchError((err) => {
          console.log(err);
          this.nominalRateIsError = true;
          this.isError = true;
          if (err.status < 500) {
            this.isGeneralError = true;
          }
          if (err.status > 499) {
            this.isServerError = true;
          }
          return of(err);
        })
      )
    )
      .pipe(toArray())
      .subscribe(
        (res) => {
          console.log(res);

          if (this.isError) {
            if (this.isServerError) {
              this.messageBannerService.setView(
                'Oops, noe gikk galt. Prøv igjen senere',
                5000,
                this.animationStyle.DROP_DOWN_UP,
                'error',
                window
              );
            } else {
              this.messageBannerService.setView(
                'En eller flere av endringene ble ikke oppdatert',
                5000,
                this.animationStyle.DROP_DOWN_UP,
                'error',
                window
              );
            }

            this.isAbleToSave = false;

            // If error, do nothing. The value should be as the previous default
          } else {
            this.messageBannerService.setView(
              'Endringene dine er lagret',
              3000,
              this.animationStyle.DROP_DOWN_UP,
              'success',
              window
            );

            // Save the original format in string with mask
            this.initialOutStandingDebt = this.incomingValueOutstandingDebt;
            this.initialRemainingYears = this.incomingValueRemainingYears;
            this.initialNominalRate = this.incomingValueNominalRate;

            this.setEditDisabled();
          }
        },
        (err) => {
          console.log(err);
          console.log('Error subscribtion');
        }
      );
  } // send request end

  // -------------------------------------------------- || ------------------------------------

  public deleteLoan(): void {
    alert(`Loan ${this.index + 1} deleting, are you sure?`);
  }
}
