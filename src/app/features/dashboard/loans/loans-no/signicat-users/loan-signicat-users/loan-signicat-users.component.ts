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
  public isEmptyPlaceHolder = false;
  public loanTypeSelected = '';
  public loanTypeList: LoanTypeOption[] = nonListLoanType;
  public loansLength: number;

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
  public outstandingDebtIsError = false;
  public remainingYearsIsError = false;
  public nominalRateIsError = false;
  public feeIsError = false;
  public loanTypeIsError = false;
  public isError = false;

  public outstandingDebtString = 'outstandingDebt';
  public remainingYearsString = 'remainingYears';
  public nominalRateString = 'nominalRate';

  // Store the inital value from api
  public initialOutStandingDebt: string;
  public initialRemainingYears: string;
  public initialNominalRate: string;
  public initialFee: string;
  public initialLoanType: string;

  public changeOutstandingDebtSubscription: Subscription | undefined;
  public changeRemainingYearsSubscription: Subscription | undefined;
  public changeNominalRateSubscription: Subscription | undefined;
  public changeFeeSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private loansService: LoansService,
    private messageBannerService: MessageBannerService,
    private myLoansService: MyLoansService,
    private notificationService: NotificationService
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
    // Check count of decimals and format it to 0 or 1 decimal
    const format = this.myLoansService.countDecimals(this.loan.remainingYears);
    let correctValue = '';
    if (format < 2) correctValue = String(this.loan.remainingYears);
    if (format > 1) correctValue = this.loan.remainingYears.toFixed(1);

    // Set initial value
    this.initialOutStandingDebt = String(this.loan.outstandingDebt);
    this.initialRemainingYears = String(correctValue);
    this.initialNominalRate = String(this.loan.nominalRate);
    this.initialFee = String(this.loan.fee);

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
        [Validators.max(5), Validators.required]
      ],
      fee: [
        { value: this.initialFee, disabled: true },
        [Validators.max(100), , Validators.required]
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

    this.changeOutstandingDebtSubscription = this.loanForm
      .get('outstandingDebt')
      ?.valueChanges.subscribe(() => {
        if (
          this.loanForm.get('outstandingDebt')?.dirty &&
          this.isErrorState(this.loanForm?.controls['outstandingDebt'])
        ) {
          this.outstandingDebtIsError = true;
        }

        if (
          this.loanForm.get('outstandingDebt')?.dirty &&
          !this.isErrorState(this.loanForm?.controls['outstandingDebt'])
        ) {
          this.outstandingDebtIsError = false;
          this.isAbleToSave = true;
          this.incomingValueOutstandingDebt = this.loanForm.get(
            'outstandingDebt'
          )?.value;
        } else {
          this.isAbleToSave = false;
        }
      });

    this.changeRemainingYearsSubscription = this.loanForm
      .get('remainingYears')
      ?.valueChanges.subscribe(() => {
        if (
          this.loanForm.get('remainingYears')?.dirty &&
          this.isErrorState(this.loanForm?.controls['remainingYears'])
        ) {
          this.remainingYearsIsError = true;
        }

        if (
          this.loanForm.get('remainingYears')?.dirty &&
          !this.isErrorState(this.loanForm?.controls['remainingYears'])
        ) {
          this.remainingYearsIsError = false;
          this.isAbleToSave = true;
          this.incomingValueRemainingYears = this.loanForm.get(
            'remainingYears'
          )?.value;
        } else {
          this.isAbleToSave = false;
        }
      });

    this.changeNominalRateSubscription = this.loanForm
      .get('nominalRate')
      ?.valueChanges.subscribe(() => {
        if (
          this.loanForm.get('nominalRate')?.dirty &&
          this.isErrorState(this.loanForm?.controls['nominalRate'])
        ) {
          this.nominalRateIsError = true;
        }

        if (
          this.loanForm.get('nominalRate')?.dirty &&
          !this.isErrorState(this.loanForm?.controls['nominalRate'])
        ) {
          this.nominalRateIsError = false;
          this.isAbleToSave = true;
          this.incomingValueNominalRate = this.loanForm.get(
            'nominalRate'
          )?.value;
        } else {
          this.isAbleToSave = false;
        }
      });

    this.changeFeeSubscription = this.loanForm
      .get('fee')
      ?.valueChanges.subscribe(() => {
        if (
          this.loanForm.get('fee')?.dirty &&
          this.isErrorState(this.loanForm?.controls['fee'])
        ) {
          this.feeIsError = true;
        }

        if (
          this.loanForm.get('fee')?.dirty &&
          !this.isErrorState(this.loanForm?.controls['fee'])
        ) {
          this.feeIsError = false;
          this.isAbleToSave = true;
          this.incomingValueFee = this.loanForm.get('fee')?.value;
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
    // Reset error
    this.outstandingDebtIsError = false;
    this.remainingYearsIsError = false;
    this.nominalRateIsError = false;
    this.feeIsError = false;
    this.loanTypeIsError = false;

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

    this.disableForm();
  }

  public setEditEnabled(): void {
    this.outstandingDebtIsError = false;
    this.remainingYearsIsError = false;
    this.nominalRateIsError = false;
    this.feeIsError = false;
    this.loanTypeIsError = false;

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
    // this.setOpacity = true;
    setTimeout(() => {
      this.inEditMode = true;
    }, 500);
  }

  public matSelectChanged(): void {
    this.loanTypeIsError = false;

    // Check for general error if server error or if the regex error from input
    if (
      !this.isErrorState(this.loanForm?.controls[this.outstandingDebtString]) &&
      !this.isErrorState(this.loanForm?.controls[this.remainingYearsString]) &&
      !this.isErrorState(this.loanForm.controls[this.nominalRateString]) &&
      !this.isErrorState(this.loanForm.controls['fee'])
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
      console.log('Creating new loan:', sendToBEDto);
      this.createNewLoan(sendToBEDto);
    } else {
      console.log('Updating loan:', sendToBEDto);
      this.updateLoan(sendToBEDto);
    }
  } // send request end

  public updateLoan(obj: SignicatLoanInfoDto): void {
    this.loansService.updateLoan([obj]).subscribe(
      (res) => {
        console.log(res);

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
        this.initialFee = this.incomingValueFee;

        // Set the loan type to the selected
        this.initialLoanType = this.loanTypeList.filter(
          (val) => val.value === obj.loanType
        )[0].name;

        this.setEditDisabled();
        this.notificationService.setOfferNotification();
      },
      (err) => {
        console.log(err);

        if (err.status < 500) {
          this.isGeneralError = true;
          this.messageBannerService.setView(
            'En eller flere av endringene ble ikke oppdatert',
            5000,
            this.animationStyle.DROP_DOWN_UP,
            'error',
            window
          );
        }
        if (err.status > 499) {
          this.isServerError = true;
          this.messageBannerService.setView(
            'Oops, noe gikk galt. Prøv igjen senere',
            5000,
            this.animationStyle.DROP_DOWN_UP,
            'error',
            window
          );
        }

        this.isAbleToSave = false;
      }
    );
  }

  public createNewLoan(obj: SignicatLoanInfoDto): void {
    this.loansService.createNewLoan([obj]).subscribe(
      (res) => {
        console.log(res);

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
        this.initialNominalRate = this.incomingValueNominalRate;
        this.initialFee = this.incomingValueFee;

        this.setEditDisabled();
        this.notificationService.setOfferNotification();
      },
      (err) => {
        console.log(err);

        if (err.status < 500) {
          this.isGeneralError = true;
          this.messageBannerService.setView(
            'Oops, noe gikk galt',
            5000,
            this.animationStyle.DROP_DOWN_UP,
            'error',
            window
          );
        }
        if (err.status > 499) {
          this.isServerError = true;
          this.messageBannerService.setView(
            'Kan ikke opprette et nytt lån for øyeblikket, prøv igjen senere',
            5000,
            this.animationStyle.DROP_DOWN_UP,
            'error',
            window
          );
        }

        this.isAbleToSave = false;
      }
    );
  }

  // -------------------------------------------------- || ------------------------------------

  public deleteLoan(): void {
    const currentLoanIndex = this.myLoansService.getEditMode();
    console.log('Loan index: ');
    console.log(currentLoanIndex);

    if (currentLoanIndex === null) {
      console.log('Loan index is null');
      return;
    }
    alert('Deleting loan');

    const loanId = this.loan.id;

    if (loanId === 0) {
      this.myLoansService.deleteLoan(loanId);
      return;
    }

    this.loansService.deleteLoan(loanId).subscribe(
      () => {
        // Remove from UI
        this.myLoansService.deleteLoan(loanId);

        /**
         * Remove from list so the loans length changes
         * Loans length is used to removed delete function
         * if theres only one loan left
         */
        // const removedDeletedLoan = this.myLoansService
        //   .getLoansValue()
        //   .filter((val) => val.id !== loanId);

        // this.myLoansService.updateLoans(removedDeletedLoan);

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
}
