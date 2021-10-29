import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/remote-api/auth.service';
import { MessageBannerService } from '@services/message-banner.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
import { CustomLangTextService } from '@shared/services/custom-lang-text.service';
import { GlobalStateService } from '@services/global-state.service';

@Component({
  selector: 'rente-header-mobile',
  templateUrl: './header-mobile-no.component.html',
  styleUrls: ['./header-mobile-no.component.scss']
})
export class HeaderMobileNoComponent implements OnInit {
  public toggleNavbar: boolean;
  public isSmallScreen: boolean;
  public animationType = getAnimationStyles();
  public screenRef: string;

  public getStartedBtn: boolean;
  public logInBtn: boolean;

  constructor(
    public auth: AuthService,
    private router: Router,
    private messageService: MessageBannerService,
    private customLangService: CustomLangTextService,
    public globalStateService: GlobalStateService
  ) {}

  ngOnInit(): void {
    if (window.innerWidth > 600 && window.innerWidth < 800) {
      this.screenRef = 'slik-fungerer-det-p';
    } else if (window.innerWidth < 600) {
      this.screenRef = 'slik-fungerer-det-m';
    } else if (window.innerWidth > 800) {
      this.screenRef = 'slik-fungerer-det';
    }
  }

  public goToTop(): void {
    window.scrollTo(0, 0);
  }

  public goToHome(): void {
    if (
      this.router.url === '/' ||
      this.router.url === '/#faq' ||
      this.router.url === '/#slik-fungerer-det-m'
    ) {
      window.scrollTo(0, 0);
    } else {
      this.router.navigateByUrl('/');
    }

    this.toggleNav();
  }

  public goToChooseBank(btn: string): void {
    this.router.navigateByUrl('/velgbank');

    if (btn === 'get-started') {
      this.getStartedBtn = true;
      this.logInBtn = false;
    } else if (btn === 'log-in') {
      this.logInBtn = true;
      this.getStartedBtn = false;
    }
  }

  public clearActiveLinks(): void {
    this.getStartedBtn = false;
    this.logInBtn = false;
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
