import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '@services/local-storage.service';
import { AuthService } from '@services/remote-api/auth.service';

@Component({
  selector: 'rente-header-desktop',
  templateUrl: './header-desktop-sv.component.html',
  styleUrls: ['./header-desktop-sv.component.scss']
})
export class HeaderDesktopSvComponent implements OnInit {
  public toggleNavbar: boolean;
  public isSmallScreen: boolean;

  constructor(
    public auth: AuthService,
    public localStorageService: LocalStorageService,
    private router: Router
  ) {}

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
