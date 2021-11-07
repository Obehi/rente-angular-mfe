import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@services/remote-api/auth.service';
import { LocalStorageService } from '@services/local-storage.service';
import { GlobalStateService } from '@services/global-state.service';
import { MessageBannerService } from '@services/message-banner.service';
import { CustomLangTextService } from '@services/custom-lang-text.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';

@Component({
  selector: 'rente-header-desktop',
  templateUrl: './header-desktop-no.component.html',
  styleUrls: ['./header-desktop-no.component.scss']
})
export class HeaderDesktopNoComponent implements OnInit {
  public toggleNavbar: boolean;
  public isSmallScreen: boolean;
  public getStartedBtn: boolean;
  public logInBtn: boolean;
  public animationType = getAnimationStyles();

  constructor(
    public auth: AuthService,
    public localStorageService: LocalStorageService,
    private router: Router,
    public globalStateService: GlobalStateService,
    private customLangService: CustomLangTextService,
    private messageService: MessageBannerService
  ) {}

  ngOnInit(): void {}

  public goToTop(): void {
    window.scrollTo(0, 0);
  }

  public goToHome(): void {
    if (
      this.router.url === '/' ||
      this.router.url === '/#faq' ||
      this.router.url === '/#slik-fungerer-det'
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

    setTimeout(() => {
      this.messageService.setView(
        this.customLangService.logout(),
        4000,
        this.animationType.DROP_DOWN_UP,
        'success',
        window
      );
    }, 0);
    this.goToTop();
  }
}
