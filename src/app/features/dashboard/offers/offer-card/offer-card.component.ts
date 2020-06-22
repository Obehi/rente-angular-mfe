import { Component, OnInit, Input } from '@angular/core';
import { OfferInfo, Offers } from './../../../../shared/models/offers';
import { BANKS_DATA } from '@config/banks-config';
import { TrackingService, TrackingDto } from '@services/remote-api/tracking.service';

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
  constructor(private trackingService: TrackingService) { }

  ngOnInit() {
    console.log(this.offer)
  }

  get isMobile(): boolean { return window.innerWidth < 600; }

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
      case "LANDKREDITT": { 
        text = "Landkreditt"
         break; 
      } 
      default: { 
        text = "banken"
         break; 
      } 
   }
   return text 
  }

  private sendOfferTrackingData(trackingDto: TrackingDto, offer: OfferInfo){
    this.trackingService.sendTrackingStats(trackingDto).subscribe(res => {
    },
    err => {
    console.log("err");
    console.log(err);
    });
  }
  
  
  public openBankUrl(offer: OfferInfo) {
    if(offer.bankInfo.url === null)
      return
    
    window.open(
      offer.bankInfo.url,
      '_blank' 
    );

    const trackingDto = new TrackingDto();
    trackingDto.offerId = offer.id;
    trackingDto.type = "OFFER_HEADER_LINK";
    this.sendOfferTrackingData(trackingDto, offer)
  }

  public openBankUrlByButton(offer: OfferInfo) {
    if(offer.bankInfo.url === null || offer.bankInfo.partner == false)
      return
    
    window.open(
      offer.bankInfo.url,
      '_blank' 
    );

    const trackingDto = new TrackingDto();
    trackingDto.offerId = offer.id;
    trackingDto.type = "BANK_BUTTON_1";
    this.sendOfferTrackingData(trackingDto, offer)
  }

  public openNewOfferDialog(offer: OfferInfo): void {
    if(offer.bankInfo.partner === false)
      return
    
    window.open(
      offer.bankInfo.transferUrl,
      '_blank'
    );

    const trackingDto = new TrackingDto();
    trackingDto.offerId = offer.id;
    trackingDto.type = "BANK_BUTTON_2";
    this.sendOfferTrackingData(trackingDto, offer)
  }

  isPrimary(): boolean {
    let variation = this.getVariation()
    if(variation == 0 || variation == 1) {
      return true
    }
    return false
  }
}
