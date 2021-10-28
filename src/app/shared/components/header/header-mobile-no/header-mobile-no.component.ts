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
  constructor(
    public auth: AuthService,
    private router: Router,
    private messageService: MessageBannerService,
    private customLangService: CustomLangTextService,
    public globalStateService: GlobalStateService
  ) {}

  ngOnInit(): void {}

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
  public toggleNav(): void {
    this.toggleNavbar = !this.toggleNavbar;
  }

  // public scrollToHowItWorks(): void {
  //   document.getElementById('slik-fungerer-det-m')?.scrollIntoView({
  //     behavior: 'smooth',
  //     block: 'start',
  //     inline: 'start'
  //   });
  // }

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
