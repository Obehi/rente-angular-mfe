import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'rente-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  public isSmallScreen: boolean;

  constructor() {
    this.onResize();
  }

  ngOnInit() {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    window.innerWidth <= 991 ? this.isSmallScreen = true : this.isSmallScreen = false;
  }

}
