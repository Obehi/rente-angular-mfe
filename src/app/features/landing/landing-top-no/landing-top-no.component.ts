import { Component } from '@angular/core';
import { locale } from '@config/locale/locale';
import { EnvService } from '@services/env.service';
import { LoggingService } from '@services/logging.service';
@Component({
  selector: 'rente-landing-top',
  templateUrl: './landing-top-no.component.html',
  styleUrls: ['./landing-top-no.component.scss']
})
export class LandingTopNoComponent {
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
  }

  public getVariation(): any {
    if ((window as any).google_optimize === undefined) {
      return 0;
    }

    let experimentId: string | null;
    if (this.envService.environment.production === true) {
      experimentId = 'A_F5vClDQDuY0I-JUYxY0g';
    } else {
      experimentId = 'none';
    }

    const variation = (window as any).google_optimize?.get(experimentId);

    return Number(variation) || 0;
  }

  get ctaText(): string {
    const variation = this.getVariation();
    if (variation === 0 || variation === 1) {
      return 'Prøv gratis';
    } else if (variation === 2) {
      return 'Start her';
    }
    return 'Prøv gratis';
  }
}
