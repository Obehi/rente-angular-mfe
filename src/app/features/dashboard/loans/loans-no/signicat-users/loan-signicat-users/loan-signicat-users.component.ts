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

  public isEditMode = false;
  public hideEditIcon = false;
  public showDisplayBox = true;
  public showButton = false;
  public isDisabled = true;
  public changesMade = false;
  public isGeneralError = false;
  public isServerError = false;
  public isAbleToSave = false;

  public animationStyle = getAnimationStyles();
  public inEditMode = false;
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

  constructor(
    private loansService: LoansService,
    private messageBannerService: MessageBannerService,
    private myLoansService: MyLoansService
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.initialOutStandingDebt = String(this.loan.outstandingDebt);
    this.initialRemainingYears = String(this.loan.remainingYears);
    this.initialNominalRate = String(this.loan.nominalRate);

    // Button disbabled state
    this.myLoansService.setButtonDisabledState(true);

    // Listen for edit
    this.myLoansService
      .loanEditIndexAsObservable()
      .subscribe((currentIndex) => {
        if (currentIndex === null) {
          this.hideEditIcon = false;
        }
        if (currentIndex !== this.index && currentIndex !== null) {
          this.hideEditIcon = true;
        }
      });

    this.myLoansService.getChangesMadeState().subscribe((state) => {
      if (state) {
        this.changesMade = true;
      } else {
        this.changesMade = false;
      }
    });

    // Listen to able to save
    this.myLoansService.getAbleToSave().subscribe((val) => {
      if (val) {
        this.isDisabled = false;
        this.isAbleToSave = true;
      } else {
        this.isDisabled = true;
        this.isAbleToSave = false;
      }
    });

    this.myLoansService.getButtonDisabledState().subscribe((state) => {
      if (state) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
    });
  } // ngOnInit

  getMask(): any {
    if (typeof this.maskType.currency === 'string') {
      return { mask: this.maskType.currency };
    }
    return this.maskType.currency;
  }

  public setOutstandingDebtVal(val: string): void {
    this.incomingValueOutstandingDebt = val;
  }

  public setRemainingYearsVal(val: string): void {
    this.incomingValueRemainingYears = val;
  }

  public setNominalRateVal(val: string): void {
    this.incomingValueNominalRate = val;
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
    this.myLoansService.setChangesMadeState(false);
    this.showButton = false;
    setTimeout(() => {
      this.myLoansService.setEditMode(null);
      this.myLoansService.setInputEditModeOn(false);

      this.inEditMode = false;
      this.isEditMode = false;
      this.hideEditIcon = false;
      this.showDisplayBox = true;
    }, 325);
  }

  public setEditEnabled(): void {
    this.outstandingDebtIsError = false;
    this.remainingYearsIsError = false;
    this.nominalRateIsError = false;

    const check = this.myLoansService.getEditMode();

    if (check !== null) {
      return;
    }

    // Reset the form, mark as pristine and disable save button
    this.myLoansService.setFormAsPristine();
    this.myLoansService.setAbleToSave(false);
    this.myLoansService.setChangesMadeState(false);
    this.myLoansService.setButtonDisabledState(true);
    this.myLoansService.setEditMode(this.index);
    this.myLoansService.setInputEditModeOn(true);

    this.deactivateAllInput();

    this.showDisplayBox = false;
    this.showButton = true;
    this.isEditMode = true;
    this.hideEditIcon = true;
    setTimeout(() => {
      this.inEditMode = true;
    }, 500);
  }

  // ----------------------------  Formatting the values to api request  -----------------------
  public getNumericValueFormated(incomeValue: any): number {
    const income: string =
      typeof incomeValue === 'string'
        ? incomeValue.replace(/\s/g, '')
        : incomeValue;
    return Number(income.replace(',', '.'));
  }

  public formatComma(val: string): number {
    return Number(val.replace(',', '.'));
  }

  // -------------------------------------------------- || ------------------------------------

  public save(): void {
    console.log('Saved clicked');
    if (!this.isAbleToSave) return;

    this.deactivateAllInput();

    this.sendRequest();
  } // Save

  public sendRequest(): void {
    // Get the new values and then set it to initial value then send request
    const getOutstandingDebt = this.getNumericValueFormated(
      this.incomingValueOutstandingDebt
    );

    const outstandingDebtDto = {
      outstandingDebt: getOutstandingDebt
    };

    const getRemainingYears = this.formatComma(
      this.incomingValueRemainingYears
    );

    const remainingYearsDto = {
      remainingYears: getRemainingYears
    };

    const getNominalRate = this.formatComma(this.incomingValueNominalRate);

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

            console.log('error');
            this.myLoansService.setButtonDisabledState(true);

            // If error, do nothing. The value should be as the previous default
          } else {
            this.messageBannerService.setView(
              'Endringene dine er lagret',
              3000,
              this.animationStyle.DROP_DOWN_UP,
              'success',
              window
            );

            console.log('success \n \n');

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
