import { Component, OnInit, Input } from '@angular/core';
import { OfferInfo, Offers } from './../../../../shared/models/offers';
import { BANKS_DATA } from '@config/banks-config';
import {
  OFFER_SAVINGS_TYPE,
  AGGREGATED_RATE_TYPE,
  AGGREGATED_LOAN_TYPE
} from '../../../../config/loan-state';


@Component({
  selector: 'rente-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.scss']
})
export class OfferCardComponent implements OnInit {

  public banksMap = BANKS_DATA;
  public offerSavingsType = OFFER_SAVINGS_TYPE

  @Input() offer: OfferInfo;
  @Input() offersInfo: Offers
  @Input() index: number
  constructor() { }

  ngOnInit() {
    console.log(this.offer)
  }



  getbankNameOrDefault(offer: OfferInfo): string {
    let text = ""
    switch(offer.bankInfo.bank) { 
      case "SBANKEN": { 
         text = "Sbanken"
         break; 
      } 
      case "BULDER": { 
        text = "Bulder"
         break; 
      } 
      default: { 
        text = "banken"
         break; 
      } 
   }
   return text 
  } 

}
