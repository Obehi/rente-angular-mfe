import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { bankOfferDto, LoanInfo } from '@models/loans';
import { MessageBannerService } from '@services/message-banner.service';
import { LoansService } from '@services/remote-api/loans.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
import { concat, of, Subscription } from 'rxjs';
import { catchError, filter, toArray } from 'rxjs/operators';
import { FadeOut } from '@shared/animations/fade-out';
import { ButtonFadeInOut } from '@shared/animations/button-fade-in-out';
import { MyLoansService } from '../../../myloans.service';

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

  public isEditMode = false;
  public hideEditIcon = false;
  public loanForm: FormGroup;
  public selected = '';
  public loanTypeString: string;
  public loanTypeID: string;
  public showDisplayBox = true;
  public showButton = false;
  public isDisabled = true;
  public changesMade = false;
  public outStandingDebtchangeSubscription: Subscription | undefined;
  public remainingYearschangeSubscription: Subscription | undefined;
  public animationStyle = getAnimationStyles();

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

  ngOnInit(): void {
    this.initialLoanName = String(this.loan.loanName);
    this.initialOutStandingDebt = String(this.loan.outstandingDebt);
    this.initialRemainingYears = String(this.loan.remainingYears);
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

    // this.allOffers = offerBank.offers;
    this.allOffers.push(transformDto);

    this.selected = this.allOffers.filter(
      (val) => val.name === transformDto.name
    )[0].name;

    // Original working function filter
    // this.selected = this.allOffers.filter(
    //   (val) => val.name === dto.loanName
    // )[0].name;

    // this.loanTypeID = this.findLoanID(this.selected);

    this.loanForm = this.fb.group({
      loanName: [{ value: this.initialLoanName, disabled: true }],
      outstandingDebt: [
        { value: this.initialOutStandingDebt, disabled: true },
        Validators.required
      ],
      remainingYears: [
        { value: this.initialRemainingYears, disabled: true },
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
  }

  // Functions
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

  public identify(index: number, item: LoanInfo): number {
    return index;
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

  public disableForm(): void {
    this.loanForm.get(this.loanNameString)?.disable();
    this.loanForm.get(this.outstandingDebtString)?.disable();
    this.loanForm.get(this.remainingYearsString)?.disable();
  }

  public setEditDisabled(): void {
    this.changesMade = false;
    this.showButton = false;
    setTimeout(() => {
      this.myLoansService.setEditMode(null);

      this.isEditMode = false;
      this.hideEditIcon = false;
      this.showDisplayBox = true;

      this.selected = this.initialLoanName;

      this.loanTypeID = this.findLoanID(this.selected);

      this.loanForm
        .get(this.outstandingDebtString)
        ?.setValue(this.initialOutStandingDebt);

      this.loanForm
        .get(this.remainingYearsString)
        ?.setValue(this.initialRemainingYears);

      // Reset error
      this.productIsError = false;
      this.outstandingDebtIsError = false;
      this.remainingYearsIsError = false;
    }, 325);

    this.disableForm();
  }

  public enableForm(): void {
    this.loanForm.get(this.loanNameString)?.enable();
    this.loanForm.get(this.outstandingDebtString)?.enable();
    this.loanForm.get(this.remainingYearsString)?.enable();
  }

  public setEditEnabled(): void {
    // this.isDisabled = true;
    // const loanCount = this.myLoansService.getLoansCount();
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
    this.enableForm();
  }

  public matSelectChanged(): void {
    this.changesMade = true;
    this.isDisabled = false;
  }

  get isLoanFormValid(): boolean {
    return (
      !!this.loanForm.get(this.outstandingDebtString)?.value &&
      !!this.loanForm.get(this.remainingYearsString)?.value &&
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

    // Reset form so its marked as untouched
    // this.loanForm.reset();
    this.loanForm.markAsPristine();
    // this.loanForm.markAsUntouched();

    // Set the initial values back as reset sets the values to null
    this.loanTypeID = this.findLoanID(this.selected);

    this.loanForm
      .get(this.outstandingDebtString)
      ?.setValue(this.initialOutStandingDebt);

    this.loanForm
      .get(this.remainingYearsString)
      ?.setValue(this.initialRemainingYears);

    this.sendRequest();
  }

  public sendRequest(): void {
    const loanNameDto = {
      product: this.loanTypeID
    };

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

    concat(
      // this.loansService.updateLoanProduct(loanNameDto)
      of(true).pipe(
        catchError((err) => {
          console.log(err);
          this.productIsError = true;
          this.isError = true;
          return of(err);
        })
      ),
      // this.loansService.updateLoanOutstandingDebt(outstandingDebtDto)
      of(true).pipe(
        catchError((err) => {
          console.log(err);
          this.outstandingDebtIsError = true;
          this.isError = true;
          return of(err);
        })
      ),
      this.loansService.updateLoanReminingYears(remainingYearsDto).pipe(
        catchError((err) => {
          console.log(err);
          this.remainingYearsIsError = true;
          this.isError = true;
          return of(err);
        })
      )
    )
      .pipe(toArray())
      .subscribe(
        (res) => {
          console.log(res);

          if (this.isError) {
            this.messageBannerService.setView(
              'En eller flere av endringene ble ikke oppdatert',
              5000,
              this.animationStyle.DROP_DOWN_UP,
              'error',
              window
            );

            console.log('error');

            this.loanForm
              .get(this.outstandingDebtString)
              ?.setValue(this.initialOutStandingDebt);

            this.loanForm
              .get(this.remainingYearsString)
              ?.setValue(this.initialRemainingYears);

            // this.setDisabled();
          } else {
            this.messageBannerService.setView(
              'Endringene dine er lagret',
              3000,
              this.animationStyle.DROP_DOWN_UP,
              'success',
              window
            );

            console.log('success');

            this.initialLoanName = this.selected;
            this.initialOutStandingDebt = getOutstandingDebt;
            this.initialRemainingYears = getRemainingYears;

            this.loanForm
              .get(this.outstandingDebtString)
              ?.setValue(this.initialOutStandingDebt);

            this.loanForm
              .get(this.remainingYearsString)
              ?.setValue(this.initialRemainingYears);
            console.log(this.initialLoanName);
            console.log(this.initialOutStandingDebt);
            console.log(this.initialRemainingYears);
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
} // Class end
