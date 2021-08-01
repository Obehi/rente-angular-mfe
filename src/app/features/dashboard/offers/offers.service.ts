import { Injectable } from '@angular/core';
import { UserService } from '@services/remote-api/user.service';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  private messageHandler: Subject<OfferMessage>;
  public isUpdatingOffers$ = new Subject<boolean>();
  public updateOffers$ = new Subject<void>();

  public shouldUpdateOffersLater = false;
  constructor(private userService: UserService) {
    this.messageHandler = new Subject<OfferMessage>();
  }

  pushMessage(message: OfferMessage): void {
    this.messageHandler.next(message);
  }

  messages(): Subject<OfferMessage> {
    return this.messageHandler;
  }

  scrollOfferUpdateObserver(): Observable<any> {
    return fromEvent(window, 'scroll').pipe(
      filter(
        () =>
          window.innerHeight -
            document
              .getElementsByClassName('offers-container')[0]
              .getBoundingClientRect().top -
            60 >
            0 && this.shouldUpdateOffersLater
      )
    );
  }
}

export enum OfferMessage {
  antiChurn = 'antiChurn'
}
