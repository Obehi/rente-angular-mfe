import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { Offers } from './../../../../../shared/models/offers';
import { OptimizeService } from '@services/optimize.service';
import { EnvService } from '@services/env.service';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { MessageBannerService } from '../../../../../shared/services/message-banner.service';
@Component({
  selector: 'rente-offers-list',
  templateUrl: './offers-list-no.component.html',
  styleUrls: ['./offers-list-no.component.scss']
})
export class OffersListNoComponent implements OnInit, OnDestroy {
  @Input() offersInfo: Offers;
  public currentOfferInfo: Offers;
  public scrollSubscription: Subscription;
  public notificationSubscription: Subscription;
  private notificationNumber: number;

  constructor(
    public optimizeService: OptimizeService,
    private envService: EnvService,
    private messageService: MessageBannerService,
    private notificationService: NotificationService
  ) {}

  // Save for later use
  /* public getVariation() {
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
  } */

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }
  public currentOfferType: string;

  ngOnDestroy(): void {
    this.scrollSubscription.unsubscribe();
    this.notificationSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.notificationSubscription = this.notificationService
      .getOfferNotificationAsObservable()
      .subscribe((args) => {
        this.notificationNumber = args;
      });

    const obj = document.getElementsByClassName('the-offers')[0];

    this.scrollSubscription = fromEvent(window, 'scroll').subscribe(() => {
      if (
        obj?.getBoundingClientRect().top <= 0 &&
        this.notificationNumber === 1
      ) {
        this.messageService.detachView();
      }
    });

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
