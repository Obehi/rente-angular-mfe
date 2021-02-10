import { Injectable } from '@angular/core';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, throwError, EMPTY } from 'rxjs';
import { BankVo } from '../../shared/models/bank';
import { HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
interface Environment {
  name?: string | null;
  production: boolean | null;
  baseUrl: string | null;
  crawlerUrl: string | null;
  locale?: string | null;
  tinkUrl?: string | null;
  shouldLog?: boolean;
  tinkNorDanskebankLink?: string | null;
  tinkNorHandelsbankenLink?: string | null;
  coralogixApiUrl?: string | null;
  coralogixPrivateKey?: string | null;
  coralogixApplicationName?: string | null;
  loginDnbIsOn?: boolean;
  loginHandelsbankenIsOn?: boolean;
  loginDanskeIsOn?: boolean;
}

import { HttpClient } from '@angular/common/http';
import { threadId } from 'worker_threads';
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  public environment: Environment = environment;

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
    console.log('env basics');
    console.log(this.environment);
    return this.http
      .get('assets/extra-environment-variables.json')
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
    console.log('returnedEnv');
    console.log(returnedEnv);

    this.environment.shouldLog = returnedEnv['VAR_1'];
    this.environment.loginDnbIsOn = returnedEnv['VAR_2'];
    this.environment.loginHandelsbankenIsOn = returnedEnv['VAR_3'];
    this.environment.loginDanskeIsOn = returnedEnv['VAR_4'];

    console.log('env extended');
    console.log(this.environment);
  }

  handleError(responseError: HttpResponse<any> | any): Observable<any> {
    console.log('error');
    console.log(responseError);
    return EMPTY;
  }
}
