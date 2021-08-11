import { Component, OnInit, Input } from '@angular/core';
import { Offers } from './../../../../../shared/models/offers';
import { OptimizeService } from '@services/optimize.service';
import { EnvService } from '@services/env.service';
import { fromEvent } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
@Component({
  selector: 'rente-offers-list',
  templateUrl: './offers-list-no.component.html',
  styleUrls: ['./offers-list-no.component.scss'],
  animations: [
    trigger('onScroll', [
      state(
        'true',
        style({
          opacity: 1,
          top: '68px',
          borderRadius: '9px'
        })
      ),
      state('false', style({ opacity: 0, marginTop: '-80px' })),
      transition('false <=> true', animate('200ms ease-out'))
    ])
  ]
})
export class OffersListNoComponent implements OnInit {
  @Input() offersInfo: Offers;
  public currentOfferInfo: Offers;
  public onScroll: boolean;

  constructor(
    public optimizeService: OptimizeService,
    private envService: EnvService
  ) {}

  public getVariation() {
    if ((window as any).google_optimize === undefined) {
      return 0;
    }
    let experimentId: string | null;
    if (this.envService.environment.production === true) {
      experimentId = 'CZzJbFYIQEa_tvn-UeQ2RQ';
    } else {
      experimentId = 'A6Fvld2GTAG3VE95NWV1Hw';
    }
    const variation = (window as any).google_optimize.get(experimentId);
    return variation || 0;
  }

  variation: number | null = null;

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }
  public currentOfferType: string;

  ngOnInit(): void {
    this.setEffectiveRatePullDownListener();
    const obj = document.getElementsByClassName('the-offers')[0];
    fromEvent(window, 'scroll').subscribe(() => {
      if (obj?.getBoundingClientRect().top <= 0) {
        this.onScroll = true;
      } else {
        this.onScroll = false;
      }
    });

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

  public setEffectiveRatePullDownListener(): void {
    const effectiveRateContainer = document.getElementsByClassName(
      'the-offers'
    )[0];
    fromEvent(window, 'scroll').subscribe(() => {
      if (effectiveRateContainer?.getBoundingClientRect().top <= 0) {
        this.onScroll = true;
      } else {
        this.onScroll = false;
      }
    });
  }
}
