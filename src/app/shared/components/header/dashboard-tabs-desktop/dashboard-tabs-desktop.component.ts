import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_MAP } from '@config/routes-config';
import { LocalStorageService } from '@services/local-storage.service';
import { OptimizeService } from '@services/optimize.service';
import { AuthService } from '@services/remote-api/auth.service';

@Component({
  selector: 'rente-dashboard-tabs-desktop',
  templateUrl: './dashboard-tabs-desktop.component.html',
  styleUrls: ['./dashboard-tabs-desktop.component.scss']
})
export class DashboardTabsDesktopComponent implements OnInit {
  public optimize: OptimizeService;
  public routesMap = ROUTES_MAP;

  constructor(
    private router: Router,
    public breakpointObserver: BreakpointObserver,
    private localStorageService: LocalStorageService,
    private auth: AuthService
  ) {}

  public navLinks: string[] | undefined = [
    'tilbud',
    'mine-lan',
    'bolig',
    'preferanser',
    'profil'
  ];
  public activeLinkIndex: number | null = -1;
  public isMobile: boolean;
  public imgLink = {
    tilbud: '../../../assets/icons/ic_offer.svg',
    'mine-lan': '../../../assets/icons/ic_loan.svg',
    bolig: '../../../assets/icons/ic_house.svg',
    preferanser: '../../../assets/icons/ic_preferanses.svg',
    profil: '../../../assets/icons/ic_profile.svg'
  };

  private subscription: any;

  onActivate(event: any) {
    window.scrollTo(0, 0);
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
        this.checkmobileVersion();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
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

  public logout(): void {
    this.auth.logout();
  }
}
