import { Component, OnInit, Input } from '@angular/core';
import { OfferInfo, Offers } from './../../../../../shared/models//offers';

@Component({
  selector: 'rente-offers-list',
  templateUrl: './offers-list-no.component.html',
  styleUrls: ['./offers-list-no.component.scss']
})
export class OffersListNoComponent implements OnInit {

  @Input() offer: OfferInfo;
  @Input() offersInfo: Offers
  public currentOfferInfo: Offers

  get isMobile(): boolean { return window.innerWidth < 600; }
  public currentOfferType: String;

  constructor() { }

  ngOnInit(): void {

    this.currentOfferInfo = (JSON.parse(JSON.stringify(this.offersInfo)));
    this.currentOfferType = "all";

    //REMOVE BEFORE PRODUCTION
    var flag = false
    this.offersInfo.offers.top5 = this.offersInfo.offers.top5.map( (offer) => {
        offer.loanType = flag ? 'threeMonths' : 'oneYear'
        flag = !flag
        return offer
    }) 
  }
  

  public setOfferType(type: String) {
    this.currentOfferType = type;

    if(type == 'all') {
      this.currentOfferInfo.offers.top5 = this.offersInfo.offers.top5;
      return;
    }
    let newLoanTypeSelected = this.offersInfo.offers.top5.filter( (item, index, offers) => {
      return  item.loanType == type 
    })
    
    this.currentOfferInfo.offers.top5 = newLoanTypeSelected
  }

}
