import { Injectable } from '@angular/core';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, throwError, EMPTY } from 'rxjs';

import { HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
interface Environment {
  name: string | null;
  production: boolean | null;
  baseUrl: string | null;
  crawlerUrl: string | null;
  locale: string | null;
  tinkUrl: string | null;
  shouldLog: boolean;
  tinkNorDanskebankLink: string | null;
  tinkNorHandelsbankenLink: string | null;
  coralogixApiUrl: string | null;
  coralogixPrivateKey: string | null;
  coralogixApplicationName: string | null;
  dnbLogin: boolean;
}

import { HttpClient } from '@angular/common/http';
import { threadId } from 'worker_threads';
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  public environment: Environment = {
    name: 'local',
    production: false,
    baseUrl: 'https://rente-gateway-prod.herokuapp.com',
    crawlerUrl: 'https://rente-ws-prod.herokuapp.com/ws',
    shouldLog: false,
    dnbLogin: true,
    tinkUrl:
      'https://link.tink.com/1.0/authorize/?client_id=3973e78ee8c140edbf36e53d50132ba1&redirect_uri=https%3A%2F%2Franteradar.se&scope=accounts:read,identity:read&market=SE&locale=sv_SE&iframe=true',
    locale: 'nb',
    tinkNorDanskebankLink:
      'https://link.tink.com/1.0/authorize/credentials/no-danskebank-password?client_id=690cbe68c3df412082d5ad8a5a2335d8&redirect_uri=https%3A%2F%2Frenteradar.no&scope=accounts:read,credentials:read&market=NO&locale=no_NO&iframe=true',
    tinkNorHandelsbankenLink:
      'https://link.tink.com/1.0/authorize/credentials/no-handelsbanken-bankid?client_id=690cbe68c3df412082d5ad8a5a2335d8&redirect_uri=https%3A%2F%2Frenteradar.no&scope=accounts:read,credentials:read&market=NO&locale=no_NO&iframe=true',
    coralogixApiUrl: 'https://api.coralogix.com/api/v1/logs',
    coralogixPrivateKey: '92caa3a2-90d2-9f01-7d00-077afb69d8e5',
    coralogixApplicationName: 'rente-frontend-prod_13639'
  };

  private tinkBanks = {
    DANSKE_BANK:
      this.environment.tinkNorDanskebankLink ||
      'https://link.tink.com/1.0/authorize/credentials/no-danskebank-password?client_id=690cbe68c3df412082d5ad8a5a2335d8&redirect_uri=https%3A%2F%2Frenteradar.no&scope=accounts:read,credentials:read&market=NO&locale=en_US&iframe=true',
    HANDELSBANKEN:
      this.environment.tinkNorHandelsbankenLink ||
      'https://link.tink.com/1.0/authorize/credentials/no-handelsbanken-bankid?client_id=690cbe68c3df412082d5ad8a5a2335d8&redirect_uri=https%3A%2F%2Frenteradar.no&scope=accounts:read,credentials:read&market=NO&locale=en_US&iframe=true'
  };

  constructor(private http: HttpClient) {}

  // Used to initialize provider in module
  loadEnv(): Promise<Environment> {
    return this.http
      .get('assets/environment.json')
      .pipe(
        tap((returnedEnv) => this.handleEnvFile(returnedEnv as Environment)),
        catchError((error) => this.handleError(error))
      )
      .toPromise();
  }

  getTinkLinkForBank(bankName: any): string {
    return this.tinkBanks[bankName];
  }

  isSweden(): boolean {
    return this.environment.locale === 'sv' ? true : false;
  }

  isNorway(): boolean {
    return this.environment.locale === 'nb' ? true : false;
  }

  handleEnvFile(returnedEnv: Environment): void {
    if (returnedEnv.name === 'prod' || returnedEnv.name === 'dev') {
      this.environment = returnedEnv;
    }
  }

  handleError(responseError: HttpResponse<any> | any): Observable<any> {
    console.log('error');
    console.log(responseError);
    return EMPTY;
  }
}
