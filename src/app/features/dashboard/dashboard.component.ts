import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { LocalStorageService } from '@services/local-storage.service';
import { OptimizeService } from '@services/optimize.service';
import { ROUTES_MAP } from '@config/routes-config';
import { GlobalStateService } from '@services/global-state.service';
import { AuthService } from '@services/remote-api/auth.service';

@Component({
  selector: 'rente-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {
  public optimize: OptimizeService;
  public routesMap = ROUTES_MAP;
  public isDashboard: boolean;

  constructor(
    private router: Router,
    public breakpointObserver: BreakpointObserver,
    private localStorageService: LocalStorageService,
    private globalStateService: GlobalStateService,
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
  public imgLink = {
    tilbud: '../../../assets/icons/ic_offer.svg',
    'mine-lan': '../../../assets/icons/ic_loan.svg',
    bolig: '../../../assets/icons/ic_house.svg',
    preferanser: '../../../assets/icons/ic_preferanses.svg',
    profil: '../../../assets/icons/ic_profile.svg'
  };

  get isMobile(): boolean {
    return window.innerWidth < 992;
  }

  private subscription: any;

  onActivate(event: any) {
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {
    this.globalStateService.setDashboardState(true);
    this.isDashboard = true;

    this.globalStateService.setContentClassName('content', 'content-dashboard');

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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.globalStateService.setDashboardState(false);
    this.isDashboard = false;
    this.globalStateService.setContentClassName('content-dashboard', 'content');
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
  }
}
