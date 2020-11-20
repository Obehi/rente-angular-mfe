import { Component, OnInit } from '@angular/core';
import { ROUTES_MAP } from '@config/routes-config';
import { Router } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { ChangeBrowserDialogInfoComponent } from './change-browser-dialog-info/dialog-info.component';

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

  constructor(private router: Router, private dialog: MatDialog) { }
  
  ngOnInit(): void {
    this.dialog.open(ChangeBrowserDialogInfoComponent, {
      panelClass: 'custom-modalbox'
      });
    return

    this.agentTest = window.navigator.userAgent;

    

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


  pushCTAButton() {
    this.isIos = !window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent); 
    if(this.isIos) {
      if(this.isCustomInAppBrowser()) {
      this.dialog.open(ChangeBrowserDialogInfoComponent, {
      panelClass: 'custom-modalbox'
      });
        return
      }
    }
    
    this.isAndroid = /Android/.test(navigator.userAgent); 

    if(this.isAndroid) {
      if(this.isCustomInAppBrowser()) {

        window.open(
          'googlechromes://ranteradar.se/' + ROUTES_MAP.bankSelect
        );
        return
      }
    }

    this.router.navigate(['/' + ROUTES_MAP.bankSelect]);
  }

}


