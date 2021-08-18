import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoansService } from '@services/remote-api/loans.service';

interface bankDto {
  name: string;
  id: string;
  rate: number;
}

@Component({
  selector: 'rente-signicat-fixed-price',
  templateUrl: './signicat-fixed-price.component.html',
  styleUrls: ['./signicat-fixed-price.component.scss']
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

        // Test data
        this.loanTypeString = 'BOLIGLÅN 85% BOLIGKR 0-2';
        // this.loanTypeString = String(dto.loanName);

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
