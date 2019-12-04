import { Component } from '@angular/core';

@Component({
  selector: 'rente-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  get isMobile(): boolean {
    return window.innerWidth < 1024;
  }

}
