import { Component } from '@angular/core';
import { locale } from '@config/locale/locale';
import { EnvService } from '@services/env.service';
import { LoggingService } from '@services/logging.service';
@Component({
  selector: 'rente-landing-top-old',
  templateUrl: './landing-top-no-old.component.html',
  styleUrls: ['./landing-top-no-old.component.scss']
})
export class LandingTopNoOldComponent {
  isSweden: boolean;

  get isMobile(): boolean {
    return window.innerWidth < 800;
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

    if (locale.includes('sv')) {
      this.isSweden = true;
    } else {
      this.isSweden = false;
    }
  }
}
