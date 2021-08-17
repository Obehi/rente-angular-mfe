import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoansService } from '@services/remote-api/loans.service';

@Component({
  selector: 'rente-signicat-fixed-price',
  templateUrl: './signicat-fixed-price.component.html',
  styleUrls: ['./signicat-fixed-price.component.scss']
})
export class SignicatFixedPriceComponent implements OnInit {
  public allOffers: any[];
  public loansData: any;
  public loans: any[];
  public errorMessage: string;
  public isEditMode = false;
  public loanForm: FormGroup;
  public currentLoanName = 'Domain';
  /*
    The object interface is not updated so fix it when the new version is merged
  */

  constructor(private loansService: LoansService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loansService.getLoanAndOffersBanks().subscribe(
      ([loans, offerBank]) => {
        this.loansData = loans;
        this.allOffers = offerBank.offers;
        this.loans = this.loansData.loans;

        // console.log(this.loansData.loans);
        // console.log(this.allOffers);

        const dto = this.loans[0];

        this.currentLoanName = String(dto.loanName);

        this.loanForm = this.fb.group({
          loanName: [{ value: dto.loanName, disabled: true }],
          outstandingDebt: [
            { value: String(dto.outstandingDebt), disabled: true },
            Validators.required
          ],
          remainingYears: [
            { value: String(dto.remainingYears), disabled: true },
            Validators.required
          ]
        });

        this.loanForm.get('loanName')?.setValue(this.currentLoanName);

        console.log('Loan name');
        console.log(this.loanForm.get('loanName')?.value);
      },
      (err) => {
        this.errorMessage = err.title;
      }
    );
  }

  public activateEditMode(): void {
    this.isEditMode = !this.isEditMode;
    console.log('is edit mode: ');
    console.log(this.isEditMode);
  }

  public setDisabled(): void {
    this.isEditMode = false;
    this.loanForm.get('loanName')?.disable();
    this.loanForm.get('outstandingDebt')?.disable();
    this.loanForm.get('remainingYears')?.disable();
  }

  public setEnabled(): void {
    this.isEditMode = true;
    this.loanForm.get('loanName')?.enable();
    this.loanForm.get('outstandingDebt')?.enable();
    this.loanForm.get('remainingYears')?.enable();
  }
}
