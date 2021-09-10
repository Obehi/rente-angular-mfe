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
    this.loans = this.loansData.loans;
  }
}
