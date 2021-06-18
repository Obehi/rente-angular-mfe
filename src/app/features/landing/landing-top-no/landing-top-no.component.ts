import { Component, HostListener, OnInit } from '@angular/core';
import { EnvService } from '@services/env.service';
import { LoggingService } from '@services/logging.service';
@Component({
  selector: 'rente-landing-top',
  templateUrl: './landing-top-no.component.html',
  styleUrls: ['./landing-top-no.component.scss']
})
export class LandingTopNoComponent {
  // @HostListener('window:resize', ['$event'])
  // onresize(event): void {
  //   this.innerWidth = event.target.innerWidth;
  //   // console.log('Resized: ' + this.innerWidth.toString());
  //   if (window.innerWidth > 600) {
  //     this.setMargin = 'margin-desktop';
  //   } else {
  //     this.setMargin = 'margin-mobile';
  //   }
  // }

  // innerWidth: any;
  // public setMargin: string;
  get isMobile(): boolean {
    return window.innerWidth < 600;
  }
  constructor(private envService: EnvService, private logging: LoggingService) {
    this.logging.logger(
      logging.Level.Info,
      'WebsiteInit',
      'LandingTopNoComponent',
      'constructor',
      'WebsiteInit',
      'Init with env',
      this.envService.environment,
      false
    );

    // if (window.innerWidth > 600) {
    //   this.setMargin = 'margin-desktop';
    // } else {
    //   this.setMargin = 'margin-mobile';
    // }
  }
}
