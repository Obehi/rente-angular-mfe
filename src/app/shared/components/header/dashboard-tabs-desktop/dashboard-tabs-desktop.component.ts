import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_MAP } from '@config/routes-config';
import { LocalStorageService } from '@services/local-storage.service';
import { AuthService } from '@services/remote-api/auth.service';
import { EnvService } from '@services/env.service';
import { MessageBannerService } from '@services/message-banner.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
import { CustomLangTextService } from '@shared/services/custom-lang-text.service';
import { NotificationService } from '@services/notification.service';
import { Observable, Subscription } from 'rxjs';
import { GlobalStateService } from '@services/global-state.service';

@Component({
  selector: 'rente-dashboard-tabs-desktop',
  templateUrl: './dashboard-tabs-desktop.component.html',
  styleUrls: ['./dashboard-tabs-desktop.component.scss']
})
export class DashboardTabsDesktopComponent implements OnInit, OnDestroy {
  public routesMap = ROUTES_MAP;
  public animationType = getAnimationStyles();
  public dashLogo: string;
  public notificationListener: Subscription;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private auth: AuthService,
    private envService: EnvService,
    private messageService: MessageBannerService,
    private customLangService: CustomLangTextService,
    private notificationService: NotificationService,
    public globalStateService: GlobalStateService
  ) {
    if (this.envService.isNorway()) {
      this.dashLogo = '../../../../../assets/img/renteradar_white_logo-no.svg';
    } else if (this.envService.isSweden()) {
      this.dashLogo = '../../../../../assets/img/renteradar_white_logo-sv.svg';
    }
  }

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

  public logout(): void {
    this.auth.logout();
    // Tried to use a stream to do this in app.component, didnt work but it works with 0ms timeout righ here
    setTimeout(() => {
      this.messageService.setView(
        this.customLangService.logout(),
        4000,
        this.animationType.DROP_DOWN_UP,
        'success',
        window
      );
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.notificationListener) {
      this.notificationListener.unsubscribe();
    }
  }
}
