import { Component, OnInit } from '@angular/core';
import { LoansService } from '@services/remote-api/loans.service';

interface offerDto {
  offers: [
    {
      id: string;
      name: string;
      rate: number;
    }
  ];
}

@Component({
  selector: 'rente-crawler-banks',
  templateUrl: './crawler-banks.component.html',
  styleUrls: ['./crawler-banks.component.scss']
})
export class CrawlerBanksComponent implements OnInit {
  public offer: offerDto;
  public loansData: any;
  public loans: any[];
  /*
    The object interface is not updated so fix it when the new version is merged
  */
  public errorMessage: string;

  constructor(private loansService: LoansService) {}

  ngOnInit(): void {
    this.loansService.getLoanAndOffersBanks().subscribe(
      ([loans, offerBank]) => {
        this.loansData = loans;
        this.offer = offerBank as offerDto;
        console.log(this.loansData.loans);
        this.loans = this.loansData.loans;
      },
      (err) => {
        this.errorMessage = err.title;
      }
    );
  }
}
