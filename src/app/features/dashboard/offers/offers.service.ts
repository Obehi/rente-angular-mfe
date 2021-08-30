import { Injectable, OnDestroy } from '@angular/core';
import { Offers } from '@models/offers';
import { MessageBannerService } from '@services/message-banner.service';
import { NotificationService } from '@services/notification.service';
import { LoansService } from '@services/remote-api/loans.service';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, filter, share, switchMap, tap } from 'rxjs/operators';

import { DashboardModule } from '../dashboard.module';
@Injectable({
  providedIn: 'root'
})
export class OffersService implements OnDestroy {
  private messageHandler: Subject<OfferMessage>;
  public isUpdatingOffers$ = new Subject<boolean>();
  public updateOffers$ = new Subject<void>();
  private offers$: Observable<Offers>;
  public shouldUpdateOffersLater = false;
  private scrollOffersSubscription: Subscription;
  public notificationScrollSubscription: Subscription;

  public readonly updateOfferResponse$ = this.updateOffers$.pipe(
    switchMap(() => this.loansService.getOffers()),
    share(),
    tap(() => {
      console.log('shouldUpdateOffersLater = false');
      this.shouldUpdateOffersLater = false;
    })
  );
  constructor(
    private loansService: LoansService,
    private notificationService: NotificationService,
    public messageBannerService: MessageBannerService
  ) {
    this.messageHandler = new Subject<OfferMessage>();
    // this.offers$ = this.loansService.getOffers();
    this.scrollOffersSubscription = this.scrollOfferUpdateObserver().subscribe();
    this.setNotificationScrollListener();
  }

  ngOnDestroy(): void {
    this.scrollOffersSubscription.unsubscribe();
    this.notificationScrollSubscription.unsubscribe();
  }
  pushMessage(message: OfferMessage): void {
    this.messageHandler.next(message);
  }

  messages(): Subject<OfferMessage> {
    return this.messageHandler;
  }

  scrollOfferUpdateObserver(): Observable<any> {
    return fromEvent(window, 'scroll').pipe(
      debounceTime(100),
      filter(
        () =>
          document.getElementsByClassName('offers-container')[0] !== undefined
      ),
      filter(
        () =>
          window.innerHeight -
            document
              .getElementsByClassName('offers-container')[0]
              .getBoundingClientRect().top -
            60 >
            0 && this.shouldUpdateOffersLater
      ),
      debounceTime(100),
      tap(() => {
        this.updateOffers$.next();
      })
    );
  }

  private setNotificationScrollListener(): void {
    this.notificationScrollSubscription = fromEvent(window, 'scroll')
      .pipe(
        filter(
          () =>
            document
              .getElementsByClassName('the-offers')[0]
              ?.getBoundingClientRect().top <= 0
        ),
        switchMap(() =>
          this.notificationService.getOfferNotificationAsObservable()
        ),
        filter((notificationNumber) => notificationNumber === 1)
      )
      .subscribe(() => {
        this.messageBannerService.detachView();
        this.notificationService.resetOfferNotification();
      });
  }
}

export enum OfferMessage {
  antiChurn = 'antiChurn'
}
