import { Component, OnInit } from '@angular/core';
import { ROUTES_MAP } from '@config/routes-config';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { LocalStorageService } from '@services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'rente-dashboard-tabs-mobile',
  templateUrl: './dashboard-tabs-mobile.component.html',
  styleUrls: ['./dashboard-tabs-mobile.component.scss']
})
export class DashboardTabsMobileComponent implements OnInit {
  public routesMap = ROUTES_MAP;
  public activeLinkIndex: number | null = -1;
  public isMobile: boolean;
  private subscription: any;

  public imgLink = {
    tilbud: '../../../../../assets/icons/ic_offer.svg',
    'mine-lan': '../../../../../assets/icons/ic_loan.svg',
    bolig: '../../../../../assets/icons/ic_house.svg',
    preferanser: '../../../../../assets/icons/ic_preferanses.svg',
    profil: '../../../../../assets/icons/ic_profile.svg'
  };

  public navLinks: string[] | undefined = [
    'tilbud',
    'mine-lan',
    'bolig',
    'preferanser',
    'profil'
  ];
  constructor(
    public breakpointObserver: BreakpointObserver,
    public localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Dashboard tabs functions
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
        this.checkmobileVersion();
      }
    }
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

  private checkmobileVersion() {
    this.breakpointObserver
      .observe(['(min-width: 992px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isMobile = false;
        } else {
          this.isMobile = true;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
