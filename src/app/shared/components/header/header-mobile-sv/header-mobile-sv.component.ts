import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_MAP } from '@config/routes-config';
import { LocalStorageService } from '@services/local-storage.service';
import { MessageBannerService } from '@services/message-banner.service';
import { OptimizeService } from '@services/optimize.service';
import { AuthService } from '@services/remote-api/auth.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
import { CustomLangTextService } from '@shared/services/custom-lang-text.service';

@Component({
  selector: 'rente-header-mobile',
  templateUrl: './header-mobile-sv.component.html',
  styleUrls: ['./header-mobile-sv.component.scss']
})
export class HeaderMobileSvComponent implements OnInit {
  public toggleNavbar: boolean;
  public isSmallScreen: boolean;
  public optimizeService: OptimizeService;
  public routesMap = ROUTES_MAP;
  public animationType = getAnimationStyles();

  constructor(
    public auth: AuthService,
    public localStorageService: LocalStorageService,
    private router: Router,
    private optimize: OptimizeService,
    private messageService: MessageBannerService,
    private customLangService: CustomLangTextService
  ) {
    this.optimizeService = optimize;
  }

  ngOnInit() {}

  public goToTop() {
    window.scrollTo(0, 0);
  }

  public goToHome() {
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
