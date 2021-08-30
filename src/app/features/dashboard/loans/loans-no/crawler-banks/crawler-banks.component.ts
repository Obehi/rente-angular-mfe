import { Component, Input, OnInit } from '@angular/core';
import { LoansService } from '@services/remote-api/loans.service';
import { Loans } from '@shared/models/loans';

@Component({
  selector: 'rente-crawler-banks',
  templateUrl: './crawler-banks.component.html',
  styleUrls: ['./crawler-banks.component.scss']
})
export class CrawlerBanksComponent implements OnInit {
  @Input() loansData: Loans;
  public loans: any[];
  /*
    The object interface is not updated so fix it when the new version is merged
  */
  public errorMessage: string;

  constructor() {}

  ngOnInit(): void {
    this.loans = this.loansData.loans;
  }
}
