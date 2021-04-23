import { Component, OnInit, Input } from '@angular/core';
import { Offers } from './../../../../../shared/models//offers';

@Component({
  selector: 'rente-offers-list',
  templateUrl: './offers-list-sv.component.html',
  styleUrls: ['./offers-list-sv.component.scss']
})
export class OffersListSvComponent implements OnInit {
  @Input() offersInfo: Offers;
  public currentOfferInfo: Offers;

  isV1 = true;

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }
  public currentOfferType: string;
  variation: number | null = null;

  constructor() {}

  ngOnInit(): void {
    this.variation = this.getVariation();

    this.currentOfferInfo = JSON.parse(JSON.stringify(this.offersInfo));
    this.currentOfferType = 'all';
    this.setOfferType(this.currentOfferType);

    this.offersInfo.offers.top5 = this.offersInfo.offers.top5.filter(
      (offer) => {
        return offer;
      }
    );
  }

  public getVariation() {
    const variation = (window as any).google_optimize?.get(
      '9d84Epc8T3amY5DsACFhVA'
    );
    console.log('variation');
    console.log(variation);
    return variation || 0;
  }

  public setV1(): void {
    this.isV1 = true;
  }

  public setV2(): void {
    this.isV1 = false;
  }

  public setOfferType(type: string): void {
    this.currentOfferType = type;

    if (type === 'all') {
      this.currentOfferInfo.offers.top5 = this.offersInfo.offers.top5;
      return;
    }

    if (type === 'threeMonths') {
      this.currentOfferInfo.offers.top5 = this.offersInfo.offers.top5.filter(
        (offer) => {
          return offer.fixedRatePeriod === 0 ? true : false;
        }
      );
    }

    if (type === 'oneYear') {
      this.currentOfferInfo.offers.top5 = this.offersInfo.offers.top5.filter(
        (offer) => {
          return offer.fixedRatePeriod === 1 ? true : false;
        }
      );
    }
  }
}
