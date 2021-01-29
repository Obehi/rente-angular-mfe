import { Component, OnInit } from '@angular/core';
import { EnvService } from '@services/env.service';
import { LoggingService } from '@services/logging.service';
@Component({
  selector: 'rente-landing-top',
  templateUrl: './landing-top-no.component.html',
  styleUrls: ['./landing-top-no.component.scss']
})
export class LandingTopNoComponent {
  get isMobile(): boolean {
    return window.innerWidth < 600;
  }
  constructor(private envService: EnvService, private logging: LoggingService) {
    console.log(this.envService.environment);
    this.logging.logger(
      logging.Level.Info,
      'WebsiteInit',
      'LandingTopNoComponent',
      'constructor',
      'WebsiteInit',
      'Init with env',
      this.envService.environment
    );
  }
}
