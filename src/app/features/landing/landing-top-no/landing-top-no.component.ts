import { Component, OnInit } from '@angular/core';
import { EnvService } from '@services/env.service';

@Component({
  selector: 'rente-landing-top',
  templateUrl: './landing-top-no.component.html',
  styleUrls: ['./landing-top-no.component.scss']
})
export class LandingTopNoComponent implements OnInit {
  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  constructor(private envService: EnvService) {}

  ngOnInit(): void {}
}
