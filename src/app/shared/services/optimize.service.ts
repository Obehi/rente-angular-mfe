import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.heroku';

@Injectable({
  providedIn: 'root'
})
export class OptimizeService {


  private experimentID = '486O0RUlSMCPtcnEjUtFtg';
  private localeVariation = 0;
  constructor() {}
  
  getVariation(): number {
    
    //const isLocale = (environment.name == 'locale' || environment.name == 'undefined' )  ? true : false;
    const isLocale = false;

    if(isLocale) {

      return this.localeVariation
    }

    let googleOptimize = (window as any).google_optimize;

    if(googleOptimize == undefined) {
      return 0
    }

    let variation = (window as any).google_optimize.get(this.experimentID);

    if( variation == undefined) {
      return 0;
    }
    
    if(variation == null) {
      return 0;
    }
    
    return variation;
  }

  getBinaryVariation = () => {

    let variation = this.getVariation()

    if( variation == null || variation == 0  ) {
      return false
    } else {
      return true
    }
  };
}
