import { Injectable } from '@angular/core';
import { UserService } from '@services/remote-api/user.service';
import { BehaviorSubject, Subject } from 'rxjs';

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
}

export enum OfferMessage {
  antiChurn = 'antiChurn'
}
