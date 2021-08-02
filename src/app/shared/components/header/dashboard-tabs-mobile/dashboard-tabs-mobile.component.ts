import { Component, OnInit } from '@angular/core';
import { ROUTES_MAP } from '@config/routes-config';
import { LocalStorageService } from '@services/local-storage.service';
import { Router } from '@angular/router';
import { EnvService } from '@services/env.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'rente-dashboard-tabs-mobile',
  templateUrl: './dashboard-tabs-mobile.component.html',
  styleUrls: ['./dashboard-tabs-mobile.component.scss']
})
export class DashboardTabsMobileComponent implements OnInit {
  public notifications: Observable<any>;
  public routesMap = ROUTES_MAP;
  public activeLinkIndex: number | null = -1;
  public isMobile: boolean;
  private subscription: any;
  public imgLink: any;

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
    private envService: EnvService
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

    this.notifications.subscribe((args) => {
      console.log(args);
    });
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getNotification(): Observable<any> {}
}
