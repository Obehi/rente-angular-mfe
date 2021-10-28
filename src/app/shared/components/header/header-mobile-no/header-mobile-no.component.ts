import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/remote-api/auth.service';
import { MessageBannerService } from '@services/message-banner.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
import { CustomLangTextService } from '@shared/services/custom-lang-text.service';
import { GlobalStateService } from '@services/global-state.service';
import { ROUTES_MAP } from '@config/routes-config';
import { TabsService } from '@services/tabs.service';

@Component({
  selector: 'rente-header-mobile',
  templateUrl: './header-mobile-no.component.html',
  styleUrls: ['./header-mobile-no.component.scss']
})
export class HeaderMobileNoComponent implements OnInit {
  public toggleNavbar: boolean;
  public isSmallScreen: boolean;
  public animationType = getAnimationStyles();
  public isDashboard: boolean;
  public goToRoute: string;

  constructor(
    public auth: AuthService,
    private router: Router,
    private messageService: MessageBannerService,
    private customLangService: CustomLangTextService,
    public globalStateService: GlobalStateService,
    public tabsService: TabsService
  ) {}

  ngOnInit(): void {
    this.setDashboardListener();
  }

  public setDashboardListener(): void {
    this.globalStateService
      .getDashboardState()
      .asObservable()
      .subscribe((state) => {
        console.log('Inside listener');

        if (state) {
          this.isDashboard = true;
          console.log('Is DASHBOARD');
        } else {
          this.isDashboard = false;
          console.log('NOT DASHBOARD!');
        }
      });
  }

  public goToTop(): void {
    if (!this.isDashboard) {
      this.router.navigateByUrl('/');
      window.scrollTo(0, 0);
      console.log('Go to home page');
    } else {
      this.router.navigateByUrl('/dashboard/' + ROUTES_MAP.offers);
      console.log('Go to Offers page');
    }
  }

  public goToHome(): void {
    if (this.router.url === '/' || this.router.url === '/#faq') {
      window.scrollTo(0, 0);
    } else {
      this.router.navigateByUrl('/');
    }

    this.toggleNav();
  }
  public toggleNav(): void {
    this.toggleNavbar = !this.toggleNavbar;
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn;
  }

  public logout(): void {
    this.auth.logout();
    this.toggleNav();

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
}
