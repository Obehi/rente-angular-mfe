import { Component, Input, OnInit } from '@angular/core';
import { bankOfferDto, LoanInfo, Loans } from '@models/loans';
import { LoansService } from '@services/remote-api/loans.service';
import { MyLoansService } from '../../myloans.service';

@Component({
  selector: 'rente-signicat-fixed-price',
  templateUrl: './signicat-fixed-price.component.html',
  styleUrls: ['./signicat-fixed-price.component.scss']
})
export class SignicatFixedPriceComponent implements OnInit {
  @Input() loanData: Loans;
  @Input() allOffers: bankOfferDto[];
  public loans: LoanInfo[] | null;
  public isSummaryNeeded = false;
  public isEmptyLoans = false;

  constructor(
    private myLoansService: MyLoansService,
    private loansService: LoansService
  ) {}

  ngOnInit(): void {
    this.loans = this.loanData.loans;

    // Add test data for loans
    const dto = {
      bank: 'Sbanken ASA',
      bankKey: 'SBANKEN',
      effectiveRate: 2,
      id: 4511,
      isDeleted: false,
      isIncompleteInfoLoan: false,
      loanName: 'Boliglån 75 %',
      loanType: 'DOWNPAYMENT_REGULAR_LOAN',
      nominalRate: 1.88,
      outstandingDebt: 2300000,
      remainingYears: 29.553668720054757,
      totalInterestAndTotalFee: 228500,
      totalInterestAndTotalFeeByRemainingYears: 13272.73390849166344
    };

    this.loans.unshift(dto);
    this.myLoansService.updateLoans(this.loans);
    console.log(this.loans);

    this.myLoansService.getLoansAsObservable().subscribe((res) => {
      console.log('Signicat fixed price parent response');
      console.log(res);
      this.loans = res;
      if (this.loans) {
        const length = this.loans.length;
        console.log('Length: ' + length.toString());
        if (length > 1) this.isSummaryNeeded = true;
        // else this.isSummaryNeeded = false;

        if (length === 0) this.isEmptyLoans = true;
      }
    });

    this.loansService.getLoanAndOffersBanks().subscribe(
      ([loans, offerBank]) => {
        this.loanData = loans;
      },
      (err) => {
        console.log(err);
      }
    );

    // this.setLoanStoreListener();
  }

  public setLoanStoreListener(): void {
    this.myLoansService.getLoansAsObservable().subscribe((res) => {
      console.log('Signicat fixed price parent response');
      console.log(res);
      this.loans = res;
    });
  }
}
