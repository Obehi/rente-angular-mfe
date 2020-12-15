import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'rente-email-redirect',
  templateUrl: './email-redirect-no.component.html',
  styleUrls: ['./email-redirect-no.component.scss']
})
export class EmailRedirectNOComponent implements OnInit {
  
  get isMobile (): boolean { return window.innerWidth < 600; }
  
  constructor(private activeRoute: ActivatedRoute) {

  }

  ngOnInit(): void {

    if(this.isMobile) {
      var element = document.getElementById("mobil-fb")
      element.setAttribute("href", "fb-messenger://share?link=https://renteradar.no/&amp;&amp;app_id=326133992135942")
      this.triggerEvent(element, 'click')
    } else {
      window.open(
        "https://www.facebook.com/dialog/send?app_id=326133992135942&amp;link=https://renteradar.no/&amp;redirect_uri=https://renteradar.no/"
      ); 
    }
    }

  triggerEvent( elem, event ) {
    var clickEvent = new Event( event ); 
    elem.dispatchEvent( clickEvent );    
  }
}
