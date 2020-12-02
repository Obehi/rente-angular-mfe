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

  }

  isCustomInAppBrowser() {
    let isSnapchat = /snapchat/i.test(window.navigator.userAgent) 
    let isFacebook = (/FBAN/i.test(window.navigator.userAgent)|| /FBAN/i.test(window.navigator.userAgent))
    let isInstagram = /Instagram/i.test(window.navigator.userAgent)

    return isSnapchat || isFacebook || isInstagram;
  }

  
  getType() {
    let isInstagram = /Instagram/i.test(window.navigator.userAgent)
    if(isInstagram) {
      return "button-middle"
    } else {
      return 'button-right'
    }
  }


  pushCTAButton() {
    this.isIos = !window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent); 
    if(this.isIos) {
      if(this.isCustomInAppBrowser()) {
      this.dialog.open(ChangeBrowserDialogInfoComponent, {
      panelClass: 'custom-modalbox',
      data: { type: this.getType()}
      });
        return
      }
    }
  
    this.isAndroid = /Android/.test(navigator.userAgent); 

    if(this.isAndroid) {
      if(this.isCustomInAppBrowser()) {
        window.location.assign("intent:https://ranteradar.se/" + ROUTES_MAP.bankSelect + ";end");
        return
      }
    }
    this.router.navigate(['/' + ROUTES_MAP.bankSelect]);
  }
}


