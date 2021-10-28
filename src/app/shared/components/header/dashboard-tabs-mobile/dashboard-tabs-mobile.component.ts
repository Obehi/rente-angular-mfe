import { Component, OnDestroy, OnInit } from '@angular/core';
import { ROUTES_MAP } from '@config/routes-config';
import { LocalStorageService } from '@services/local-storage.service';
import { Router } from '@angular/router';
import { EnvService } from '@services/env.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { NotificationService } from '@services/notification.service';
import { TabsService } from '@services/tabs.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'rente-dashboard-tabs-mobile',
  templateUrl: './dashboard-tabs-mobile.component.html',
  styleUrls: ['./dashboard-tabs-mobile.component.scss']
})
export class DashboardTabsMobileComponent implements OnInit, OnDestroy {
  public routesMap = ROUTES_MAP;
  public activeLinkIndex: number | null = -1;
  public isMobile: boolean;
  private subscription: any;
  public imgLink: any;
  public notificationListener = new Subscription();
  public shouldUnsubscribe = new Subject<boolean>();

  // General navLinks to switch between norwegian and  swedish version
  public navLinks: string[] | undefined;

  public navLinksNo: string[] | undefined = [
    'tilbud',
    'mine-lan',
    'bolig',
    'preferanser',
    'profil'
  ];

  // Change preferanser to swedish translation
  public navLinksSv: string[] | undefined = [
    'erbjudande',
    'mina-lan',
    'bostad',
    'preferanser',
    'profil'
  ];

  public imgLinkNo = {
    tilbud: '../../../assets/icons/ic_offer.svg',
    'mine-lan': '../../../assets/icons/ic_loan.svg',
    bolig: '../../../assets/icons/ic_house.svg',
    preferanser: '../../../assets/icons/ic_preferanses.svg',
    profil: '../../../assets/icons/ic_profile.svg'
  };

  public imgLinkSv = {
    erbjudande: '../../../assets/icons/ic_offer.svg',
    'mina-lan': '../../../assets/icons/ic_loan.svg',
    bostad: '../../../assets/icons/ic_house.svg',
    preferanser: '../../../assets/icons/ic_preferanses.svg',
    profil: '../../../assets/icons/ic_profile.svg'
  };

  constructor(
    public localStorageService: LocalStorageService,
    private router: Router,
    private envService: EnvService,
    private notificationService: NotificationService,
    public tabsService: TabsService
  ) {
    if (this.envService.isNorway()) {
      this.navLinks = this.navLinksNo;
      this.imgLink = this.imgLinkNo;
    } else if (this.envService.isSweden()) {
      this.navLinks = this.navLinksSv;
      this.imgLink = this.imgLinkSv;
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

    this.setActiveLinkIndexListener();

    this.tabsService.activeLinkIndexAsObservable().subscribe((index) => {
      if (index !== null) {
        // this.setActiveIndex(index);
        console.log('First subsc', index);
      }
    });
  }

  public setActiveLinkIndexListener(): void {
    this.tabsService
      .activeLinkIndexAsObservable()
      .pipe(takeUntil(this.shouldUnsubscribe))
      .subscribe((index) => {
        console.log('Active Link Listener Mobile');
        if (index !== null) {
          // this.setActiveIcon(index);

          console.log('Current index', index);
        } else {
          console.log('Current index', index);

          throw new Error('index is null');
        }
      });
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

  public setActiveIndex(indx: number): void {
    this.tabsService.setActiveLinkIndex(indx);
  }

  // private setActiveIcon(activeIndex: number) {
  //   if (this.navLinks !== undefined) {
  //     this.navLinks.forEach((link: string, index: number) => {
  //       if (index === activeIndex) {
  //         if (!this.imgLink[link].includes('active')) {
  //           this.imgLink[link] = this.imgLink[link].replace(
  //             '.svg',
  //             '_active.svg'
  //           );
  //         }
  //       } else {
  //         this.imgLink[link] = this.imgLink[link].replace(
  //           '_active.svg',
  //           '.svg'
  //         );
  //       }
  //     });
  //   }
  // }

  ngOnDestroy(): void {
    this.shouldUnsubscribe.next(true);

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.notificationListener) {
      this.notificationListener.unsubscribe();
    }
  }
}
