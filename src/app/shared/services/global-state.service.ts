import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, repeat, scan, share, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  private showFooter: Subject<boolean>;
  private isDashboard: Subject<boolean>;
  private notificationOffers = new BehaviorSubject<number>(0);
  private notificationMortgages = new BehaviorSubject<number>(0);
  private notificationHouses = new BehaviorSubject<number>(0);
  private notificationProfile = new Subject<number>();

  constructor() {
    this.showFooter = new Subject<boolean>();
    this.isDashboard = new Subject<false>();
  }

  public setFooterState(show: boolean): void {
    this.showFooter.next(show);
  }

  public getFooterState(): Observable<boolean> {
    return this.showFooter;
  }

  public setDashboardState(state: boolean): void {
    this.isDashboard.next(state);
  }

  public getDashboardState(): Subject<boolean> {
    return this.isDashboard;
  }

  public setContentClassName(currentName: string, newName: string): void {
    document.getElementsByClassName(currentName)[0].className = newName;
  }

  public getNotificationOffers(): Observable<number> {
    return this.notificationOffers;
  }

  public getNotificationMortgages(): Observable<number> {
    return this.notificationMortgages;
  }

  public getNotificationHouses(): Observable<number> {
    return this.notificationHouses;
  }

  public addNotificationOffers(): any {
    this.notificationOffers.pipe(scan((acc) => acc + 1, 0));
  }

  public addNotificationMortgages(): any {
    this.notificationMortgages.pipe(scan((acc) => acc + 1, 0));
  }

  public addNotificationHouses(): any {
    this.notificationHouses.pipe(scan((acc) => acc + 1, 0));
  }

  public getNotificationProfile(): Observable<number> {
    return this.notificationProfile.pipe(
      scan((acc, delta) => (delta ? acc + delta : 0), 0)
    );
  }

  public addNotificationProfile(): any {
    this.notificationProfile.next(1);
  }
}
