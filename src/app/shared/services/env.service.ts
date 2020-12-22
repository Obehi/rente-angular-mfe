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
    "tinkUrl": "https://link.tink.com/1.0/authorize/?client_id=3973e78ee8c140edbf36e53d50132ba1&redirect_uri=https%3A%2F%2Franteradar.se&scope=accounts:read,identity:read&market=SE&locale=sv_SE&iframe=true",
    "locale": "nb"
  }
  
  constructor(private http: HttpClient) { 

  }

  //Used to initialize provider in module
  init() {
    return this.http.get<Environment>("../../../assets/env-config.json", { responseType: 'text' as 'json'}).pipe(
      map( env => env)
    ).pipe(tap( env => this.environment = env)
    )
  }
}
  

