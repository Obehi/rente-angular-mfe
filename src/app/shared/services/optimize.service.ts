import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.heroku';

@Injectable({
  providedIn: 'root'
})
export class OptimizeService {

  private experimentID = '71Yy7dFHST2juAi74Q9Kpg';
  private localeVariation = 1;
  constructor() { }

  getVariation(): number {
    const isLocale = (environment.name == 'locale' || environment.name == 'undefined' )  ? true : false;
    //console.log("is locale: " + isLocale);

    if(isLocale) {
      //console.log("variation: " + this.localeVariation);
      return this.localeVariation
    }

    let variation = (window as any).google_optimize.get(this.experimentID);
    if( variation == undefined) {
      return 0;
    }
    if((variation == null) {
      return 0;
    }

   console.log("variation in service: " + (window as any).google_optimize.get(this.experimentID));
    return variation;
  }

  getBinaryVariation = () => {
    //console.log("getBinaryOptimizeVariation");
    
    let variation = this.getVariation()
    //console.log(variation);
  
    if( variation == null || variation == 0  ) {
      return false
    } else {
      return true
    }
  };
}
