import { Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { BankVo } from '../../shared/models/bank';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
export interface Environment {
  name?: string | null;
  production: boolean | null;
  baseUrl: string;
  crawlerUrl: string | null;
  locale?: string | null;
  tinkUrl?: string | null;
  shouldLog?: boolean;
  tinkNorDanskebankLink?: string | null;
  tinkNorHandelsbankenLink?: string | null;
  coralogixApiUrl?: string;
  coralogixPrivateKey?: string | null;
  coralogixApplicationName?: string | null;
  loginDnbIsOn?: boolean;
  loginHandelsbankenIsOn?: boolean;
  loginDanskeIsOn?: boolean;
  sb1TryAgainDowntime?: any;
  sb1DisabledBanks?: string[];
}

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
    return this.http
      .get('assets/extra-environment-variables.json')
      .pipe(
        tap((returnedEnv) => this.handleEnvFile(returnedEnv)),
        catchError(() => this.handleError())
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
    this.environment.shouldLog = returnedEnv['VAR_1'];
    this.environment.loginDnbIsOn = returnedEnv['VAR_2'];
    this.environment.loginHandelsbankenIsOn = returnedEnv['VAR_3'];
    this.environment.loginDanskeIsOn = returnedEnv['VAR_4'];
    this.environment.sb1DisabledBanks = (returnedEnv['VAR_5'] as string)
      .replace(/\s/g, '')
      .split(',');
    this.environment.sb1TryAgainDowntime = returnedEnv['VAR_6'];
  }

  handleError(): Observable<any> {
    return EMPTY;
  }
}
