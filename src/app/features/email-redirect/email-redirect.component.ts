import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'rente-email-redirect',
  templateUrl: './email-redirect.component.html',
  styleUrls: ['./email-redirect.component.scss']
})
export class EmailRedirectComponent implements OnInit {
  
  get isMobile (): boolean { return window.innerWidth < 600; }
  
  constructor(private activeRoute: ActivatedRoute) {

  }

  ngOnInit(): void {

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
