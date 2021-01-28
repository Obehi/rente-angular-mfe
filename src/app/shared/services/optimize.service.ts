import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OptimizeService {
  private experimentID = '486O0RUlSMCPtcnEjUtFtg';
  private localeVariation = 0;

  getVariation(): number {
    const isLocale = false;

    if (isLocale) {
      return this.localeVariation;
    }

    const googleOptimize = (window as any).google_optimize;

    if (googleOptimize === undefined) {
      return 0;
    }

    const variation = (window as any).google_optimize.get(this.experimentID);

    if (variation === undefined) {
      return 0;
    }

    if (variation === null) {
      return 0;
    }

    return variation;
  }

  getBinaryVariation = () => {
    const variation = this.getVariation();

    if (variation === null || variation === 0) {
      return false;
    } else {
      return true;
    }
  };
}
