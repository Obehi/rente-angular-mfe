import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { ROUTES_MAP } from '@config/routes-config';
import { locale } from '../../.././config/locale/locale';
import { environment } from '@environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: "rente-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit {
  public routes = ROUTES_MAP
  isSweden: boolean;
  public env = environment
  public bankguidenLink : SafeUrl 
  constructor(public router: Router, 
    private sanitizer: DomSanitizer, 
    ) {}
  shouldShowFooter = true;

  ngOnInit() {
    let url = `https:/renteradar.no/bankguiden`
    this.bankguidenLink = this.sanitizer.bypassSecurityTrustUrl(url)

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
