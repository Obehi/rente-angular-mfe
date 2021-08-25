import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoansService } from '@services/remote-api/loans.service';
import { FadeOut } from '@shared/animations/fade-out';
import { ButtonFadeInOut } from '@shared/animations/button-fade-in-out';
import { Subscription } from 'rxjs/internal/Subscription';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

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
  public changesMade = false;
  public changingSubscription: Subscription;

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

  constructor(private loansService: LoansService, private fb: FormBuilder) {}

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

        // Test data
        // this.loanTypeString = 'BOLIGLÅN 85% BOLIGKR 0-2';
        // this.initialLoanName = this.loanTypeString;
        this.loanTypeString = String(dto.loanName);

        /*
         * Create an object of the same datatype from bank offers
         * To be able to set selected to a value
         * Since mat-select wants the default value to be the same datatype as the array it uses
         */

        // const transformDto = {
        //   name: this.loanTypeString,
        //   id: 'tag:finansportalen.no:feed/bank/boliglan/1622922',
        //   rate: dto.nominalRate
        // };

        this.allOffers = offerBank.offers;
        // this.allOffers.push(transformDto);

        // this.selected = this.allOffers.filter(
        //   (val) => val.name === transformDto.name
        // )[0].name;

        this.selected = this.allOffers.filter(
          (val) => val.name === dto.loanName
        )[0].name;

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

  public setDisabled(): void {
    if (this.changingSubscription) {
      this.changingSubscription.unsubscribe();
      this.changesMade = false;
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

    this.loanForm.get(this.loanNameString)?.disable();
    this.loanForm.get(this.outstandingDebtString)?.disable();
    this.loanForm.get(this.remainingYearsString)?.disable();
  }

  public setEnabled(): void {
    this.showDisplayBox = false;
    this.showButton = true;
    this.isEditMode = true;
    this.loanForm.get(this.loanNameString)?.enable();
    this.loanForm.get(this.outstandingDebtString)?.enable();
    this.loanForm.get(this.remainingYearsString)?.enable();

    this.changingSubscription = this.loanForm.valueChanges.subscribe(() => {
      if (
        this.loanForm.controls[this.outstandingDebtString].dirty ||
        this.loanForm.controls[this.remainingYearsString].dirty
      ) {
        this.changesMade = true;
        const getOutstandingDebt = this.loanForm.get(this.outstandingDebtString)
          ?.value;

        console.log(typeof getOutstandingDebt);
      }
    });
  }

  public matSelectChanged(): void {
    this.changesMade = true;
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
    if (this.changesMade === false || !this.ableTosave) return;

    console.log('this.selected');
    console.log(this.selected);

    this.loanTypeID = this.findLoanID(this.selected);

    const loanNameDto = {
      product: this.loanTypeID
    };

    const getOutstandingDebt = this.loanForm.get(this.outstandingDebtString)
      ?.value;

    console.log(typeof getOutstandingDebt);
    console.log(getOutstandingDebt);

    const outstandingDebtDto = {
      outstandingDebt: getOutstandingDebt
    };

    const getRemainingYears = this.loanForm.get(this.remainingYearsString)
      ?.value;

    const remainingYearsDto = {
      remainingYears: getRemainingYears
    };

    forkJoin([
      this.loansService.updateLoanProduct(loanNameDto),
      this.loansService.updateLoanOutstandingDebt(outstandingDebtDto),
      this.loansService.updateLoanReminingYears(remainingYearsDto)
    ]).subscribe(
      () => {
        console.log(' loan type success');
        console.log(' outstanding debt success');
        console.log(' remaining years success');
        this.initialLoanName = this.selected;
        console.log('check after setting this.selected');
        console.log(this.initialLoanName);
        this.initialOutStandingDebt = getOutstandingDebt;
        this.initialRemainingYears = getRemainingYears;

        this.loanForm
          .get(this.outstandingDebtString)
          ?.setValue(this.initialOutStandingDebt);

        this.loanForm
          .get(this.remainingYearsString)
          ?.setValue(this.initialRemainingYears);
        console.log('Saved!');
        console.log(this.initialLoanName);
        console.log(this.initialOutStandingDebt);
        console.log(this.initialRemainingYears);
        this.setDisabled();
      },
      (err) => {
        this.errorMessage = err.title;
        console.log('One or more request unsuccessful!');
        this.setDisabled();
      }
    );
  }
}
