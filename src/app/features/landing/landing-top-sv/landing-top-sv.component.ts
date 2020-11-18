import { Component, OnInit } from '@angular/core';
import { ROUTES_MAP } from '@config/routes-config';
import { Router } from "@angular/router";

@Component({
  selector: 'rente-landing-top',
  templateUrl: './landing-top-sv.component.html',
  styleUrls: ['./landing-top-sv.component.scss']
})
export class LandingTopSvComponent implements OnInit {
  public routesMap = ROUTES_MAP
  get isMobile(): boolean { return window.innerWidth < 600; }
  isSnapchat: string
  isFacebook: string
  isInstagram: string
  isIos: boolean
  isAndroid: boolean

  agentTest: string;

  constructor(private router: Router) { }
  
  ngOnInit(): void {

    window.open(
      'googlechromes://ranteradar.se/' + ROUTES_MAP.bankSelect
    );

    this.agentTest = window.navigator.userAgent;

    this.isIos = !window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent); 
    if(this.isIos) {
      if(this.isCustomInAppBrowser()) {
        // show dialog
        return
      }
    }
    
    this.isAndroid = /Android/.test(navigator.userAgent); 

    if(this.isAndroid) {
      if(this.isCustomInAppBrowser()) {

        this.router.navigate(['googlechromes://ranteradar.se/' + ROUTES_MAP.bankSelect]);
        return
      }
    }




    var regex = new RegExp("snapchat"); 
    this.agentTest = /snapchat/i.test("somethingsnapchatsomething") ? "is snapchat" : "is not snapchat"

    
    this.isSnapchat = /snapchat/i.test(window.navigator.userAgent) ? "is snapchat" : "is not snapchat"
    this.isFacebook = (/FBAN/i.test(window.navigator.userAgent)|| /FBAN/i.test(window.navigator.userAgent)) ? "is facebook" : "is not facebook"
    this.isInstagram = /Instagram/i.test(window.navigator.userAgent) ? "is insta" : "is not insta"

    

  }

  isCustomInAppBrowser() {
    let isSnapchat = /snapchat/i.test(window.navigator.userAgent) 
    let isFacebook = (/FBAN/i.test(window.navigator.userAgent)|| /FBAN/i.test(window.navigator.userAgent))
    let isInstagram = /Instagram/i.test(window.navigator.userAgent)

    return isSnapchat || isFacebook || isInstagram;
  }

}


