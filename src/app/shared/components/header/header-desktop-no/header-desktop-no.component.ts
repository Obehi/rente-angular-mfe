import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@services/remote-api/auth.service';
import { LocalStorageService } from '@services/local-storage.service';
import { GlobalStateService } from '@services/global-state.service';

@Component({
  selector: 'rente-header-desktop',
  templateUrl: './header-desktop-no.component.html',
  styleUrls: ['./header-desktop-no.component.scss']
})
export class HeaderDesktopNoComponent implements OnInit {
  public toggleNavbar: boolean;
  public isSmallScreen: boolean;
  public komIgangBtn: boolean;
  public logInBtn: boolean;

  constructor(
    public auth: AuthService,
    public localStorageService: LocalStorageService,
    private router: Router,
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

    if (btn === 'kom-i-gang') {
      this.komIgangBtn = true;
      this.logInBtn = false;
    } else if (btn === 'logg-inn') {
      this.logInBtn = true;
      this.komIgangBtn = false;
    }
  }

  public clearActiveLinks(): void {
    this.komIgangBtn = false;
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
  }
}
