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

  // Activate input color when focused
  public inputOutstandingDebtIsActive = false;
  public inputRemainingYearsIsActive = false;
  public inputNominalRateIsActive = false;
  public inputFeeIsActive = false;
  public inputLoanTypeIsActive = false;

  public outstandingDebtString = 'outstandingDebt';
  public remainingYearsString = 'remainingYears';
  public nominalRateString = 'nominalRate';
  public feeString = 'fee';

  // Store the inital value from api
  public outStandingDebtCache: string | null;
  public remainingYearsCache: string | null;
  public nominalRateCache: string | null;
  public feeCache: string | null;
  public loanTypeCache: string;

  public effectiveRateCache: number;
  public totalInterestAndTotalFeeCache: number;
  public totalInterestAndTotalFeeByRemainingYearsCache: number;

  constructor(
    private fb: FormBuilder,
    private loansService: LoansService,
    private messageBannerService: MessageBannerService,
    private myLoansService: MyLoansService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private rxjsOperatorService: RxjsOperatorService
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    // Make sure edit mode is null to prevent bugs
    this.myLoansService.setEditMode(null);

    if (this.loan.id !== 0) {
      this.displayIndexString = `Lån ${this.index + 1}`;
    } else {
      this.displayIndexString = 'Nytt lån';
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
    this.outStandingDebtCache = String(this.loan.outstandingDebt);
    this.remainingYearsCache = String(correctValue);
    this.nominalRateCache = String(this.loan.nominalRate);
    this.feeCache = String(this.loan.fee);

    // Extra variables to set on the component if a new loan is created
    this.effectiveRateCache = this.loan.effectiveRate;
    this.totalInterestAndTotalFeeCache = this.loan.totalInterestAndTotalFee;
    this.totalInterestAndTotalFeeByRemainingYearsCache = this.loan.totalInterestAndTotalFeeByRemainingYears;

    // Backend returns loantype in english, filter the list and return the name in obj
    this.loanTypeCache = String(
      this.loanTypeList.filter((val) => val.value === this.loan.loanType)[0]
        .name
    );

    this.loanTypeSelected = this.loanTypeCache;

    this.loanForm = this.fb.group({
      outstandingDebt: [
        { value: this.outStandingDebtCache, disabled: true },
        [
          Validators.pattern(VALIDATION_PATTERN.nonNullThousand),
          Validators.max(100000000),
          Validators.required
        ]
      ],
      remainingYears: [
        { value: this.remainingYearsCache, disabled: true },
        [
          Validators.pattern(VALIDATION_PATTERN.year),
          Validators.max(70),
          Validators.required
        ]
      ],
      nominalRate: [
        { value: this.nominalRateCache, disabled: true },
        [Validators.max(5), Validators.min(1), Validators.required]
      ],
      fee: [
        { value: this.feeCache, disabled: true },
        [Validators.max(100), Validators.required]
      ],
      loanType: [{ value: this.loanTypeCache, disabled: true }]
    });

    this.isAbleToSave = false;

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
      this.validateForm();
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

  public validateForm(): void {
    const loanType = this.loanForm.get('loanType');
    const outstandingDebt = this.loanForm.get('outstandingDebt');
    const remainingYears = this.loanForm.get('remainingYears');
    const nominalRate = this.loanForm.get('nominalRate');
    const fee = this.loanForm.get('fee');

    const allControls = [
      loanType,
      outstandingDebt,
      remainingYears,
      nominalRate,
      fee
    ];

    let canSave = true;

    const getLoanType = String(
      this.loanTypeList.filter((val) => val.name === this.loanTypeSelected)[0]
        .name
    );

    // Additional check for mat-select, if mat-select has not been changed
    if (this.loanForm.dirty === false && getLoanType === this.loanTypeCache) {
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
     isAbleToSave is for when the new loan created is successful
     so it doesnt delete the loan, the scrollToView is dependent on the loan list length 
    */
    if (this.loan.id === 0) {
      this.myLoansService.deleteLoanTrigger(this.loan.id);
    }

    // Run in this order for animation to be smooth
    this.showButton = false;
    setTimeout(() => {
      this.myLoansService.setEditMode(null);
      this.loanTypeSelected = this.loanTypeCache;

      // Reset the values back to initial
      this.loanForm.get('outstandingDebt')?.setValue(this.outStandingDebtCache);
      this.loanForm.get('remainingYears')?.setValue(this.remainingYearsCache);
      this.loanForm.get('nominalRate')?.setValue(this.nominalRateCache);
      this.loanForm.get('fee')?.setValue(this.feeCache);

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
        // console.log('Removing height');
        el.style.removeProperty('height');
      }
    }, 100);

    this.disableForm();
  }

  public setEditEnabled(): void {
    const idx = this.index + 1;
    const el = document.getElementById(idx.toString());

    if (!!el) {
      // console.log('Adding height');
      const elHeight = el.getBoundingClientRect().height;
      el.style.height = `${elHeight.toString()}px`;
    }

    setTimeout(() => {
      const check = this.myLoansService.getEditMode();

      if (check !== null) {
        throw new Error('Check is NOT null');
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
    this.validateForm();
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
      this.loanForm.controls[this.outstandingDebtString].value
    );

    const getRemainingYears = this.myLoansService.formatComma(
      this.loanForm.controls[this.remainingYearsString].value
    );

    const getNominalRate = this.myLoansService.formatComma(
      this.loanForm.controls[this.nominalRateString].value
    );

    const getFee = Number(this.loanForm.controls[this.feeString].value);

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
        this.loanTypeCache = this.loanTypeSelected;
        this.outStandingDebtCache = this.loanForm.controls[
          this.outstandingDebtString
        ].value;
        this.remainingYearsCache = this.loanForm.controls[
          this.remainingYearsString
        ].value;
        this.nominalRateCache = this.loanForm.controls[
          this.nominalRateString
        ].value;
        this.feeCache = this.loanForm.controls[this.feeString].value;

        this.effectiveRateCache = 0;
        this.totalInterestAndTotalFeeCache = 0;
        this.totalInterestAndTotalFeeByRemainingYearsCache = 0;

        this.messageBannerService.setView(
          'Nytt lån er opprettet',
          3000,
          this.animationStyle.DROP_DOWN_UP,
          'success',
          window
        );

        // isAbleToSave has to be after the edit disabled to make the new loan popup before updating
        this.isAbleToSave = false;

        // Mark as new loan created
        this.myLoansService.setNewlyCreatedLoanStatus(true);

        this.myLoansService.reloadLoans();
        this.notificationService.setOfferNotification();
        this.setEditDisabled();
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
      throw new Error('Loan index is null');
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
