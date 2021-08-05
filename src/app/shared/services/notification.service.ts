import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private profileNotification = new BehaviorSubject<number>(0);
  private mortgageNotification = new BehaviorSubject<number>(0);
  private offerNotification = new BehaviorSubject<number>(0);
  private housesNotification = new BehaviorSubject<number>(0);

  constructor() {}

  getProfileNotificationAsObservable(): Observable<number> {
    return this.profileNotification;
  }

  setProfileNotification(): void {
    const value = this.profileNotification.value;
    this.profileNotification.next(value + 1);
  }

  getHousesNotificationAsObservable(): Observable<number> {
    return this.housesNotification;
  }

  setHousesNotification(): void {
    const value = this.housesNotification.value;
    this.housesNotification.next(value + 1);
  }

  getMortgagesNotificationAsObservable(): Observable<number> {
    return this.mortgageNotification;
  }

  setMortgagesNotification(): void {
    const value = this.mortgageNotification.value;
    this.mortgageNotification.next(value + 1);
  }

  getOfferNotificationAsObservable(): Observable<number> {
    return this.offerNotification;
  }

  setOfferNotification(): void {
    const value = this.offerNotification.value;
    this.offerNotification.next(value + 1);
  }
}
