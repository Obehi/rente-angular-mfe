import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { bankOfferDto, LoanInfo } from '@models/loans';
import { MessageBannerService } from '@services/message-banner.service';
import { LoansService } from '@services/remote-api/loans.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
import { concat, of, Subscription } from 'rxjs';
import { catchError, filter, toArray } from 'rxjs/operators';
import { FadeOut } from '@shared/animations/fade-out';
import { ButtonFadeInOut } from '@shared/animations/button-fade-in-out';
import { MyLoansService } from '../../../myloans.service';
import { Mask } from '@shared/constants/mask';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';

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
  public initialOutStandingDebt: string;
  public initialRemainingYears: string;

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

  public countDecimals(value: number): number {
    if (Math.floor(value) === value) return 0;
    return value.toString().split('.')[1].length || 0;
  }

  ngOnInit(): void {
    const format = this.countDecimals(this.loan.remainingYears);

    let correctValue = '';

    if (format < 2) {
      correctValue = String(this.loan.remainingYears);
    }

    if (format > 1) {
      correctValue = this.loan.remainingYears.toFixed(1);
    }

    this.initialLoanName = String(this.loan.loanName);
    this.initialOutStandingDebt = String(this.loan.outstandingDebt);
    this.initialRemainingYears = correctValue;
    this.loanTypeString = String(this.loan.loanName);

    /*
     * Create an object of the same datatype from bank offers
     * To be able to set selected to a value
     * Since mat-select wants the default value to be the same datatype as the array it uses
     */

    const transformDto = {
      name: this.loanTypeString,
      id: 'tag:finansportalen.no:feed/bank/boliglan/1622922',
      rate: 1.99
    };

    // Demo test code necessary, deactivate when testing in signicat
    this.allOffers.push(transformDto);

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
          this.hideEditIcon = true;
          this.setOpacity = true;
        }
      });

    // Activate listener for changes
    this.outStandingDebtchangeSubscription = this.loanForm
      .get(this.outstandingDebtString)
      ?.valueChanges.subscribe(() => {
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

    this.remainingYearschangeSubscription = this.loanForm
      .get(this.remainingYearsString)
      ?.valueChanges.subscribe(() => {
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
      !this.outstandingDebtIsError &&
      !this.remainingYearsIsError &&
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

    const loanNameDto = {
      product: this.loanTypeID
    };

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

    concat(
      // of(true)
      this.loansService.updateLoanProduct(loanNameDto).pipe(
        catchError((err) => {
          console.log(err);
          this.productIsError = true;
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
      this.loansService.updateLoanOutstandingDebt(outstandingDebtDto).pipe(
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

            this.initialLoanName = this.selected;
            this.initialOutStandingDebt = this.incomingValueOutstandingDebt;
            this.initialRemainingYears = this.incomingValueRemainingYears;

            this.setEditDisabled();
          }
        },
        (err) => {
          console.log(err);
          console.log('Error subscribtion');
        }
      );
  } // send request end
} // Class end
