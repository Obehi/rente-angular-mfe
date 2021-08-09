import { Injectable } from '@angular/core';
import { Offers } from '@models/offers';
import { LoansService } from '@services/remote-api/loans.service';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, filter, share, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  private messageHandler: Subject<OfferMessage>;
  public isUpdatingOffers$ = new Subject<boolean>();
  public updateOffers$ = new Subject<void>();
  private offers$: Observable<Offers>;
  public shouldUpdateOffersLater = false;

  public readonly updateOfferResponse$ = this.updateOffers$.pipe(
    switchMap(() => this.loansService.getOffers()),
    share(),
    tap(() => {
      console.log('shouldUpdateOffersLater = false');
      this.shouldUpdateOffersLater = false;
    })
  );
  constructor(private loansService: LoansService) {
    this.messageHandler = new Subject<OfferMessage>();
    this.offers$ = this.loansService.getOffers();

    this.scrollOfferUpdateObserver().subscribe();
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
          window.innerHeight -
            document
              .getElementsByClassName('offers-container')[0]
              .getBoundingClientRect().top -
            60 >
            0 && this.shouldUpdateOffersLater
      ),
      tap(() => this.updateOffers$.next())
    );
  }
}

export enum OfferMessage {
  antiChurn = 'antiChurn'
}
