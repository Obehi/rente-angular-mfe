import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rente-landing-top',
  templateUrl: './landing-top-sv.component.html',
  styleUrls: ['./landing-top-sv.component.scss']
})
export class LandingTopSvComponent implements OnInit {

  get isMobile(): boolean { return window.innerWidth < 600; }
  
  constructor() { }
  
  ngOnInit(): void {
  }


}
