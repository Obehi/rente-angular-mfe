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
  
  constructor() { }
  
  ngOnInit(): void {
  }


}
