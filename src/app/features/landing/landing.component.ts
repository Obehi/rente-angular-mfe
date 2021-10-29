import { Component, OnInit } from '@angular/core';

import { locale } from '@config/locale/locale';
import { EnvService } from '@services/env.service';

@Component({
  selector: 'rente-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  time = 0;
  isSweden = false;

  constructor(private envService: EnvService) {}

  ngOnInit(): void {}

  public isNewLandingVersion(): boolean {
    if ((window as any).google_optimize === undefined) {
      // console.log('couldnt get optimize');
      return false;
    }
    let experimentId: string | null;
    if (this.envService.environment.production === true) {
      // console.log('is production');
      experimentId = 'A_F5vClDQDuY0I-JUYxY0g';
    } else {
      // console.log('is not production');
      experimentId = 'A_F5vClDQDuY0I-JUYxY0g';
    }

    const variation = (window as any).google_optimize.get(experimentId);
    console.log((window as any).google_optimize.get(experimentId));

    return variation !== 0;
  }
}
