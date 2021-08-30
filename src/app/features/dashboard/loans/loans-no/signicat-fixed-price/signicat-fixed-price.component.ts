import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoansService } from '@services/remote-api/loans.service';
import { FadeOut } from '@shared/animations/fade-out';
import { ButtonFadeInOut } from '@shared/animations/button-fade-in-out';
import { Subscription } from 'rxjs/internal/Subscription';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { concat, of } from 'rxjs';
import { catchError, toArray } from 'rxjs/operators';
import { MessageBannerService } from '@services/message-banner.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';

interface bankDto {
  name: string;
  id: string;
  rate: number;
}

@Component({
  selector: 'rente-signicat-fixed-price',
  templateUrl: './signicat-fixed-price.component.html',
  styleUrls: ['./signicat-fixed-price.component.scss'],
  animations: [FadeOut, ButtonFadeInOut]
})
export class SignicatFixedPriceComponent implements OnInit {
  public allOffers: bankDto[];
  public loansData: any;
  public loans: any[];
  public errorMessage: string;
  public isEditMode = false;
  public loanForm: FormGroup;
  public selected = '';
  public loanTypeString: string;
  public loanTypeID: string;
  public showDisplayBox = true;
  public showButton = false;
  public isDisabled = true;
  public changesMade = false;
  public changingSubscription: Subscription;
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
  /*
    The object interface is not updated so fix it when the new version is merged
  */

  constructor(
    private loansService: LoansService,
    private fb: FormBuilder,
    private messageBannerService: MessageBannerService
  ) {}

  ngOnInit(): void {
    this.loansService.getLoanAndOffersBanks().subscribe(
      ([loans, offerBank]) => {
        this.loansData = loans;
        // this.allOffers = offerBank.offers;
        this.loans = this.loansData.loans;

        const dto = this.loans[0];

        if (!dto) {
          console.log('Dto doesnt exist!');
        }

        this.initialLoanName = String(dto.loanName);
        this.initialOutStandingDebt = String(dto.outstandingDebt);
        this.initialRemainingYears = String(dto.remainingYears);
        this.loanTypeString = String(dto.loanName);

        /*
         * Create an object of the same datatype from bank offers
         * To be able to set selected to a value
         * Since mat-select wants the default value to be the same datatype as the array it uses
         */

        const transformDto = {
          name: this.loanTypeString,
          id: 'tag:finansportalen.no:feed/bank/boliglan/1622922',
          rate: dto.nominalRate
        };

        this.allOffers = offerBank.offers;
        this.allOffers.push(transformDto);

        this.selected = this.allOffers.filter(
          (val) => val.name === transformDto.name
        )[0].name;

        // Original working function filter
        // this.selected = this.allOffers.filter(
        //   (val) => val.name === dto.loanName
        // )[0].name;

        this.loanTypeID = this.findLoanID(this.selected);

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
      },
      (err) => {
        this.errorMessage = err.title;
      }
    );
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

  public disableForm(): void {
    this.loanForm.get(this.loanNameString)?.disable();
    this.loanForm.get(this.outstandingDebtString)?.disable();
    this.loanForm.get(this.remainingYearsString)?.disable();
  }

  public setEditDisabled(): void {
    if (this.changingSubscription) {
      this.changingSubscription.unsubscribe();
      this.changesMade = false;
      console.log('changes made false - setEditDisabled');
    }
    this.showButton = false;
    setTimeout(() => {
      this.isEditMode = false;
      this.showDisplayBox = true;

      this.selected = this.initialLoanName;

      this.loanTypeID = this.findLoanID(this.selected);

      this.loanForm
        .get(this.outstandingDebtString)
        ?.setValue(this.initialOutStandingDebt);

      this.loanForm
        .get(this.remainingYearsString)
        ?.setValue(this.initialRemainingYears);
    }, 325);

    this.disableForm();
  }

  public enableForm(): void {
    this.loanForm.get(this.loanNameString)?.enable();
    this.loanForm.get(this.outstandingDebtString)?.enable();
    this.loanForm.get(this.remainingYearsString)?.enable();
  }

  public setEditEnabled(): void {
    this.deactivateAllInput();

    this.showDisplayBox = false;
    this.showButton = true;
    this.isEditMode = true;
    this.enableForm();

    // Activate listener for changes
    this.changingSubscription = this.loanForm.valueChanges.subscribe(() => {
      if (this.loanForm.controls[this.outstandingDebtString].dirty) {
        this.outstandingDebtIsError = false;
      }
      if (this.loanForm.controls[this.remainingYearsString].dirty) {
        this.remainingYearsIsError = false;
      }
      this.changesMade = true;
      if (this.isLoanFormValid && this.changesMade) {
        this.isDisabled = false;
      }
    });
  }

  public activateListener(): void {}

  public matSelectChanged(): void {
    this.changesMade = true;
  }

  public changeAfterSaved(): void {}

  get isLoanFormValid(): boolean {
    return (
      !!this.loanForm.get(this.outstandingDebtString)?.value &&
      !!this.loanForm.get(this.remainingYearsString)?.value &&
      !this.productIsError &&
      !this.outstandingDebtIsError &&
      !this.remainingYearsIsError &&
      this.changesMade
    );
  }

  get ableTosave(): boolean {
    return this.isLoanFormValid && this.changesMade;
  }

  public save(): void {
    if (this.changesMade === false || !this.ableTosave) return;
    if (this.changingSubscription) {
      this.changingSubscription.unsubscribe();
      this.changesMade = false;
    }

    this.deactivateAllInput();

    this.loanTypeID = this.findLoanID(this.selected);

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
      this.loansService.updateLoanProduct(loanNameDto).pipe(
        catchError((err) => {
          console.log(err);
          this.productIsError = true;
          this.isError = true;
          return of(err);
        })
      ),
      this.loansService.updateLoanOutstandingDebt(outstandingDebtDto).pipe(
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

            this.changesMade = false;
            this.isDisabled = true;

            console.log('error');

            // Activate listener again for changes
            this.changingSubscription = this.loanForm.valueChanges.subscribe(
              () => {
                if (this.loanForm.controls[this.outstandingDebtString].dirty) {
                  this.outstandingDebtIsError = false;
                }
                this.isDisabled = false;
                this.changesMade = true;
              }
            );

            this.initialLoanName = this.selected;
            this.initialOutStandingDebt = getOutstandingDebt;
            this.initialRemainingYears = getRemainingYears;

            this.loanForm
              .get(this.outstandingDebtString)
              ?.setValue(this.initialOutStandingDebt);

            this.loanForm
              .get(this.remainingYearsString)
              ?.setValue(this.initialRemainingYears);

            // this.setDisabled();
            console.log('Saved!');
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
