import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_MAP } from '@config/routes-config';
import { LocalStorageService } from '@services/local-storage.service';
import { OptimizeService } from '@services/optimize.service';
import { AuthService } from '@services/remote-api/auth.service';
import { EnvService } from '@services/env.service';
import { MessageBannerService } from '@services/message-banner.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
import { CustomLangTextService } from '@shared/services/custom-lang-text.service';
import { NotificationService } from '@services/notification.service';
import { Observable, Subscription } from 'rxjs';
import { TabsService } from '@services/tabs.service';

@Component({
  selector: 'rente-dashboard-tabs-desktop',
  templateUrl: './dashboard-tabs-desktop.component.html',
  styleUrls: ['./dashboard-tabs-desktop.component.scss']
})
export class DashboardTabsDesktopComponent implements OnInit {
  public optimize: OptimizeService;
  public routesMap = ROUTES_MAP;
  private subscription: any;
  public isMobile: boolean;
  public activeLinkIndex: number | null = -1;
  public imgLink: any;
  public animationType = getAnimationStyles();
  public dashLogo: string;
  public notificationListener: Subscription;

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
    private router: Router,
    private localStorageService: LocalStorageService,
    private auth: AuthService,
    private envService: EnvService,
    private messageService: MessageBannerService,
    private customLangService: CustomLangTextService,
    private notificationService: NotificationService,
    private tabsService: TabsService
  ) {
    if (this.envService.isNorway()) {
      this.navLinks = this.navLinksNo;
      this.imgLink = this.imgLinkNo;
      this.dashLogo = '../../../../../assets/img/renteradar_white_logo-no.svg';
    } else if (this.envService.isSweden()) {
      this.navLinks = this.navLinksSv;
      this.imgLink = this.imgLinkSv;
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
    } else {
      if (this.getActiveIndex() !== null) {
        this.activeLinkIndex = this.getActiveIndex();
        // Send the intial index
        this.tabsService.setActiveLinkIndex(this.getActiveIndex());

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.setActiveIcon(this.activeLinkIndex!);

        this.subscription = this.router.events.subscribe(() => {
          this.activeLinkIndex = this.getActiveIndex();
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.setActiveIcon(this.activeLinkIndex!);

          // Send index on router change
          this.tabsService.setActiveLinkIndex(this.activeLinkIndex);
        });
      }
    }

    this.tabsService.activeLinkIndexAsObservable().subscribe((index) => {
      if (index !== null) {
        this.activeLinkIndex = index;
        this.setActiveIcon(this.activeLinkIndex);
      } else {
        console.log('Index is NULL, cannot set active link index', index);
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

  onActivate(event: any) {
    window.scrollTo(0, 0);
  }

  public getActiveIndex(): number | null {
    if (this.navLinks !== undefined) {
      const setIndex = this.navLinks.find(
        (link) => `/dashboard/${link}` === this.router.url.split('?')[0]
      );
      if (setIndex !== undefined) {
        return this.navLinks.indexOf(setIndex);
      }
    }
    return null;
  }

  private setActiveIcon(activeIndex: number) {
    if (this.navLinks !== undefined) {
      this.navLinks.forEach((link: string, index: number) => {
        if (index === activeIndex) {
          if (!this.imgLink[link].includes('active')) {
            this.imgLink[link] = this.imgLink[link].replace(
              '.svg',
              '_active.svg'
            );
          }
        } else {
          this.imgLink[link] = this.imgLink[link].replace(
            '_active.svg',
            '.svg'
          );
        }
      });
    }
  }

  public setActiveIndex(indx: number): void {
    this.tabsService.setActiveLinkIndex(indx);
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
