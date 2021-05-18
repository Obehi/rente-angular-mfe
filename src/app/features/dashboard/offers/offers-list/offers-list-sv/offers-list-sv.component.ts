import { Component, OnInit, Input } from '@angular/core';
import { Offers } from './../../../../../shared/models//offers';
import { EnvService } from '@services/env.service';

@Component({
  selector: 'rente-offers-list',
  templateUrl: './offers-list-sv.component.html',
  styleUrls: ['./offers-list-sv.component.scss']
})
export class OffersListSvComponent implements OnInit {
  @Input() offersInfo: Offers;
  public currentOfferInfo: Offers;

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }
  public currentOfferType: string;
  variation: number | null = null;

  constructor(private envService: EnvService) {}

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

  // Returns a number? but variation might be a number in string type
  public getVariation(): any {
    if ((window as any).google_optimize === undefined) {
      return 0;
    }

    let experimentId: string | null;
    if (this.envService.environment.production === true) {
      experimentId = 'R4XzZ2zoREWkM1sqUDv5YQ';
    } else {
      experimentId = 'none';
    }

    console.log('experimentId');
    console.log(experimentId);
    const variation = (window as any).google_optimize?.get(experimentId);
    console.log('variation');
    console.log(variation);
    return variation || 0;
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
