import { Component, OnInit, Input } from '@angular/core';
import { Offers } from './../../../../../shared/models/offers';
import { OptimizeService } from '@services/optimize.service';
import { EnvService } from '@services/env.service';
@Component({
  selector: 'rente-offers-list',
  templateUrl: './offers-list-no.component.html',
  styleUrls: ['./offers-list-no.component.scss']
})
export class OffersListNoComponent implements OnInit {
  @Input() offersInfo: Offers;
  public currentOfferInfo: Offers;

  constructor(
    public optimizeService: OptimizeService,
    private envService: EnvService
  ) {}

  // It looks like it returns a number
  public getVariation(): any {
    if ((window as any).google_optimize === undefined) {
      return 0;
    }
    let experimentId: string | null;
    if (this.envService.environment.production === true) {
      experimentId = 'ltS3-bOLQ6S2DjHISLjZJw';
    } else {
      experimentId = 'A6Fvld2GTAG3VE95NWV1Hw';
    }
    console.log('experimentId');
    console.log(experimentId);

    const variation = (window as any).google_optimize.get(experimentId);
    console.log('variation');
    console.log(variation);
    return variation || 0;
  }

  variation: number | null = null;

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }
  public currentOfferType: string;

  ngOnInit(): void {
    this.variation = this.getVariation();

    this.currentOfferInfo = JSON.parse(JSON.stringify(this.offersInfo));
    this.currentOfferType = 'all';

    let flag = false;
    this.offersInfo.offers.top5 = this.offersInfo.offers.top5.map((offer) => {
      offer.loanType = flag ? 'threeMonths' : 'oneYear';
      flag = !flag;
      return offer;
    });
  }

  public setOfferType(type: string): void {
    this.currentOfferType = type;

    if (type === 'all') {
      this.currentOfferInfo.offers.top5 = this.offersInfo.offers.top5;
      return;
    }
    const newLoanTypeSelected = this.offersInfo.offers.top5.filter((item) => {
      return item.loanType === type;
    });

    this.currentOfferInfo.offers.top5 = newLoanTypeSelected;
  }
}
