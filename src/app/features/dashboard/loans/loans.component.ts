import { Component, OnInit } from '@angular/core';
import { LoansService } from '@services/remote-api/loans.service';
import { Loans } from '@shared/models/loans';

@Component({
  selector: 'rente-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit {
  public loansData: Loans;
  public loans = {
    loans: [
      {
        loanType: 'Vanlig boliglån',
        bank: 'DNB Bank ASA',
        outstandingDebt: 3000000.0,
        remainingYears: 23.083333333333332,
        nominalRate: 1.9,
        totalInterest: 921925.67,
        effectiveRate: 1.9090250000000086,
        totalInterestByRemainingYears: 39939.01819494585
      },
      {
        loanType: 'Rammelån/Boligkreditt',
        bank: 'DNB Bank ASA',
        outstandingDebt: 2788221.33,
        remainingYears: 23.75,
        nominalRate: 1.99,
        totalInterest: 914764.87,
        effectiveRate: 2.0512893556200353,
        totalInterestByRemainingYears: 38516.415578947366
      }
    ],
    totalOutstandingDebt: 5788221.33,
    averageRemainingYears: 23.404470711126038,
    totalEffectiveRate: 1.977554603175785,
    aggregatedTotalInterest: 1836690.54,
    aggregatedTotalInterestByRemainingYears: 78455.43377389322
  };

  constructor(private loansService: LoansService) { }

  ngOnInit() {
    this.loansData = this.loans;
    // this.loansService.getLoans().subscribe((res: Loans) => {
    //   console.log('loans', res);
    //   this.loansData = res;
    //   this.loansData = this.loans;
    // }, err => {
    //   this.loansData = this.loans;
    // });
  }

}
