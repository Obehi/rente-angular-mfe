import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OptimizeService {
  private experimentID = '9d84Epc8T3amY5DsACFhVA';
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

    console.log('variation');
    console.log(variation);
    console.log('exp variable');
    console.log(
      ((window as any).google_optimize as any) &&
        (window as any).google_optimize.get(this.experimentID)
    );

    console.log('exp hardcode');

    console.log(
      ((window as any).google_optimize as any) &&
        (window as any).google_optimize.get('9d84Epc8T3amY5DsACFhVA')
    );
    if (variation === undefined) {
      return 0;
    }

    if (variation === null) {
      return 0;
    }
    return variation as number;
  }

  getBinaryVariation = (): boolean => {
    const variation = this.getVariation();

    if (variation === null || variation === 0) {
      return false;
    } else {
      return true;
    }
  };
}
