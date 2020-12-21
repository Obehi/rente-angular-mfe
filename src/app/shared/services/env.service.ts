import { Injectable } from '@angular/core';
//import { environment } from '../../../../dist/rente-front-end/env-config'
import { environment } from '../../../../env/env.js'
import { test } from '../../../../env/env-test.js'

@Injectable({
  providedIn: 'root'
})
export class EnvService {


  window: Window
  constructor( window: Window) { 
    this.window = window
    console.log(environment)

    console.log(environment)

    
    
    System.import('../../../../env/env-test.js').then(response => {
      console.log("test")
      response.environment.test().then(tast => console.log(tast))
      console.log("envfromsystemimport")
      console.log(response.environment)})
    System.import('../../../../env/env.js').then(response => console.log(response.environment))
    System.import('../../../../env/env.js').then(response => console.log(response.environment))

    import('../../../../env/env.js').then(environment => {
     console.log(environment.environment)
    });

  }

  get() {
    console.log(environment)
   return environment
  }


}
  

