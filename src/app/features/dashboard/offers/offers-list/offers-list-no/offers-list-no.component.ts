import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Offers } from './../../../../../shared/models/offers';
import { OptimizeService } from '@services/optimize.service';
import { EnvService } from '@services/env.service';
import { fromEvent, Subscription } from 'rxjs';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { MessageBannerService } from '../../../../../shared/services/message-banner.service';
import { filter, switchMap } from 'rxjs/operators';
@Component({
  selector: 'rente-offers-list',
  templateUrl: './offers-list-no.component.html',
  styleUrls: ['./offers-list-no.component.scss']
})
export class OffersListNoComponent implements OnInit, OnDestroy {
  @Input() offersInfo: Offers;
  public currentOfferInfo: Offers;
  public scrollSubscription: Subscription;

  constructor(
    public optimizeService: OptimizeService,
    private messageService: MessageBannerService,
    private notificationService: NotificationService,
    private envService: EnvService
  ) {}

  // Save for later use
  /*  public getVariation() {
    if ((window as any).google_optimize === undefined) {
      console.log('couldnt get optimize');
      return 0;
    }
    let experimentId: string | null;
    if (this.envService.environment.production === true) {
      console.log('is production');
      experimentId = '_7-we-p9SA2OAVDcKn0xVA';
    } else {
      console.log('is not production');
      experimentId = 'A6Fvld2GTAG3VE95NWV1Hw';
    }
    const variation = (window as any).google_optimize.get(experimentId);
    console.log((window as any).google_optimize.get(experimentId));
    console.log(variation);
    return variation || 0;
  } */

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }
  public currentOfferType: string;

  ngOnDestroy(): void {
    this.scrollSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.setNotificationScrollListener();

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

  private setNotificationScrollListener(): void {
    const obj = document.getElementsByClassName('the-offers')[0];

    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(
        filter(() => obj?.getBoundingClientRect().top <= 0),
        switchMap(() =>
          this.notificationService.getOfferNotificationAsObservable()
        ),
        filter((notificationNumber) => notificationNumber === 1)
      )
      .subscribe(() => {
        this.messageService.detachView();
        this.notificationService.resetOfferNotification();
      });
  }
}
