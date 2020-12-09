import { AuthService } from '@services/remote-api/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '@services/local-storage.service';

@Component({
  selector: 'rente-header',
  templateUrl: './header-no.component.html',
  styleUrls: ['./header-no.component.scss']
})
export class HeaderNoComponent implements OnInit {
  public toggleNavbar: boolean;
  public isSmallScreen: boolean;

  constructor(
    public auth: AuthService,
    public localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit() {}

  public goToTop() {

    console.log("test gototop")
    console.log(this.router.url === '/')
    window.scrollTo(0, 0);
  }

  public goToHome() {
    if(this.router.url === '/' || this.router.url === '/#faq' ) {
      window.scrollTo(0, 0);
    } else {
      this.router.navigateByUrl('/');
    }

    this.toggleNav();
  }
  public toggleNav() {
    this.toggleNavbar = !this.toggleNavbar;
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn;
  }

}
