import { AuthService } from '@services/remote-api/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '@services/local-storage.service';

@Component({
  selector: 'rente-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
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

  getVariation(): number | null {
    if((window as any).google_optimize == undefined) {
      return null;
    }
    if((window as any).google_optimize == null) {
      return null;
    }

    console.log("variation " + (window as any).google_optimize.get('-FGlj4ayQK66hF9kV4Wiow'));
    return (window as any).google_optimize.get('-FGlj4ayQK66hF9kV4Wiow');
  }

}
