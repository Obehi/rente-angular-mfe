import { AuthService } from "@services/remote-api/auth.service";
import { Component, OnInit } from "@angular/core";

import { LocalStorageService } from "@services/local-storage.service";

@Component({
  selector: "rente-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  public toggleNavbar: boolean;
  public isSmallScreen: boolean;

  constructor(
    public auth: AuthService,
    public localStorageService: LocalStorageService
  ) {}

  ngOnInit() {}

  public goToPage() {
    this.toggleNav();
    window.scrollTo(0, 0);
  }
  public toggleNav() {
    this.toggleNavbar = !this.toggleNavbar;
  }
}
