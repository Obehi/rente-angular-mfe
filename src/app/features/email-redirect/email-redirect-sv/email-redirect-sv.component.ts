import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { locale } from '@config/locale/locale'
@Component({
  selector: 'rente-email-redirect',
  templateUrl: './email-redirect-sv.component.html',
  styleUrls: ['./email-redirect-sv.component.scss']
})
export class EmailRedirectSVComponent implements OnInit {
  
  get isMobile (): boolean { return window.innerWidth < 600; }
  localeBaseUrl: string
  constructor(private activeRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.localeBaseUrl = locale.includes("sv") ? "http://ranteradar.se/" : "http://renteradar.no/"
    if(this.isMobile) {
      var element = document.getElementById("mobil-fb")
      element.setAttribute("href", "fb-messenger://share?link=https://renteradar.no/&&app_id=326133992135942")
      this.triggerEvent(element, 'click')
    } else {
      window.open(
        "https://www.facebook.com/dialog/send?app_id=326133992135942&link=https%3A%2F%2Frente-frontend-dev.herokuapp.com%2F%3Fgrsf%3Dmidspm&redirect_uri=https%3A%2F%2Frente-frontend-dev.herokuapp.com%2F"
      ); 
    }
  }

  triggerEvent( elem, event ) {
    var clickEvent = new Event( event ); 
    elem.dispatchEvent( clickEvent );    
  }
}
