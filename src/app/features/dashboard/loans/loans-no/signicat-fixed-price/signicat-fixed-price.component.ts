import { Component, Input, OnInit } from '@angular/core';
import { bankOfferDto, Loans } from '@models/loans';

@Component({
  selector: 'rente-signicat-fixed-price',
  templateUrl: './signicat-fixed-price.component.html',
  styleUrls: ['./signicat-fixed-price.component.scss']
})
export class SignicatFixedPriceComponent implements OnInit {
  @Input() loanData: Loans;
  @Input() allOffers: bankOfferDto[];
  public isSummaryNeeded = false;

  constructor() {}

  ngOnInit(): void {
    const length = this.loanData.loans.length;
    if (length > 1) this.isSummaryNeeded = true;
  }
}
