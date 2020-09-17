import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.heroku';

@Injectable({
  providedIn: 'root'
})
export class OptimizeService {

  experimentID = '-FGlj4ayQK66hF9kV4Wiow';
  localeID = 1;
  constructor() { }

  getVariation(): number {
    const isLocale = environment.name == 'undefined' ? true : false;
    console.log("is locale: " + isLocale);

    if(isLocale) {
      console.log("variation: " + this.localeID);

      return this.localeID
    }
    if((window as any).google_optimize == undefined) {
      return null;
    }
    if((window as any).google_optimize == null) {
      return null;
    }

    console.log("variation in service: " + (window as any).google_optimize.get('-FGlj4ayQK66hF9kV4Wiow'));
    return (window as any).google_optimize.get('-FGlj4ayQK66hF9kV4Wiow');
  }

  getBinaryVariation = () => {
    console.log("getBinaryOptimizeVariation");
    
    let variation = this.getVariation()
    console.log(variation);
  
    if(variation || variation == null || variation == 0  ) {
      return false
    } else {
      return true
    }
  };
}
