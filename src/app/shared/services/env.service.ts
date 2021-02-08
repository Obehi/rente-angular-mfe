import { Injectable } from '@angular/core';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, throwError, EMPTY } from 'rxjs';
import { BankVo } from '../../shared/models/bank';
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
  loginDnbIsOn: boolean;
  loginHandelsbankenIsOn: boolean;
  loginDanskeIsOn: boolean;
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
    baseUrl: 'https://rente-gateway-dev.herokuapp.com',
    crawlerUrl: 'https://rente-ws-dev.herokuapp.com/ws',
    shouldLog: false,
    tinkUrl:
      'https://link.tink.com/1.0/authorize/?client_id=3973e78ee8c140edbf36e53d50132ba1&redirect_uri=https%3A%2F%2Franteradar.se&scope=accounts:read,identity:read&market=SE&locale=sv_SE&iframe=true',
    locale: 'sv',
    tinkNorDanskebankLink:
      'https://link.tink.com/1.0/authorize/credentials/no-danskebank-password?client_id=690cbe68c3df412082d5ad8a5a2335d8&redirect_uri=https%3A%2F%2Frenteradar.no&scope=accounts:read,credentials:read&market=NO&locale=no_NO&iframe=true',
    tinkNorHandelsbankenLink:
      'https://link.tink.com/1.0/authorize/credentials/no-handelsbanken-bankid?client_id=690cbe68c3df412082d5ad8a5a2335d8&redirect_uri=https%3A%2F%2Frenteradar.no&scope=accounts:read,credentials:read&market=NO&locale=no_NO&iframe=true',
    coralogixApiUrl: 'https://api.coralogix.com/api/v1/logs',
    coralogixPrivateKey: '92caa3a2-90d2-9f01-7d00-077afb69d8e5',
    coralogixApplicationName: 'rente-frontend-prod_13639',
    loginHandelsbankenIsOn: true,
    loginDanskeIsOn: true,
    loginDnbIsOn: true
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
        tap((returnedEnv) => this.handleEnvFile(returnedEnv)),
        catchError((error) => this.handleError(error))
      )
      .toPromise();
  }

  getTinkLinkForBank(bankName: string): string {
    return this.tinkBanks[bankName];
  }

  isSweden(): boolean {
    return this.environment.locale === 'sv' ? true : false;
  }

  isNorway(): boolean {
    return this.environment.locale === 'nb' ? true : false;
  }

  isMissing(bank: BankVo): boolean {
    return (
      (bank.name === 'DANSKE_BANK' &&
        this.environment.loginDanskeIsOn === false) ||
      (bank.name === 'HANDELSBANKEN' &&
        this.environment.loginHandelsbankenIsOn === false)
    );
  }

  handleEnvFile(returnedEnv: any): void {
    if (returnedEnv.ENV_1 === 'prod' || returnedEnv.ENV_1 === 'dev') {
      this.environment = this.convertToEnv(returnedEnv);
    }
  }

  convertToEnv(buffer: any): Environment {
    return {
      name: buffer.VAR_1,
      production: buffer.VAR_2,
      baseUrl: buffer.VAR_3,
      crawlerUrl: buffer.VAR_4,
      locale: buffer.VAR_5,
      shouldLog: buffer.VAR_6,
      loginDnbIsOn: buffer.VAR_7,
      loginHandelsbankenIsOn: buffer.VAR_8,
      loginDanskeIsOn: buffer.VAR_9,
      tinkUrl: buffer.VAR_10,
      tinkNorDanskebankLink: buffer.VAR_11,
      tinkNorHandelsbankenLink: buffer.VAR_12,
      coralogixApiUrl: buffer.VAR_13,
      coralogixPrivateKey: buffer.VAR_14,
      coralogixApplicationName: buffer.VAR_15
    } as Environment;
  }

  handleError(responseError: HttpResponse<any> | any): Observable<any> {
    console.log('error');
    console.log(responseError);
    return EMPTY;
  }
}
