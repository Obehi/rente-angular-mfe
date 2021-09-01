import { Component, Input, OnInit } from '@angular/core';
import { bankOfferDto, Loans } from '@models/loans';

@Component({
  selector: 'rente-signicat-users',
  templateUrl: './signicat-users.component.html',
  styleUrls: ['./signicat-users.component.scss']
})
export class SignicatUsersComponent implements OnInit {
  @Input() loanData: Loans;
  @Input() allOffers: bankOfferDto[];
  public isSummaryNeeded = false;

  constructor() {}

  ngOnInit(): void {
    const length = this.loanData.loans.length;
    if (length > 1) this.isSummaryNeeded = true;
  }
}
