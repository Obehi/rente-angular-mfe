import { Component, OnDestroy, OnInit } from '@angular/core';
import { ROUTES_MAP } from '@config/routes-config';
import { LocalStorageService } from '@services/local-storage.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NotificationService } from '@services/notification.service';
import { GlobalStateService } from '@services/global-state.service';

@Component({
  selector: 'rente-dashboard-tabs-mobile',
  templateUrl: './dashboard-tabs-mobile.component.html',
  styleUrls: ['./dashboard-tabs-mobile.component.scss']
})
export class DashboardTabsMobileComponent implements OnInit, OnDestroy {
  public routesMap = ROUTES_MAP;
  public notificationListener = new Subscription();

  constructor(
    public localStorageService: LocalStorageService,
    private router: Router,
    private notificationService: NotificationService,
    public globalStateService: GlobalStateService
  ) {}

  ngOnInit(): void {
    this.notificationListener = this.getProfileNotifications().subscribe();
    this.notificationListener = this.getHousesNotifications().subscribe();
    this.notificationListener = this.getMortgageNotifications().subscribe();
    this.notificationListener = this.getOfferNotifications().subscribe();

    if (this.localStorageService.getItem('noLoansPresent')) {
      this.router.navigate(['/' + ROUTES_MAP.noLoan]);
    } else if (this.localStorageService.getItem('isAggregatedRateTypeFixed')) {
      this.router.navigate(['/dashboard/fastrente']);
    }
  }

  getProfileNotifications(): Observable<number> {
    return this.notificationService.getProfileNotificationAsObservable();
  }

  getHousesNotifications(): Observable<number> {
    return this.notificationService.getHousesNotificationAsObservable();
  }

  getMortgageNotifications(): Observable<number> {
    return this.notificationService.getMortgagesNotificationAsObservable();
  }

  getOfferNotifications(): Observable<number> {
    return this.notificationService.getOfferNotificationAsObservable();
  }

  ngOnDestroy(): void {
    if (this.notificationListener) {
      this.notificationListener.unsubscribe();
    }
  }
}
