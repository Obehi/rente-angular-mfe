import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_MAP } from '@config/routes-config';
import { LocalStorageService } from '@services/local-storage.service';
import { OptimizeService } from '@services/optimize.service';
import { AuthService } from '@services/remote-api/auth.service';
import { EnvService } from '@services/env.service';
import { MessageBannerService } from '@services/message-banner.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';

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
    private messageService: MessageBannerService
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
    if (this.localStorageService.getItem('noLoansPresent')) {
      this.router.navigate(['/' + ROUTES_MAP.noLoan]);
    } else if (this.localStorageService.getItem('isAggregatedRateTypeFixed')) {
      this.router.navigate(['/dashboard/fastrente']);
    } else {
      if (this.getActiveIndex() !== null) {
        this.activeLinkIndex = this.getActiveIndex();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.setActiveIcon(this.activeLinkIndex!);
        this.subscription = this.router.events.subscribe((res) => {
          this.activeLinkIndex = this.getActiveIndex();
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.setActiveIcon(this.activeLinkIndex!);
        });
      }
    }
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

  public logout(): void {
    this.auth.logout();
    // Tried to use a stream to do this in app.component, didnt work but it works with 0ms timeout righ here
    setTimeout(() => {
      this.messageService.setView(
        'Du er nå logget ut',
        4000,
        this.animationType.SLIDE_LEFT_RIGHT,
        false
      );
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
