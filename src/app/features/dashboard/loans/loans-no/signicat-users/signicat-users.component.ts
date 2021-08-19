import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoansService } from '@services/remote-api/loans.service';
import { ButtonFadeInOut } from '@shared/animations/button-fade-in-out';
import { FadeOut } from '@shared/animations/fade-out';

@Component({
  selector: 'rente-signicat-users',
  templateUrl: './signicat-users.component.html',
  styleUrls: ['./signicat-users.component.scss'],
  animations: [FadeOut, ButtonFadeInOut]
})
export class SignicatUsersComponent implements OnInit {
  public allOffers: any[];
  public loansData: any;
  public loans: any[];
  public errorMessage: string;
  public isEditMode = false;
  public loanForm: FormGroup;
  public showDisplayBox = true;
  public showButton = false;

  public outstandingDebtString = 'outstandingDebt';
  public remainingYearsString = 'remainingYears';
  public nominalRateString = 'nominalRate';

  // Store the inital value from api
  public initialOutStandingDebt: string;
  public initialRemainingYears: string;
  public initialNominalRate: string;

  /*
    The object interface is not updated so fix it when the new version is merged
  */
  // public setDisabled = false;

  constructor(private loansService: LoansService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loansService.getLoanAndOffersBanks().subscribe(
      ([loans, offerBank]) => {
        this.loansData = loans;
        this.allOffers = offerBank.offers;
        this.loans = this.loansData.loans;

        const dto = this.loans[0];

        if (!dto) {
          console.log('Dto doesnt exist!');
        }

        this.initialOutStandingDebt = String(dto.outstandingDebt);
        this.initialRemainingYears = String(dto.remainingYears);
        this.initialNominalRate = String(dto.nominalRate);

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
      },
      (err) => {
        this.errorMessage = err.title;
      }
    );
  }

  public setDisabled(): void {
    this.showButton = false;
    setTimeout(() => {
      this.isEditMode = false;
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
    this.loanForm.get(this.outstandingDebtString)?.disable();
    this.loanForm.get(this.remainingYearsString)?.disable();
    this.loanForm.get(this.nominalRateString)?.disable();
  }

  public setEnabled(): void {
    this.showDisplayBox = false;
    this.showButton = true;
    this.isEditMode = true;
    this.loanForm.get(this.outstandingDebtString)?.enable();
    this.loanForm.get(this.remainingYearsString)?.enable();
    this.loanForm.get(this.nominalRateString)?.enable();
  }

  public save(): void {
    // Get the new values and then set it to initial value then send request
    const getOutstandingDebt = this.loanForm.get(this.outstandingDebtString)
      ?.value;
    this.initialOutStandingDebt = getOutstandingDebt;
    // this.loanForm
    //   .get(this.outstandingDebtString)
    //   ?.setValue(this.initialOutStandingDebt);
    console.log(getOutstandingDebt);

    const getRemainingYears = this.loanForm.get(this.remainingYearsString)
      ?.value;
    this.initialRemainingYears = getRemainingYears;

    // this.loanForm
    //   .get(this.remainingYearsString)
    //   ?.setValue(this.initialRemainingYears);
    console.log(getRemainingYears);

    const getNominalRate = this.loanForm.get(this.nominalRateString)?.value;
    this.initialNominalRate = getNominalRate;

    // this.loanForm
    // .get(this.remainingYearsString)
    // ?.setValue(this.initialNominalRate);
    console.log(getNominalRate);
  }
}
