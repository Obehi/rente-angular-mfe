import { Component, Input, OnInit } from '@angular/core';
import { LoanInfo, Loans } from '@shared/models/loans';

@Component({
  selector: 'rente-crawler-banks',
  templateUrl: './crawler-banks.component.html',
  styleUrls: ['./crawler-banks.component.scss']
})
export class CrawlerBanksComponent implements OnInit {
  @Input() loansData: Loans;
  public loans: LoanInfo[];

  constructor() {}

  ngOnInit(): void {
    const extraLoan = {
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
    this.loans = this.loansData.loans;
    this.loans.push(extraLoan);
  }
}
