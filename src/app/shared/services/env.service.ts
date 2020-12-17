import { Injectable } from '@angular/core';

import { environment } from '../../../../dist/rente-front-end/env-config'


@Injectable({
  providedIn: 'root'
})
export class EnvService {

  window: Window
  constructor( window: Window) { 
    this.window = window
  }

  get() {
    return environment
  }


}
  

