import { Component, OnInit, Input } from '@angular/core';
import { OfferInfo, Offers } from './../../../../../shared/models/offers';
import { BankRatingDialogComponent } from '../bank-rating-dialog/bank-rating-dialog.component';
import { BANKS_DATA } from '@config/banks-config';
import { TrackingService, TrackingDto } from '@services/remote-api/tracking.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


import {
  OFFER_SAVINGS_TYPE,
  AGGREGATED_RATE_TYPE,
  AGGREGATED_LOAN_TYPE
} from '../../../../../config/loan-state';


@Component({
  selector: 'rente-offer-card-blue',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.scss']
})
export class OfferCardComponentBlue implements OnInit {

  public banksMap = BANKS_DATA;
  public offerSavingsType = OFFER_SAVINGS_TYPE
  public xpandStatus = false;
  

  @Input() offer: OfferInfo;
  @Input() offersInfo: Offers
  @Input() index: number
  constructor(
    private trackingService: TrackingService, 
    public dialog: MatDialog,
    private router: Router) { }
 

  ngOnInit() {
    console.log(this.offer)
  }

  get isMobile(): boolean { return window.innerWidth < 600; }

  getbankNameOrDefault(offer: OfferInfo): string {
    let text = ""
    switch(offer.bankInfo.bank) { 

      case "SPAREBANKENOST": {
        text = "Sparebanken Øst"
      }
      
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
    
    if(this.handleNybyggerProductSpecialCase(offer) == true) {
      return 
    }  
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

  public handleNybyggerProductSpecialCase(offer: OfferInfo): boolean {
    if(offer.productName.includes("rammelån") && offer.bankInfo.bank == "NYBYGGER") {
      window.open(
        offer.bankInfo.transferUrl,
        '_blank')

      console.log("special bank product case")
      return true
    } 
    console.log("NOT special bank product case")
    return false;
  }

  public openNewOfferDialog(offer: OfferInfo): void {
   

    if(offer.bankInfo.partner === false)
      return
    
    if(this.handleNybyggerProductSpecialCase(offer) == true) {
      return 
    }
    
    console.log(offer.productName)
    window.open(
      offer.bankInfo.transferUrl,
      '_blank'
    );
    
    const trackingDto = new TrackingDto();
    trackingDto.offerId = offer.id;
    trackingDto.type = "BANK_BUTTON_2";
    this.sendOfferTrackingData(trackingDto, offer)
  }

  public detailOpenClicked() {
    this.xpandStatus = true;
  } 

  public openInfoDialog(text: String): void {
    var bankRatingDialogRef = this.dialog.open(BankRatingDialogComponent, {
      height: '400px'
    });

    bankRatingDialogRef.afterClosed().subscribe(() => {
      console.log("subscribe afterClosed")
      console.log(bankRatingDialogRef.componentInstance.closeState)
      this.handlebankRatingdialogOnClose(bankRatingDialogRef.componentInstance.closeState)
    })
  }


  public handlebankRatingdialogOnClose(state: String) {
    switch(state) { 
      case "canceled": { 
         break; 
      } 
      case "procced": { 
        this.router.navigate(['/dashboard', 'epsi-kundetilfredshet']);
        break; 
     } 
    }
  }
}
