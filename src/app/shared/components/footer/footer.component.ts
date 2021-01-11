import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { ROUTES_MAP } from '@config/routes-config';
import { locale } from '../../.././config/locale/locale';
import { environment } from '@environments/environment';
import { env } from "process";

@Component({
  selector: "rente-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit {
  public routes = ROUTES_MAP
  isSweden: boolean;
  public env = environment
  public bankguidenLink = "/bankguiden"
  constructor(public router: Router) {}
  shouldShowFooter = true;

  ngOnInit() {
    if(locale.includes("sv")) {
      this.isSweden = true
    } else{
      this.isSweden = false
    }

    this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.shouldShowFooter = (event.url !== '/messenger-share')
      }
    });

  }
}
