import { Injectable } from '@angular/core';
//import { environment } from '../../../../dist/rente-front-end/env-config'
import { environment } from '../../../../env/env.js'
import { test } from '../../../../env/env-test.js'
import {BehaviorSubject} from 'rxjs'
import {map, tap} from 'rxjs/operators'

interface Environment { 
  name: string | null,
  production: boolean | null, 
  baseUrl: string | null,
  crawlerUrl: string | null,
  tinkUrl: string | null,
  locale: string | null
}

import {
  HttpClient,
} from '@angular/common/http';
import { threadId } from 'worker_threads';


@Injectable()
export class EnvService {
  window: Window
  public environment: Environment = {
    "name": "local",
    "production": false,
    "baseUrl": "https://rente-gateway-dev.herokuapp.com",
    "crawlerUrl": "https://rente-ws-dev.herokuapp.com/ws",
    "tinkUrl": "https://link.tink.com/1.0/authorize/?client_id=a84cfc4207574e08be2b561285e05998&redirect_uri=http%3A%2F%2Flocalhost%3A4302%2F&market=SE&locale=en_US&scope=accounts:read,user:read,identity:read&iframe=true&test=true",
    "locale": "sv"
  }
  
  constructor(private http: HttpClient) { 

  }

  //Used to initialize provider in module
  init() {
    return this.http.get<Environment>("../../../../assets/env-config.json", { responseType: 'text' as 'json'}).pipe(
      map( env => env)
    ).pipe(tap( env => this.environment = env)
    ).subscribe( env => {
      console.log(env)
    })
  }
}
  

