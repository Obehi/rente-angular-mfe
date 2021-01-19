import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'
import {map, tap,} from 'rxjs/operators'

interface Environment { 
  name: string | null,
  production: boolean | null, 
  baseUrl: string | null,
  crawlerUrl: string | null,
  locale: string | null,
  tinkUrl: string | null,
}

import {
  HttpClient,
} from '@angular/common/http';
import { threadId } from 'worker_threads';
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';


@Injectable()
export class EnvService {
  window: Window
  test: any 
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
    
    this.http.get("../../../../assets/env-config.json").subscribe( env => {
      console.log("1212enc")
      console.log(env)
      console.log(env['name'])
      this.environment = env as Environment
      console.log(this.environment.baseUrl)
    })
  }
}
  

