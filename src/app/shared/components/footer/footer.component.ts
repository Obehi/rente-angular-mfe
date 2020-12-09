import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { ROUTES_MAP } from '@config/routes-config';

@Component({
  selector: "rente-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit {
  public routes = ROUTES_MAP
  constructor(public router: Router) {}
  shouldShowFooter = true;

  ngOnInit() {
    this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.shouldShowFooter = (event.url !== '/messenger-share')
      }
    });

  }
}
