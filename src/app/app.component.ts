import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MetaService } from '@shared/services/meta.service';
import { TitleService } from '@services/title.service';
import { LocalStorageService } from '@services/local-storage.service';
import { ROUTES_MAP } from '@config/routes-config';
import { MessageBannerService } from '@shared/services/message-banner.service';

import { AuthService } from '@services/remote-api/auth.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';

@Component({
  selector: 'rente-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public static CookiesAcceptedKey = 'isCookiesAccepted';

  public title = 'rente-front-end';
  public navigationSubscription: Subscription;
  public showCookieAcc: boolean;
  public animStyle = getAnimationStyles();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private metaService: MetaService,
    private titleService: TitleService,
    private localStorageService: LocalStorageService,
    private messageService: MessageBannerService,
    private auth: AuthService
  ) {}

  onActivate(): void {
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.changeTitles();
        if ((window as any).dataLayer) {
          (window as any).dataLayer.push({
            event: 'virtualPageView',
            url: window.location.href
          });
        }
      }
    });

    if (!this.localStorageService.getItem(AppComponent.CookiesAcceptedKey)) {
      this.showCookieAcc = true;
    }

    this.auth.logoutSubject.subscribe((val) => {
      if (val === 'LoggedOut') {
        this.messageService.setView(
          'Du er nå logget ut',
          3000,
          this.animStyle.SLIDE_LEFT_RIGHT
        );
      }
    });
  }

  private changeTitles(): void {
    let data = this.route.root.firstChild?.snapshot.data;
    if (
      !data?.title &&
      this.route.root.firstChild &&
      this.route.root.firstChild.firstChild &&
      this.route.root.firstChild.firstChild.firstChild
    ) {
      data = this.route.root.firstChild.firstChild.firstChild.snapshot.data;
    }
    const title = data?.title;
    const metaData = data?.meta;

    this.titleService.setTitle(title);
    if (metaData) {
      this.metaService.updateMetaTags(metaData.name, metaData.description);
    }
  }

  acceptCookies(): void {
    this.localStorageService.setItem(AppComponent.CookiesAcceptedKey, true);
    this.showCookieAcc = false;
  }

  readMore(): void {
    this.router.navigate([`/${ROUTES_MAP.privacyPolicy}`]);
  }
}
