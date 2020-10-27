import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rente-landing-top',
  templateUrl: './landing-top-sv.component.html',
  styleUrls: ['./landing-top-sv.component.scss']
})
export class LandingTopSvComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  get isMobile(): boolean { return window.innerWidth < 600; }

}
