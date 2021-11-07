import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'rente-email-redirect',
  templateUrl: './email-redirect-no.component.html',
  styleUrls: ['./email-redirect-no.component.scss']
})
export class EmailRedirectNOComponent implements OnInit {
  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  constructor() {}

  ngOnInit(): void {
    const element = document.getElementById('mobil-fb');
    if (this.isMobile && element !== null) {
      element.setAttribute(
        'href',
        'fb-messenger://share?link=https://renteradar.no/&amp;&amp;app_id=326133992135942'
      );
      this.triggerEvent(element, 'click');
    } else {
      window.open(
        'https://www.facebook.com/dialog/send?app_id=326133992135942&link=https%3A%2F%2Frenteradar.no%2F%3Fgrsf%3Dmidspm&redirect_uri=https%3A%2F%2Frenteradar.no%2F'
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  triggerEvent(elem, event): void {
    const clickEvent = new Event(event);
    elem.dispatchEvent(clickEvent);
  }
}
