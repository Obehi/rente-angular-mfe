import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  private messageHandler: Subject<OfferMessage>;

  constructor() {
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
