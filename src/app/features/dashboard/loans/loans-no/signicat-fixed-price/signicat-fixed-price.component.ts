import { Component, OnInit } from '@angular/core';
import { LoansService } from '@services/remote-api/loans.service';

@Component({
  selector: 'rente-signicat-fixed-price',
  templateUrl: './signicat-fixed-price.component.html',
  styleUrls: ['./signicat-fixed-price.component.scss']
})
export class SignicatFixedPriceComponent implements OnInit {
  public allOffers: any[];
  public loansData: any;
  public loans: any[];
  public errorMessage: string;
  public isEditMode = false;
  /*
    The object interface is not updated so fix it when the new version is merged
  */

  constructor(private loansService: LoansService) {}

  ngOnInit(): void {
    this.loansService.getLoanAndOffersBanks().subscribe(
      ([loans, offerBank]) => {
        this.loansData = loans;
        this.allOffers = offerBank.offers;
        this.loans = this.loansData.loans;
        console.log(this.loansData.loans);
        console.log(this.allOffers);
      },
      (err) => {
        this.errorMessage = err.title;
      }
    );
    console.log('is edit mode: ');
    console.log(this.isEditMode);
  }

  public activateEditMode(): void {
    this.isEditMode = !this.isEditMode;
    console.log('is edit mode: ');
    console.log(this.isEditMode);
  }
}
