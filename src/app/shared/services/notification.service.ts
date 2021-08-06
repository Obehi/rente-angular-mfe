import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
    this.profileNotification.next(1);
  }

  getHousesNotificationAsObservable(): Observable<number> {
    return this.housesNotification;
  }

  setHousesNotification(): void {
    this.housesNotification.next(1);
  }

  getMortgagesNotificationAsObservable(): Observable<number> {
    return this.mortgageNotification;
  }

  setMortgagesNotification(): void {
    this.mortgageNotification.next(1);
  }

  getOfferNotificationAsObservable(): Observable<number> {
    return this.offerNotification;
  }

  setOfferNotification(): void {
    this.offerNotification.next(1);
  }

  resetOfferNotification(): void {
    this.offerNotification.next(0);
  }
}
