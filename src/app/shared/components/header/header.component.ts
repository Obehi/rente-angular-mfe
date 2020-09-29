import { AuthService } from '@services/remote-api/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '@services/local-storage.service';
import { OptimizeService} from '@services/optimize.service'
@Component({
  selector: 'rente-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public toggleNavbar: boolean;
  public isSmallScreen: boolean;
  public optimizeService: OptimizeService
  constructor(
    public auth: AuthService,
    public localStorageService: LocalStorageService,
    private router: Router,
    private optimize: OptimizeService
  ) {
    this.optimizeService = optimize
  }

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
