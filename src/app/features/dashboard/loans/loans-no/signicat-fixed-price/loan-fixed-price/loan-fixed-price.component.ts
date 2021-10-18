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
import { RxjsOperatorService } from '@services/rxjs-operator.service';

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
  public displayIndexString: string;

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

  public loanNameString = 'loanName';
  public outstandingDebtString = 'outstandingDebt';
  public remainingYearsString = 'remainingYears';

  // Store the inital value from api
  public loanNameCache: string;
  public outStandingDebtCache: string | null;
  public remainingYearsCache: string | null;

  public effectiveRateCache: number | null;
  public nominalRateCache: number | null;
  public totalInterestAndTotalFeeCache: number;
  public totalInterestAndTotalFeeByRemainingYearsCache: number;

  constructor(
    private loansService: LoansService,
    private fb: FormBuilder,
    private messageBannerService: MessageBannerService,
    private myLoansService: MyLoansService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
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

    this.loanNameCache = String(this.loan.loanName);
    this.outStandingDebtCache = String(this.loan.outstandingDebt);
    this.remainingYearsCache = correctValue;
    // this.loanTypeString = String(this.loan.loanName);

    // Extra variables to set on the component if a new loan is created
    this.effectiveRateCache = this.loan.effectiveRate;
    this.nominalRateCache = this.loan.nominalRate;
    this.totalInterestAndTotalFeeCache = this.loan.totalInterestAndTotalFee;
    this.totalInterestAndTotalFeeByRemainingYearsCache = this.loan.totalInterestAndTotalFeeByRemainingYears;

    /*
     * Create an object of the same datatype from bank offers
     * To be able to set selected to a value
     * Since mat-select wants the default value to be the same datatype as the array it uses
     */

    // -------------------  Sort the offers --------------------------
    this.allOffers.sort((a, b) => a.name.localeCompare(b.name));
    // console.log('Sorted loans', this.allOffers);

    // Demo test code necessary, deactivate when testing in signicat
    // const transformDto = {
    //   name: this.loanTypeString,
    //   id: 'tag:finansportalen.no:feed/bank/boliglan/1622922',
    //   rate: 1.99
    // };
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
      loanName: [{ value: this.loanNameCache, disabled: true }],
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
          Validators.max(99),
          Validators.required
        ]
      ]
    });

    this.isAbleToSave = false;

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
    const loanName = this.loanForm.get('loanName');
    const outstandingDebt = this.loanForm.get('outstandingDebt');
    const remainingYears = this.loanForm.get('remainingYears');

    const allControls = [loanName, outstandingDebt, remainingYears];

    let canSave = true;

    const getLoanName = String(
      this.allOffers.filter((val) => val.name === this.selected)[0].name
    );

    // Additional check for mat-select, if mat-select has not been changed
    if (this.loanForm.dirty === false && getLoanName === this.loanNameCache) {
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
    /*
     If its a newly created loan and user cancels the edit, delete the loan created
    */
    if (this.loan.id === 0) {
      this.myLoansService.deleteLoanTrigger(this.loan.id);
    }
    // Reset error
    this.productIsError = false;
    this.outstandingDebtIsError = false;
    this.remainingYearsIsError = false;

    this.showButton = false;
    setTimeout(() => {
      this.myLoansService.setEditMode(null);

      // Reset the values back to initial
      this.selected = this.loanNameCache;

      this.loanTypeID = this.findLoanID(this.selected);

      this.loanForm
        .get(this.outstandingDebtString)
        ?.setValue(this.outStandingDebtCache);

      this.loanForm
        .get(this.remainingYearsString)
        ?.setValue(this.remainingYearsCache);

      this.inEditMode = false;
      this.isEditMode = false;
      this.hideEditIcon = false;
      this.setOpacity = false;
      this.showDisplayBox = true;
    }, 325);

    // Needs to be later than the deactivate animation to trigger the slide animation on the blue-box-edit
    // setTimeout(() => {
    //   const idx = this.index + 1;
    //   const el = document.getElementById(idx.toString());

    //   if (!!el) {
    //     console.log('Removing height');
    //     el.style.removeProperty('height');
    //   }
    // }, 100);

    this.disableForm();
  }

  public setEditEnabled(): void {
    // const idx = this.index + 1;
    // const el = document.getElementById(idx.toString());

    // if (!!el) {
    //   console.log('Adding height');
    //   const elHeight = el.getBoundingClientRect().height;
    //   el.style.height = `${elHeight.toString()}px`;
    // }

    // Reset error
    this.productIsError = false;
    this.outstandingDebtIsError = false;
    this.remainingYearsIsError = false;

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
    setTimeout(() => {
      this.inEditMode = true;
    }, 325);
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
    // Set the initial values back as reset sets the values to null
    this.loanTypeID = this.findLoanID(this.selected);

    const getOutstandingDebt = this.myLoansService.getNumericValueFormated(
      this.loanForm.controls[this.outstandingDebtString].value
    );

    const getRemainingYears = this.myLoansService.formatComma(
      this.loanForm.controls[this.remainingYearsString].value
    );

    const getFee = Number(this.loan.fee);

    let getLoanType = '';

    if (
      this.selected.toLocaleLowerCase().includes('rammelån') ||
      this.selected.toLocaleLowerCase().includes('flexilån') ||
      this.selected.toLocaleLowerCase().includes('boligkreditt')
    ) {
      getLoanType = 'CREDIT_LINE';
    } else {
      getLoanType = 'DOWNPAYMENT_REGULAR_LOAN';
    }

    const getLoanSubType = String(
      this.loanTypeList.filter((val) => val.value === getLoanType.toString())[0]
        .subType
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
      this.createNewLoan(sendToBEDto);
    } else {
      this.updateLoan(sendToBEDto);
    }
  }

  // returns null if successful
  public updateLoan(obj: SignicatLoanInfoDto): void {
    this.isAbleToSave = false;

    this.loansService
      .updateLoan([obj])
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

  public createNewLoan(obj: SignicatLoanInfoDto): void {
    this.loansService
      .createNewLoan([obj])
      .pipe(
        catchError(
          this.rxjsOperatorService.handleErrorWithNotification(
            'Oops, noe gikk galt. Kunne ikke opprette et nytt lån',
            5000
          )
        )
      )
      .subscribe(() => {
        this.loanNameCache = this.selected;
        this.outStandingDebtCache = this.loanForm.controls[
          this.outstandingDebtString
        ].value;
        this.remainingYearsCache = this.loanForm.controls[
          this.remainingYearsString
        ].value;

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
        this.setEditDisabled();
        this.notificationService.setOfferNotification();
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
      alert('Loan index is null');
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
        // Remove from UI
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
} // Class end
