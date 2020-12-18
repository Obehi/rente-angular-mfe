import { Injectable } from '@angular/core';
//import { environment } from '../../../../dist/rente-front-end/env-config'
import { environment } from '../../../../env/env.js'



@Injectable({
  providedIn: 'root'
})
export class EnvService {

  window: Window
  constructor( window: Window) { 
    this.window = window
    console.log(environment)

  }

  get() {
    console.log(environment)
   return environment
  }


}
  

