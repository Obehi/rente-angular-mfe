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
  offer: any;
  loansData: any;
  public errorMessage: string;

  constructor(private loansService: LoansService) {}

  ngOnInit(): void {
    this.loansService.getLoanAndOffersBanks().subscribe(
      ([loans, offerBank]) => {
        this.loansData = loans;
        this.offer = offerBank as offerDto;
      },
      (err) => {
        this.errorMessage = err.title;
      }
    );
  }
}
