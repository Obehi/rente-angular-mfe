import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/remote-api/auth.service';

@Component({
  selector: 'rente-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.scss']
})
export class HeaderMobileComponent implements OnInit {
  public toggleNavbar: boolean;
  public isSmallScreen: boolean;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  public goToTop(): void {
    window.scrollTo(0, 0);
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
  }
}
