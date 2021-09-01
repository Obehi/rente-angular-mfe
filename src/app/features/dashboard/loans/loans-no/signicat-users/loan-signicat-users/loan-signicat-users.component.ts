import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyLoansService } from '@features/dashboard/loans/myloans.service';
import { bankOfferDto, LoanInfo } from '@models/loans';
import { MessageBannerService } from '@services/message-banner.service';
import { LoansService } from '@services/remote-api/loans.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
import { ButtonFadeInOut } from '@shared/animations/button-fade-in-out';
import { FadeOut } from '@shared/animations/fade-out';
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
  public loanForm: FormGroup;
  public showDisplayBox = true;
  public showButton = false;
  public isDisabled = true;
  public changesMade = false;
  public isGeneralError = false;
  public isServerError = false;
  public outStandingDebtchangeSubscription: Subscription | undefined;
  public remainingYearschangeSubscription: Subscription | undefined;
  public nominalRatechangeSubscription: Subscription | undefined;
  public animationStyle = getAnimationStyles();
  public inEditMode = false;

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
    private fb: FormBuilder,
    private messageBannerService: MessageBannerService,
    private myLoansService: MyLoansService
  ) {}

  ngOnDestroy(): void {
    if (this.outStandingDebtchangeSubscription) {
      this.outStandingDebtchangeSubscription.unsubscribe();
    }
    if (this.remainingYearschangeSubscription) {
      this.remainingYearschangeSubscription.unsubscribe();
    }
    if (this.nominalRatechangeSubscription) {
      this.nominalRatechangeSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.initialOutStandingDebt = String(this.loan.outstandingDebt);
    this.initialRemainingYears = String(this.loan.remainingYears);
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

    // Activate listener for changes
    this.outStandingDebtchangeSubscription = this.loanForm
      .get(this.outstandingDebtString)
      ?.valueChanges.subscribe(() => {
        if (
          this.isEditMode &&
          this.loanForm.controls[this.outstandingDebtString].dirty
        ) {
          this.changesMade = true;
          this.isDisabled = false;
          this.outstandingDebtIsError = false;
        }
      });

    this.remainingYearschangeSubscription = this.loanForm
      .get(this.remainingYearsString)
      ?.valueChanges.subscribe(() => {
        if (
          this.isEditMode &&
          this.loanForm.controls[this.remainingYearsString].dirty
        ) {
          this.changesMade = true;
          this.isDisabled = false;
          this.remainingYearsIsError = false;
        }
      });

    this.nominalRatechangeSubscription = this.loanForm
      .get(this.nominalRateString)
      ?.valueChanges.subscribe(() => {
        if (
          this.isEditMode &&
          this.loanForm.controls[this.nominalRateString].dirty
        ) {
          this.changesMade = true;
          this.isDisabled = false;
          this.nominalRateIsError = false;
        }
      });

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
  } // ngOnInit

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

  public disableForm(): void {
    this.loanForm.get(this.outstandingDebtString)?.disable();
    this.loanForm.get(this.remainingYearsString)?.disable();
    this.loanForm.get(this.nominalRateString)?.disable();
  }

  public setEditDisabled(): void {
    // Reset error
    this.outstandingDebtIsError = false;
    this.remainingYearsIsError = false;
    this.nominalRateIsError = false;

    // Run in this order for animation to be smooth
    this.changesMade = false;
    this.showButton = false;
    setTimeout(() => {
      this.myLoansService.setEditMode(null);

      this.inEditMode = false;
      this.isEditMode = false;
      this.hideEditIcon = false;
      this.showDisplayBox = true;

      this.loanForm
        .get(this.outstandingDebtString)
        ?.setValue(this.initialOutStandingDebt);

      this.loanForm
        .get(this.remainingYearsString)
        ?.setValue(this.initialRemainingYears);

      this.loanForm
        .get(this.nominalRateString)
        ?.setValue(this.initialNominalRate);
    }, 325);

    this.disableForm();
  }

  public enableForm(): void {
    this.loanForm.get(this.outstandingDebtString)?.enable();
    this.loanForm.get(this.remainingYearsString)?.enable();
    this.loanForm.get(this.nominalRateString)?.enable();
  }

  public setEditEnabled(): void {
    this.outstandingDebtIsError = false;
    this.remainingYearsIsError = false;
    this.nominalRateIsError = false;

    const check = this.myLoansService.getEditMode();

    if (check !== null) {
      return;
    }

    this.myLoansService.setEditMode(this.index);

    this.deactivateAllInput();

    this.showDisplayBox = false;
    this.showButton = true;
    this.isEditMode = true;
    this.hideEditIcon = true;
    setTimeout(() => {
      this.inEditMode = true;
    }, 500);
    this.enableForm();
  }

  get isLoanFormValid(): boolean {
    return (
      !!this.loanForm.get(this.outstandingDebtString)?.value &&
      !!this.loanForm.get(this.remainingYearsString)?.value &&
      !!this.loanForm.get(this.nominalRateString)?.value &&
      this.changesMade
    );
  }

  get ableTosave(): boolean {
    return this.isLoanFormValid && this.changesMade;
  }

  public save(): void {
    console.log('Saved clicked');
    if (this.changesMade === false || !this.ableTosave) return;

    this.changesMade = false;
    this.isDisabled = true;
    this.deactivateAllInput();

    // Reset form so its marked as pristine
    this.loanForm.markAsPristine();

    this.loanForm
      .get(this.outstandingDebtString)
      ?.setValue(this.initialOutStandingDebt);

    this.loanForm
      .get(this.remainingYearsString)
      ?.setValue(this.initialRemainingYears);

    this.loanForm
      .get(this.nominalRateString)
      ?.setValue(this.initialNominalRate);

    this.sendRequest();
  } // Save

  public sendRequest(): void {
    // Get the new values and then set it to initial value then send request
    const getOutstandingDebt = this.loanForm.get(this.outstandingDebtString)
      ?.value;

    const outstandingDebtDto = {
      outstandingDebt: getOutstandingDebt
    };

    const getRemainingYears = this.loanForm.get(this.remainingYearsString)
      ?.value;

    const remainingYearsDto = {
      remainingYears: getRemainingYears
    };

    const getNominalRate = this.loanForm.get(this.nominalRateString)?.value;

    const nominalRateDto = {
      nominalRate: getNominalRate
    };

    concat(
      // this.loansService.updateLoanOutstandingDebt(outstandingDebtDto)
      of(true).pipe(
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

            this.loanForm
              .get(this.outstandingDebtString)
              ?.setValue(this.initialOutStandingDebt);

            this.loanForm
              .get(this.remainingYearsString)
              ?.setValue(this.initialRemainingYears);

            this.loanForm
              .get(this.nominalRateString)
              ?.setValue(this.initialNominalRate);
          } else {
            this.messageBannerService.setView(
              'Endringene dine er lagret',
              3000,
              this.animationStyle.DROP_DOWN_UP,
              'success',
              window
            );

            console.log('success');

            this.initialOutStandingDebt = getOutstandingDebt;
            this.initialRemainingYears = getRemainingYears;
            this.initialNominalRate = getNominalRate;

            this.loanForm
              .get(this.outstandingDebtString)
              ?.setValue(this.initialOutStandingDebt);

            this.loanForm
              .get(this.remainingYearsString)
              ?.setValue(this.initialRemainingYears);

            this.loanForm
              .get(this.nominalRateString)
              ?.setValue(this.initialNominalRate);

            console.log(this.initialOutStandingDebt);
            console.log(this.initialRemainingYears);
            console.log(this.initialNominalRate);
            this.setEditDisabled();
            console.log('Saved!');
          }
        },
        (err) => {
          console.log(err);
          console.log('Error subscribtion');
        }
      );

    // this.loansService.updateLoanProduct(loanNameDto).subscribe(
    //   () => {
    //     console.log('Loan product successful !!!');
    //     this.setEditDisabled();
    //   },
    //   (err) => {
    //     console.log(err.title);
    //   }
    // );

    // this.loansService.updateLoanOutstandingDebt(outstandingDebtDto).subscribe(
    //   () => {
    //     console.log('Loan outstanding debt successful !!!');
    //     this.setEditDisabled();
    //   },
    //   (err) => {
    //     console.log(err.title);
    //   }
    // );

    // this.loansService.updateLoanReminingYears(remainingYearsDto).subscribe(
    //   () => {
    //     console.log('Loan remaining years successful !!!');
    //     this.setEditDisabled();
    //   },
    //   (err) => {
    //     console.log(err.title);
    //   }
    // );

    // ---------------------------------------------------------------------
  } // send request end
}
