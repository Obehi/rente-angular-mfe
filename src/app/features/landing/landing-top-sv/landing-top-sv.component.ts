import { Component, OnInit } from '@angular/core';
import { ROUTES_MAP } from '@config/routes-config';

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

  agentTest: string;

  constructor() { }
  
  ngOnInit(): void {
    this.agentTest = window.navigator.userAgent;
    var regex = new RegExp("snapchat"); 
    this.agentTest = /snapchat/i.test("somethingsnapchatsomething") ? "is snapchat" : "is not snapchat"

    
    this.isSnapchat = /snapchat/i.test(window.navigator.userAgent) ? "is snapchat" : "is not snapchat"
    this.isFacebook = (/FBAN/i.test(window.navigator.userAgent)|| /FBAN/i.test(window.navigator.userAgent)) ? "is facebook" : "is not facebook"
    this.isInstagram = /Instagram/i.test(window.navigator.userAgent) ? "is insta" : "is not insta"

    
    const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent)

  }


}
