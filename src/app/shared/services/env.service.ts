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
  envSubject : BehaviorSubject<Environment> = new BehaviorSubject(environment);
  constructor(private http: HttpClient) { 
 

    this.http.get("../../../assets/env-config.json", { responseType: 'text' as 'json'}).subscribe(data => {

      console.log("data")
      console.log(data)
      data.toString()
      var env = JSON.parse(data.toString()) as Environment
      console.log("setting env again")
      this.environment = env
      this.envSubject = new BehaviorSubject(env);
      console.log("env")
      console.log(env)
    })
   

  }

  get() {  
   
    this.http.get("../../../assets/env-config.json", { responseType: 'text' as 'json'}).subscribe(data => {
      data.toString()
      var env = JSON.parse(data.toString()) as Environment
      this.envSubject.next(env)
      console.log("get")
      console.log(env)
    })
    return this.envSubject
  }

  init() {

    return this.http.get<Environment>("../../../assets/env-config.json", { responseType: 'text' as 'json'}).pipe(
      map( env => env)
    ).pipe(tap( env => this.environment = env)
    ).pipe(tap( env => console.log(env + "iniiiiit")))
   
    this.http.get("../../../assets/env-config.json", { responseType: 'text' as 'json'}).subscribe(data => {
      data.toString()
      var env = JSON.parse(data.toString()) as Environment
      this.envSubject.next(env)

    })
    return this.envSubject
  }





}
  

