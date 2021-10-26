import { Component } from '@angular/core';
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
    console.log('this.getVariation()');
    console.log(this.getVariation());
  }

  public getVariation(): any {
    if ((window as any).google_optimize === undefined) {
      return 0;
    }

    let experimentId: string | null;
    if (this.envService.environment.production === true) {
      experimentId = 'lhTxK2BuQ52Fohere2-DRw';
    } else {
      experimentId = 'none';
    }

    const variation = (window as any).google_optimize?.get(experimentId);
    return variation || 0;
  }
}
