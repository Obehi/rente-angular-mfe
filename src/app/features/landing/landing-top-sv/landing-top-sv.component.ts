import { Component, OnInit } from '@angular/core';
import { ROUTES_MAP } from '@config/routes-config';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'rente-landing-top',
  templateUrl: './landing-top-sv.component.html',
  styleUrls: ['./landing-top-sv.component.scss']
})
export class LandingTopSvComponent implements OnInit {
  public routesMap = ROUTES_MAP;
  get isMobile(): boolean {
    return window.innerWidth < 600;
  }
  isSnapchat: string;
  isFacebook: string;
  isInstagram: string;
  isIos: boolean;
  isAndroid: boolean;
  agentTest: string;

  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.agentTest = window.navigator.userAgent;
  }

  isCustomInAppBrowser(): boolean {
    const isSnapchat = /snapchat/i.test(window.navigator.userAgent);
    const isFacebook =
      /FBAN/i.test(window.navigator.userAgent) ||
      /FBAN/i.test(window.navigator.userAgent);
    const isInstagram = /Instagram/i.test(window.navigator.userAgent);
    const linkedIn = /LinkedInApp/i.test(window.navigator.userAgent);

    return isSnapchat || isFacebook || isInstagram || linkedIn;
  }

  pushCTAButton() {
    this.isIos =
      !window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent);
    this.isAndroid = /Android/.test(navigator.userAgent);
    if (this.isIos) {
      if (this.isCustomInAppBrowser()) {
        const isInstagram = /Instagram/i.test(window.navigator.userAgent);
        const linkedIn = /LinkedInApp/i.test(window.navigator.userAgent);
        const type = this.getType();
        if (isInstagram) {
          this.router.navigate(['/' + ROUTES_MAP.bankSelect], {
            state: { data: { iosPopup: true, type: type, app: 'instagram' } }
          });
        } else if (linkedIn) {
          this.router.navigate(['/' + ROUTES_MAP.bankSelect], {
            state: { data: { iosPopup: true, type: type, app: 'linkedIn' } }
          });
        } else {
          this.router.navigate(['/' + ROUTES_MAP.bankSelect], {
            state: { data: { iosPopup: true, type: type, app: 'other' } }
          });
        }
        return;
      }
    } else if (this.isAndroid) {
      if (this.isCustomInAppBrowser()) {
        // window.location.assign("intent:https://ranteradar.se/" + ROUTES_MAP.bankSelect + ";end")
        this.router.navigate(['/' + ROUTES_MAP.bankSelect], {
          state: { data: { androidPopup: true } }
        });
        return;
      }
    }
    this.router.navigate(['/' + ROUTES_MAP.bankSelect]);
  }

  getType() {
    const isInstagram = /Instagram/i.test(window.navigator.userAgent);
    const linkedIn = /LinkedInApp/i.test(window.navigator.userAgent);

    if (isInstagram || linkedIn) {
      return 'top-right';
    } else {
      return 'bottom-right';
    }
  }
}
