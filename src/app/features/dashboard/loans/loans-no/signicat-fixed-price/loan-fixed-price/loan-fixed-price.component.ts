import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { bankOfferDto, LoanInfo, SignicatLoanInfoDto } from '@models/loans';
import { MessageBannerService } from '@services/message-banner.service';
import { LoansService } from '@services/remote-api/loans.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
import { concat, of, Subscription } from 'rxjs';
import { catchError, tap, toArray } from 'rxjs/operators';
import { FadeOut } from '@shared/animations/fade-out';
import { ButtonFadeInOut } from '@shared/animations/button-fade-in-out';
import { MyLoansService } from '../../../myloans.service';
import { Mask } from '@shared/constants/mask';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { NotificationService } from '@services/notification.service';
import { LoanTypeOption, nonListLoanType } from '@models/loan-type';
import { MatDialog } from '@angular/material';
import { AntiChurnDialogComponent } from '@features/dashboard/offers/anti-churn-dialog/anti-churn-dialog.component';
import { GenericChoiceDialogComponent } from '@shared/components/ui-components/dialogs/generic-choice-dialog/generic-choice-dialog.component';

@Component({
  selector: 'rente-loan-fixed-price',
  templateUrl: './loan-fixed-price.component.html',
  styleUrls: ['./loan-fixed-price.component.scss'],
  animations: [FadeOut, ButtonFadeInOut]
})
export class LoanFixedPriceComponent implements OnInit, OnDestroy {
  @Input() index: number;
  @Input() loan: LoanInfo;
  @Input() allOffers: bankOfferDto[];

  public loanForm: FormGroup;
  public isEditMode = false;
  public inEditMode = false;
  public hideEditIcon = false;
  public setOpacity = false;
  public selected = '';
  public loanTypeString: string;
  public loanTypeID: string;
  public showDisplayBox = true;
  public showButton = false;
  public isDisabled = true;
  public isGeneralError = false;
  public isServerError = false;
  public isAbleToSave = false;
  public loanTypeList: LoanTypeOption[] = nonListLoanType;
  public loansLength: number;

  public outStandingDebtchangeSubscription: Subscription | undefined;
  public remainingYearschangeSubscription: Subscription | undefined;
  public animationStyle = getAnimationStyles();
  public maskType = Mask;

  // Activate tabs
  public inputProductIsActive = false;
  public inputOutstandingDebtIsActive = false;
  public inputRemainingYearsIsActive = false;

  // Error handling
  public productIsError = false;
  public outstandingDebtIsError = false;
  public remainingYearsIsError = false;
  public isError = false;

  public loanNameString = 'loanName';
  public outstandingDebtString = 'outstandingDebt';
  public remainingYearsString = 'remainingYears';

  // Store value from input emitter
  public incomingValueOutstandingDebt: string;
  public incomingValueRemainingYears: string;
  public incomingValueNominalRate: string;

  // Store the inital value from api
  public initialLoanName: string;
  public initialOutStandingDebt: string | null;
  public initialRemainingYears: string | null;

  public initialEffectiveRate: number | null;
  public initialNominalRate: number | null;
  public initialTotalInterestAndTotalFee: number;
  public initialtotalInterestAndTotalFeeByRemainingYears: number;

  constructor(
    private loansService: LoansService,
    private fb: FormBuilder,
    private messageBannerService: MessageBannerService,
    private myLoansService: MyLoansService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    if (this.outStandingDebtchangeSubscription) {
      this.outStandingDebtchangeSubscription.unsubscribe();
    }
    if (this.remainingYearschangeSubscription) {
      this.remainingYearschangeSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    let correctValue = '';

    if (this.loan.remainingYears !== null) {
      // Check count of decimals and format it to 0 or 1 decimal
      const format = this.myLoansService.countDecimals(
        this.loan.remainingYears
      );
      if (format < 2) correctValue = String(this.loan.remainingYears);
      if (format > 1) correctValue = this.loan.remainingYears.toFixed(1);
    }

    this.initialLoanName = String(this.loan.loanName);
    this.initialOutStandingDebt = String(this.loan.outstandingDebt);
    this.initialRemainingYears = correctValue;
    this.loanTypeString = String(this.loan.loanName);

    // Extra variables to set on the component if a new loan is created
    this.initialEffectiveRate = this.loan.effectiveRate;
    this.initialNominalRate = this.loan.nominalRate;
    this.initialTotalInterestAndTotalFee = this.loan.totalInterestAndTotalFee;
    this.initialtotalInterestAndTotalFeeByRemainingYears = this.loan.totalInterestAndTotalFeeByRemainingYears;

    /*
     * Create an object of the same datatype from bank offers
     * To be able to set selected to a value
     * Since mat-select wants the default value to be the same datatype as the array it uses
     */

    // const transformDto = {
    //   name: this.loanTypeString,
    //   id: 'tag:finansportalen.no:feed/bank/boliglan/1622922',
    //   rate: 1.99
    // };

    // Demo test code necessary, deactivate when testing in signicat
    // this.allOffers.push(transformDto);

    // Demo selected filter
    // this.selected = this.allOffers.filter(
    //   (val) => val.name === transformDto.name
    // )[0].name;

    // Original working function filter
    this.selected = this.allOffers.filter(
      (val) => val.name === this.loan.loanName
    )[0].name;

    // this.loanTypeID = this.findLoanID(this.selected);

    this.loanForm = this.fb.group({
      loanName: [{ value: this.initialLoanName, disabled: true }],
      outstandingDebt: [
        { value: this.initialOutStandingDebt, disabled: true },
        [
          Validators.pattern(VALIDATION_PATTERN.nonNullThousand),
          Validators.max(100000000),
          Validators.required
        ]
      ],
      remainingYears: [
        { value: this.initialRemainingYears, disabled: true },
        [
          Validators.pattern(VALIDATION_PATTERN.year),
          Validators.max(99),
          Validators.required
        ]
      ]
    });

    this.isAbleToSave = false;
    this.disableForm();

    // Set incoming value or it will be undefined if only one input is changed
    this.incomingValueOutstandingDebt = this.initialOutStandingDebt;
    this.incomingValueRemainingYears = this.initialRemainingYears;

    // Listen for edit
    this.myLoansService
      .loanEditIndexAsObservable()
      .subscribe((currentIndex) => {
        if (currentIndex === null) {
          this.hideEditIcon = false;
          this.setOpacity = false;
        }
        if (currentIndex !== this.index && currentIndex !== null) {
          // Set timeout if a new loan is created,
          // or else it causes valueChangedAfterCheck error
          setTimeout(() => {
            this.hideEditIcon = true;
            this.setOpacity = true;
          }, 0);
        }
      });

    // Activate listener for changes
    this.outStandingDebtchangeSubscription = this.loanForm
      .get(this.outstandingDebtString)
      ?.valueChanges.subscribe(() => {
        // Get value regardless of other states
        this.incomingValueOutstandingDebt = this.loanForm.get(
          'outstandingDebt'
        )?.value;

        if (
          this.loanForm.get('outstandingDebt')?.dirty &&
          this.isErrorState(this.loanForm?.controls['outstandingDebt'])
        ) {
          this.outstandingDebtIsError = true;
        }

        if (
          this.loanForm.get('outstandingDebt')?.dirty &&
          !this.isErrorState(this.loanForm?.controls['outstandingDebt']) &&
          this.incomingValueRemainingYears.trim() !== ''
        ) {
          this.outstandingDebtIsError = false;
          this.isAbleToSave = true;
        } else {
          this.isAbleToSave = false;
        }
      });

    this.remainingYearschangeSubscription = this.loanForm
      .get(this.remainingYearsString)
      ?.valueChanges.subscribe(() => {
        // Get value
        this.incomingValueRemainingYears = this.loanForm.get(
          'remainingYears'
        )?.value;
        if (
          this.loanForm.get('remainingYears')?.dirty &&
          this.isErrorState(this.loanForm?.controls['remainingYears'])
        ) {
          this.remainingYearsIsError = true;
        }

        if (
          this.loanForm.get('remainingYears')?.dirty &&
          !this.isErrorState(this.loanForm?.controls['remainingYears']) &&
          this.incomingValueOutstandingDebt.trim() !== ''
        ) {
          this.remainingYearsIsError = false;
          this.isAbleToSave = true;
        } else {
          this.isAbleToSave = false;
        }
      });

    if (this.loan.id === 0) {
      this.setEditEnabled();

      // Has to be in a timeout to work
      // The new loan input cant be focused if not
      setTimeout(() => {
        this.disableForm();
        this.enableForm();
      }, 0);
    } else {
      this.disableForm();
    }

    // Get latest amount of loans of user, in case they want to delete the last loan
    // disable delete func when there is only one loan left
    this.myLoansService.getLoansAsObservable().subscribe((res) => {
      if (res === null) this.loansLength = 0;
      if (res !== null) this.loansLength = res.length;
    });

    // Set edit mode to null (if user leaves the page while on edit mode)
    // this.myLoansService.setEditMode(null);
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
    this.loanForm.get(this.loanNameString)?.disable();
    this.loanForm.get(this.outstandingDebtString)?.disable();
    this.loanForm.get(this.remainingYearsString)?.disable();
  }

  public enableForm(): void {
    this.loanForm.get(this.loanNameString)?.enable();
    this.loanForm.get(this.outstandingDebtString)?.enable();
    this.loanForm.get(this.remainingYearsString)?.enable();
  }

  public setInputProductActive(): void {
    // Deactivate first then set active for smooth transition
    this.inputOutstandingDebtIsActive = false;
    this.inputRemainingYearsIsActive = false;
    this.inputProductIsActive = true;
  }

  public setInputOutDebtActive(): void {
    // Deactivate first then set active for smooth transition
    this.inputProductIsActive = false;
    this.inputRemainingYearsIsActive = false;
    this.inputOutstandingDebtIsActive = true;
  }

  public setInputRemYearsActive(): void {
    // Deactivate first then set active for smooth transition
    this.inputProductIsActive = false;
    this.inputOutstandingDebtIsActive = false;
    this.inputRemainingYearsIsActive = true;
  }

  public deactivateAllInput(): void {
    this.inputProductIsActive = false;
    this.inputOutstandingDebtIsActive = false;
    this.inputRemainingYearsIsActive = false;
  }

  public findLoanID(loanName: string): string {
    for (const loan of this.allOffers) {
      if (loan.name === loanName) {
        return loan.id;
      }
    }
    alert('Loan name or ID not found!');
    return '';
  }

  public setEditDisabled(): void {
    // Reset error
    this.productIsError = false;
    this.outstandingDebtIsError = false;
    this.remainingYearsIsError = false;

    this.showButton = false;
    setTimeout(() => {
      this.myLoansService.setEditMode(null);

      // Reset the values back to initial
      this.selected = this.initialLoanName;

      this.loanTypeID = this.findLoanID(this.selected);

      this.loanForm
        .get(this.outstandingDebtString)
        ?.setValue(this.initialOutStandingDebt);

      this.loanForm
        .get(this.remainingYearsString)
        ?.setValue(this.initialRemainingYears);

      this.inEditMode = false;
      this.isEditMode = false;
      this.hideEditIcon = false;
      this.setOpacity = false;
      this.showDisplayBox = true;
    }, 325);

    this.disableForm();
  }

  public setEditEnabled(): void {
    // Reset error
    this.productIsError = false;
    this.outstandingDebtIsError = false;
    this.remainingYearsIsError = false;

    const check = this.myLoansService.getEditMode();

    if (check !== null) {
      console.log('Check != null!');
      return;
    }

    this.myLoansService.setEditMode(this.index);

    this.loanForm.markAsPristine();
    this.isAbleToSave = false;
    this.enableForm();
    this.deactivateAllInput();

    this.showDisplayBox = false;
    this.showButton = true;
    this.isEditMode = true;
    this.hideEditIcon = true;
    setTimeout(() => {
      this.inEditMode = true;
    }, 325);
  }

  public matSelectChanged(): void {
    this.productIsError = false;

    // Check for general error if server error or if the regex error from input
    if (
      !this.isErrorState(this.loanForm?.controls['remainingYears']) &&
      !this.isErrorState(this.loanForm?.controls[this.outstandingDebtString])
    ) {
      this.isAbleToSave = true;
    }
  }

  // ----------------------------   SAVE   --------------------------------

  public save(): void {
    if (!this.isAbleToSave) return;

    this.deactivateAllInput();

    this.sendRequest();
  }

  public sendRequest(): void {
    // Set the initial values back as reset sets the values to null
    this.loanTypeID = this.findLoanID(this.selected);

    const getOutstandingDebt = this.myLoansService.getNumericValueFormated(
      this.incomingValueOutstandingDebt
    );

    const getRemainingYears = this.myLoansService.formatComma(
      this.incomingValueRemainingYears
    );

    const getFee = Number(this.loan.fee);

    const getLoanType = String(
      this.loanTypeList.filter((val) => val.value === this.loan.loanType)[0]
        .value
    );

    const getLoanSubType = String(
      this.loanTypeList.filter((val) => val.value === getLoanType)[0].subType
    );

    let getNominalRate = 0;

    if (this.loan.nominalRate !== null) {
      getNominalRate = this.myLoansService.formatComma(
        String(this.loan.nominalRate)
      );
    }

    const sendToBEDto = {
      fee: getFee,
      id: this.loan.id,
      loanSubType: getLoanSubType,
      loanType: getLoanType,
      nominalInterestRate: getNominalRate,
      outstandingDebt: getOutstandingDebt,
      productId: this.loanTypeID,
      remainingYears: getRemainingYears
    };

    console.log('Sent obj:', sendToBEDto);

    if (this.loan.id === 0) {
      console.log('Creating new loan:', sendToBEDto);
      this.createNewLoan(sendToBEDto);
    } else {
      console.log('Updating loan:', sendToBEDto);
      this.updateLoan(sendToBEDto);
    }
  } // send request end

  public updateLoan(obj: SignicatLoanInfoDto): void {
    this.isAbleToSave = false;

    concat(
      this.loansService.updateLoan([obj]).pipe(
        catchError((err) => {
          console.log(err);
          console.log('Could not create a new loan!');
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
      this.myLoansService.fetchLoans().pipe(
        catchError((err) => {
          console.log(err);
          console.log('Could not fetch loans!');
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
            if (this.isGeneralError) {
              this.messageBannerService.setView(
                'En eller flere av endringene ble ikke oppdatert',
                5000,
                this.animationStyle.DROP_DOWN_UP,
                'error',
                window
              );
            }
            if (this.isServerError) {
              this.messageBannerService.setView(
                'Oops, noe gikk galt. Prøv igjen senere',
                5000,
                this.animationStyle.DROP_DOWN_UP,
                'error',
                window
              );
            }

            this.isAbleToSave = false;
          } else {
            this.messageBannerService.setView(
              'Endringene dine er lagret',
              3000,
              this.animationStyle.DROP_DOWN_UP,
              'success',
              window
            );

            // Set the loan type to the selected
            this.initialLoanName = this.selected;

            // Save the original format in string with mask
            this.initialOutStandingDebt = this.incomingValueOutstandingDebt;
            this.initialRemainingYears = this.incomingValueRemainingYears;

            const resLoans = res[1][0].loans[this.index];
            console.log('resLoan: ', resLoans);

            this.initialEffectiveRate = resLoans.effectiveRate;
            this.initialNominalRate = resLoans.nominalRate;
            this.initialTotalInterestAndTotalFee =
              resLoans.totalInterestAndTotalFee;
            this.initialtotalInterestAndTotalFeeByRemainingYears =
              resLoans.totalInterestAndTotalFeeByRemainingYears;

            this.setEditDisabled();
            this.notificationService.setOfferNotification();
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  public createNewLoan(obj: SignicatLoanInfoDto): void {
    this.isAbleToSave = false;

    concat(
      this.loansService.createNewLoan([obj]).pipe(
        catchError((err) => {
          console.log(err);
          console.log('Could not create a new loan!');
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
      this.myLoansService.fetchLoans().pipe(
        tap((res) => console.log('Tap in loan fixed!', res)),
        catchError((err) => {
          console.log(err);
          console.log('Could not fetch loans!');
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
            if (this.isGeneralError) {
              this.messageBannerService.setView(
                'Oops, noe gikk galt',
                5000,
                this.animationStyle.DROP_DOWN_UP,
                'error',
                window
              );
            }
            if (this.isServerError) {
              this.messageBannerService.setView(
                'Kan ikke opprette et nytt lån for øyeblikket, prøv igjen senere',
                5000,
                this.animationStyle.DROP_DOWN_UP,
                'error',
                window
              );
            }

            this.isAbleToSave = false;
          } else {
            this.messageBannerService.setView(
              'Nytt lån er opprettet',
              3000,
              this.animationStyle.DROP_DOWN_UP,
              'success',
              window
            );

            // Save the original format in string with mask
            this.initialOutStandingDebt = this.incomingValueOutstandingDebt;
            this.initialRemainingYears = this.incomingValueRemainingYears;

            const resLoans = res[1][0].loans[this.index];
            console.log('resLoan: ', resLoans);

            this.initialEffectiveRate = resLoans.effectiveRate;
            this.initialNominalRate = resLoans.nominalRate;
            this.initialTotalInterestAndTotalFee =
              resLoans.totalInterestAndTotalFee;
            this.initialtotalInterestAndTotalFeeByRemainingYears =
              resLoans.totalInterestAndTotalFeeByRemainingYears;

            this.setEditDisabled();
            this.notificationService.setOfferNotification();
          }
        },
        (err) => {
          console.log(err);
          console.log('This is reaching the error state after subscribe');
        }
      );
  }

  public deleteLoan(): void {
    // const confirmDelete =
    this.dialog.open(GenericChoiceDialogComponent, {
      data: {
        onConfirm: () => {
          console.log('Confirmed DELETE!');
          this.deleteConfirmed();
        },
        onClose: () => {
          this.setEditDisabled();
        },
        header: 'Bekreft sletting av lån',
        text: `Er du sikker på at du vil slette lån ${this.index + 1}?`,
        cancelText: 'Avbryt',
        confirmText: 'Ja, slett lån'
      }
    });
  }

  public deleteConfirmed(): void {
    const currentLoanIndex = this.myLoansService.getEditMode();

    if (currentLoanIndex === null) {
      alert('Loan index is null');
      return;
    }

    const loanId = this.loan.id;

    if (loanId === 0) {
      this.myLoansService.deleteLoan(loanId);
      return;
    }

    this.loansService.deleteLoan(loanId).subscribe(
      () => {
        // Remove from UI
        this.myLoansService.deleteLoan(loanId);

        this.messageBannerService.setView(
          'Lånet er slettet',
          3000,
          this.animationStyle.DROP_DOWN_UP,
          'success',
          window
        );
      },
      (err) => {
        console.log(err);
        this.messageBannerService.setView(
          'Oops, noe gikk galt. Lånet ble ikke slettet. Prøv igjen senere',
          5000,
          this.animationStyle.DROP_DOWN_UP,
          'error',
          window
        );
      }
    );
  }

  public isAbleToDelete(): boolean {
    const store = this.myLoansService.getLoansValue();

    if (store.length === 2 && store.some((val) => val.isDeleted === true))
      return false;

    if (this.isEditMode && store.length > 1) {
      return true;
    }

    return false;
  }
} // Class end
