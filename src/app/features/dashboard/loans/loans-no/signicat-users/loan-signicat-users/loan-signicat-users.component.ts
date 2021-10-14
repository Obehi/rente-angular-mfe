import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MyLoansService } from '@features/dashboard/loans/myloans.service';
import { bankOfferDto, LoanInfo, SignicatLoanInfoDto } from '@models/loans';
import { MessageBannerService } from '@services/message-banner.service';
import { LoansService } from '@services/remote-api/loans.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
import { ButtonFadeInOut } from '@shared/animations/button-fade-in-out';
import { FadeOut } from '@shared/animations/fade-out';
import { Mask } from '@shared/constants/mask';
import { Subscription } from 'rxjs';
import { nonListLoanType, LoanTypeOption } from '@models/loan-type';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { NotificationService } from '@services/notification.service';
import { catchError, delay, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { GenericChoiceDialogComponent } from '@shared/components/ui-components/dialogs/generic-choice-dialog/generic-choice-dialog.component';
import { RxjsOperatorService } from '@services/rxjs-operator.service';

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
  public loanTypeSelected = '';
  public loanTypeList: LoanTypeOption[] = nonListLoanType;
  public loansLength: number;
  public displayIndexString: string;

  public animationStyle = getAnimationStyles();
  public maskType = Mask;

  // Store value from input emitter
  public incomingValueOutstandingDebt: string;
  public incomingValueRemainingYears: string;
  public incomingValueNominalRate: string;
  public incomingValueFee: string;

  // Activate input color when focused
  public inputOutstandingDebtIsActive = false;
  public inputRemainingYearsIsActive = false;
  public inputNominalRateIsActive = false;
  public inputFeeIsActive = false;
  public inputLoanTypeIsActive = false;

  // Error handling
  public isError = false;

  public outstandingDebtString = 'outstandingDebt';
  public remainingYearsString = 'remainingYears';
  public nominalRateString = 'nominalRate';

  // Store the inital value from api
  public initialOutStandingDebt: string | null;
  public initialRemainingYears: string | null;
  public initialNominalRate: string | null;
  public initialFee: string | null;
  public initialLoanType: string;

  public initialEffectiveRate: number;
  public initialTotalInterestAndTotalFee: number;
  public initialtotalInterestAndTotalFeeByRemainingYears: number;

  public changeOutstandingDebtSubscription: Subscription | undefined;
  public changeRemainingYearsSubscription: Subscription | undefined;
  public changeNominalRateSubscription: Subscription | undefined;
  public changeFeeSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private loansService: LoansService,
    private messageBannerService: MessageBannerService,
    private myLoansService: MyLoansService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private rxjsOperatorService: RxjsOperatorService
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
    if (this.changeFeeSubscription) {
      this.changeFeeSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    // Make sure edit mode is null to prevent bugs
    this.myLoansService.setEditMode(null);

    if (this.loan.id !== 0) {
      this.displayIndexString = `Lån ${this.index + 1}`;
    } else {
      this.displayIndexString = 'Ny lån';
    }

    // When creating a new loan, set initial save state
    if (this.loan.id === 0) this.isAbleToSave = false;

    let correctValue: string | null = '';

    if (this.loan.remainingYears !== null) {
      // Check count of decimals and format it to 0 or 1 decimal
      const format = this.myLoansService.countDecimals(
        this.loan.remainingYears
      );
      if (format < 2) correctValue = String(this.loan.remainingYears);
      if (format > 1) correctValue = this.loan.remainingYears.toFixed(1);
    } else {
      correctValue = null;
    }

    // Set initial value
    this.initialOutStandingDebt = String(this.loan.outstandingDebt);
    this.initialRemainingYears = String(correctValue);
    this.initialNominalRate = String(this.loan.nominalRate);
    this.initialFee = String(this.loan.fee);

    // Extra variables to set on the component if a new loan is created
    this.initialEffectiveRate = this.loan.effectiveRate;
    this.initialTotalInterestAndTotalFee = this.loan.totalInterestAndTotalFee;
    this.initialtotalInterestAndTotalFeeByRemainingYears = this.loan.totalInterestAndTotalFeeByRemainingYears;

    // Backend returns loantype in english, filter the list and return the name in obj
    this.initialLoanType = String(
      this.loanTypeList.filter((val) => val.value === this.loan.loanType)[0]
        .name
    );

    this.loanTypeSelected = this.initialLoanType;

    this.loanForm = this.fb.group({
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
          Validators.max(70),
          Validators.required
        ]
      ],
      nominalRate: [
        { value: this.initialNominalRate, disabled: true },
        [Validators.max(5), Validators.min(1), Validators.required]
      ],
      fee: [
        { value: this.initialFee, disabled: true },
        [Validators.max(100), Validators.required]
      ],
      loanType: [{ value: this.initialLoanType, disabled: true }]
    });

    this.isAbleToSave = false;

    // Set incoming value or it will be undefined if only one input is changed
    this.incomingValueOutstandingDebt = this.initialOutStandingDebt;
    this.incomingValueRemainingYears = this.initialRemainingYears;
    this.incomingValueNominalRate = this.initialNominalRate;
    this.incomingValueFee = this.initialFee;

    // Listen for which loan is in editmode (if more than 1 loan is present)
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

    this.loanForm.valueChanges.subscribe(() => {
      // Update the values from FORM
      this.updateValuesForm();

      const outstandingDebt = this.loanForm.get('outstandingDebt');
      const remainingYears = this.loanForm.get('remainingYears');
      const nominalRate = this.loanForm.get('nominalRate');
      const fee = this.loanForm.get('fee');

      console.log('Check if is right values');
      console.log(outstandingDebt?.value);
      console.log(remainingYears?.value);
      console.log(nominalRate?.value);
      console.log(fee?.value);

      const allControls = [outstandingDebt, remainingYears, nominalRate, fee];

      let canSave = true;

      if (this.loanForm.dirty === false) {
        canSave = false;
      }

      allControls.forEach((control: AbstractControl) => {
        if (
          this.isErrorState(control) ||
          String(control.value).trim() === '' ||
          control.value === 'null'
        ) {
          canSave = false;
        }
      });

      this.isAbleToSave = canSave;
    });
    /* 
      this.changeOutstandingDebtSubscription = this.loanForm
        .get('outstandingDebt')
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

          if (!this.isErrorState(this.loanForm?.controls['outstandingDebt'])) {
            this.outstandingDebtIsError = false;
          }

          if (
            this.loanForm.get('outstandingDebt')?.dirty &&
            !this.isErrorState(this.loanForm?.controls['outstandingDebt']) &&
            this.incomingValueRemainingYears.trim() !== '' &&
            this.incomingValueNominalRate.trim() !== '' &&
            this.incomingValueFee.trim() !== ''
          ) {
            this.isAbleToSave = true;
          } else {
            this.isAbleToSave = false;
          }
        });

      this.changeRemainingYearsSubscription = this.loanForm
        .get('remainingYears')
        ?.valueChanges.subscribe(() => {
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
          this.incomingValueOutstandingDebt.trim() !== '' &&
          !!this.incomingValueOutstandingDebt &&
          this.incomingValueNominalRate.trim() !== '' &&
          !!this.incomingValueNominalRate &&
          this.incomingValueFee.trim() !== '' &&
          !!this.incomingValueFee
        ) {
          this.isAbleToSave = true;
        } else {
          this.isAbleToSave = false;
        }
      });

          if (
            this.loanForm.get('remainingYears')?.dirty &&
            !this.isErrorState(this.loanForm?.controls['remainingYears']) &&
            this.incomingValueOutstandingDebt.trim() !== '' &&
            this.incomingValueNominalRate.trim() !== '' &&
            this.incomingValueFee.trim() !== ''
          ) {
            this.isAbleToSave = true;
          } else {
            this.isAbleToSave = false;
          }
        });

      this.changeNominalRateSubscription = this.loanForm
        .get('nominalRate')
        ?.valueChanges.subscribe(() => {
          this.incomingValueNominalRate = this.loanForm.get('nominalRate')?.value;

          const check = this.myLoansService.formatComma(
            this.incomingValueNominalRate.replace(/\s/g, '')
          );

          if (
            (this.loanForm.get('nominalRate')?.dirty &&
              this.isErrorState(this.loanForm?.controls['nominalRate'])) ||
            check > 4
          ) {
            this.nominalRateIsError = true;
          }

          if (
            !this.isErrorState(this.loanForm?.controls['nominalRate']) &&
            check < 5
          ) {
            this.nominalRateIsError = false;
          }

          if (
            this.loanForm.get('nominalRate')?.dirty &&
            !this.isErrorState(this.loanForm?.controls['nominalRate']) &&
            this.incomingValueOutstandingDebt.trim() !== '' &&
            this.incomingValueRemainingYears.trim() !== '' &&
            this.incomingValueFee.trim() !== '' &&
            check < 5
          ) {
            this.isAbleToSave = true;
          } else {
            this.isAbleToSave = false;
          }
        });

        if (
          this.loanForm.get('nominalRate')?.dirty &&
          !this.isErrorState(this.loanForm?.controls['nominalRate']) &&
          this.incomingValueOutstandingDebt.trim() !== '' &&
          !!this.incomingValueOutstandingDebt &&
          this.incomingValueRemainingYears.trim() !== '' &&
          !!this.incomingValueRemainingYears &&
          this.incomingValueFee.trim() !== '' &&
          !!this.incomingValueFee &&
          check < 5
        ) {
          this.isAbleToSave = true;
        } else {
          this.isAbleToSave = false;
        }
      });

    this.changeFeeSubscription = this.loanForm
      .get('fee')
      ?.valueChanges.subscribe(() => {
        this.incomingValueFee = this.loanForm.get('fee')?.value;

        if (
          this.loanForm.get('fee')?.dirty &&
          this.isErrorState(this.loanForm?.controls['fee'])
        ) {
          this.feeIsError = true;
        }

        if (!this.isErrorState(this.loanForm?.controls['fee'])) {
            this.feeIsError = false;
        }

        if (
          this.loanForm.get('fee')?.dirty &&
          !this.isErrorState(this.loanForm?.controls['fee']) &&
          this.incomingValueOutstandingDebt.trim() !== '' &&
          !!this.incomingValueOutstandingDebt &&
          this.incomingValueRemainingYears.trim() !== '' &&
          !!this.incomingValueRemainingYears &&
          this.incomingValueNominalRate.trim() !== '' &&
          !!this.incomingValueNominalRate
        ) {
          this.isAbleToSave = true;
        } else {
          this.isAbleToSave = false;
        }
      });
*/
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
  } // ngOnInit

  public updateValuesForm(): void {
    // Get value regardless of other states
    this.incomingValueOutstandingDebt = this.loanForm.get(
      'outstandingDebt'
    )?.value;

    this.incomingValueRemainingYears = this.loanForm.get(
      'remainingYears'
    )?.value;

    this.incomingValueNominalRate = this.loanForm.get('nominalRate')?.value;

    this.incomingValueFee = this.loanForm.get('fee')?.value;
  }

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
    this.loanForm.get('fee')?.disable();
  }

  public enableForm(): void {
    this.loanForm.get(this.outstandingDebtString)?.enable();
    this.loanForm.get(this.remainingYearsString)?.enable();
    this.loanForm.get(this.nominalRateString)?.enable();
    this.loanForm.get('fee')?.enable();
  }

  public setInputOutDebtActive(): void {
    this.inputRemainingYearsIsActive = false;
    this.inputNominalRateIsActive = false;
    this.inputFeeIsActive = false;
    this.inputLoanTypeIsActive = false;
    this.inputOutstandingDebtIsActive = true;
  }

  public setInputRemYearsActive(): void {
    this.inputOutstandingDebtIsActive = false;
    this.inputNominalRateIsActive = false;
    this.inputFeeIsActive = false;
    this.inputLoanTypeIsActive = false;
    this.inputRemainingYearsIsActive = true;
  }

  public setInputNominalRateActive(): void {
    this.inputOutstandingDebtIsActive = false;
    this.inputRemainingYearsIsActive = false;
    this.inputFeeIsActive = false;
    this.inputLoanTypeIsActive = false;
    this.inputNominalRateIsActive = true;
  }

  public setInputFeeActive(): void {
    this.inputOutstandingDebtIsActive = false;
    this.inputRemainingYearsIsActive = false;
    this.inputNominalRateIsActive = false;
    this.inputLoanTypeIsActive = false;
    this.inputFeeIsActive = true;
  }

  public setInputLoanTypeActive(): void {
    // Deactivate first then set active for smooth transition
    this.inputOutstandingDebtIsActive = false;
    this.inputRemainingYearsIsActive = false;
    this.inputNominalRateIsActive = false;
    this.inputFeeIsActive = false;
    this.inputLoanTypeIsActive = true;
  }

  public deactivateAllInput(): void {
    this.inputOutstandingDebtIsActive = false;
    this.inputRemainingYearsIsActive = false;
    this.inputNominalRateIsActive = false;
    this.inputFeeIsActive = false;
    this.inputLoanTypeIsActive = false;
  }

  public setEditDisabled(): void {
    /*
     If its a newly created loan and user cancels the edit, delete the loan created
    */
    if (this.loan.id === 0 && !this.isAbleToSave) {
      this.myLoansService.deleteLoanTrigger(this.loan.id);
    }
    // Reset error

    // Run in this order for animation to be smooth
    this.showButton = false;
    setTimeout(() => {
      this.myLoansService.setEditMode(null);
      this.loanTypeSelected = this.initialLoanType;

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

    // Needs to be later than the deactivate animation to trigger the slide animation on the blue-box-edit
    setTimeout(() => {
      const idx = this.index + 1;
      const el = document.getElementById(idx.toString());

      if (!!el) {
        console.log('Removing height');
        el.style.removeProperty('height');
      }
    }, 100);

    this.disableForm();
  }

  public setEditEnabled(): void {
    const idx = this.index + 1;
    const el = document.getElementById(idx.toString());

    if (!!el) {
      console.log('Adding height');
      const elHeight = el.getBoundingClientRect().height;
      el.style.height = `${elHeight.toString()}px`;
    }

    setTimeout(() => {
      const check = this.myLoansService.getEditMode();

      if (check !== null) {
        console.log('Check is NOT NULL!!');
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
    }, 0);
    setTimeout(() => {
      this.inEditMode = true;
    }, 500);
  }

  public matSelectChanged(): void {
    if (
      this.isErrorState(this.loanForm?.controls[this.outstandingDebtString]) &&
      this.isErrorState(this.loanForm?.controls[this.remainingYearsString]) &&
      this.isErrorState(this.loanForm.controls[this.nominalRateString]) &&
      this.isErrorState(this.loanForm.controls['fee'])
    ) {
      this.isAbleToSave = false;
    }
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

    const getRemainingYears = this.myLoansService.formatComma(
      this.incomingValueRemainingYears
    );

    const getNominalRate = this.myLoansService.formatComma(
      this.incomingValueNominalRate
    );

    const getFee = Number(this.incomingValueFee);

    const getLoanType = String(
      this.loanTypeList.filter((val) => val.name === this.loanTypeSelected)[0]
        .value
    );

    const getLoanSubType = String(
      this.loanTypeList.filter((val) => val.value === getLoanType)[0].subType
    );

    const sendToBEDto = {
      fee: getFee,
      id: this.loan.id,
      loanSubType: getLoanSubType,
      loanType: getLoanType,
      nominalInterestRate: getNominalRate,
      outstandingDebt: getOutstandingDebt,
      productId: '',
      remainingYears: getRemainingYears
    };

    if (this.loan.id === 0) {
      this.createNewLoan(sendToBEDto);
    } else {
      this.updateLoan(sendToBEDto);
    }
  }

  // returns null if successful
  public updateLoan(loan: SignicatLoanInfoDto): void {
    this.isAbleToSave = false;

    this.loansService
      .updateLoan([loan])
      .pipe(
        catchError(
          this.rxjsOperatorService.handleErrorWithNotification(
            'En eller flere av endringene ble ikke oppdatert',
            5000
          )
        )
      )
      .subscribe(() => {
        // Update loan numbers
        this.myLoansService.reloadLoans();

        this.messageBannerService.setView(
          'Endringene dine er lagret',
          3000,
          this.animationStyle.DROP_DOWN_UP,
          'success',
          window
        );

        this.setEditDisabled();
        this.notificationService.setOfferNotification();
      });
  }

  public createNewLoan(loan: SignicatLoanInfoDto): void {
    this.loansService
      .createNewLoan([loan])
      .pipe(
        catchError(
          this.rxjsOperatorService.handleErrorWithNotification(
            'Oops, noe gikk galt. Kunne ikke opprette et nytt lån',
            5000
          )
        )
      )
      .subscribe(() => {
        this.initialLoanType = this.loanTypeSelected;
        this.initialOutStandingDebt = this.incomingValueOutstandingDebt;
        this.initialRemainingYears = this.incomingValueRemainingYears;
        this.initialNominalRate = this.incomingValueNominalRate;
        this.initialFee = this.incomingValueFee;

        this.initialEffectiveRate = 0;
        this.initialTotalInterestAndTotalFee = 0;
        this.initialtotalInterestAndTotalFeeByRemainingYears = 0;

        this.messageBannerService.setView(
          'Nytt lån er opprettet',
          3000,
          this.animationStyle.DROP_DOWN_UP,
          'success',
          window
        );

        this.setEditDisabled();
        this.notificationService.setOfferNotification();

        // isAbleToSave has to be after the edit disabled to make the new loan popup before updating
        this.isAbleToSave = false;

        // Mark as new loan created
        this.myLoansService.setNewlyCreatedLoanStatus(true);

        this.myLoansService.reloadLoans();
      });
  }

  public deleteLoan(): void {
    this.dialog.open(GenericChoiceDialogComponent, {
      data: {
        onConfirm: () => {
          this.myLoansService.deleteLoanTrigger(this.loan.id);
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
      console.log('Loan index is null');
      return;
    }

    const loanId = this.loan.id;

    if (loanId === 0) {
      this.myLoansService.deleteLoan(loanId);
      return;
    }

    this.loansService
      .deleteLoan(loanId)
      .pipe(
        catchError(
          this.rxjsOperatorService.handleErrorWithNotification(
            'Oops, noe gikk galt. Lånet ble ikke slettet. Prøv igjen senere',
            5000
          )
        )
      )
      .subscribe(() => {
        // Re move from UI
        this.myLoansService.deleteLoan(loanId);

        // Update Overview with new numbers
        this.myLoansService.reloadLoans();

        this.messageBannerService.setView(
          'Lånet er slettet',
          3000,
          this.animationStyle.DROP_DOWN_UP,
          'success',
          window
        );
      });
  }

  public isAbleToDelete(): boolean {
    const store = this.myLoansService.getLoansValue();
    if (this.loan.id === 0) return false;
    if (store.length === 2 && store.some((val) => val.isDeleted === true))
      return false;

    if (this.isEditMode && store.length > 1) {
      return true;
    }

    return false;
  }
}
