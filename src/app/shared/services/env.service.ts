import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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
}

import { HttpClient } from '@angular/common/http';
import { threadId } from 'worker_threads';
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';

@Injectable()
export class EnvService {
  window: Window;
  test: any;
  public environment: Environment = {
    name: 'local',
    production: false,
    baseUrl: 'https://rente-gateway-dev.herokuapp.com',
    crawlerUrl: 'https://rente-ws-dev.herokuapp.com/ws',
    shouldLog: true,
    tinkUrl:
      'https://link.tink.com/1.0/authorize/?client_id=a84cfc4207574e08be2b561285e05998&redirect_uri=http%3A%2F%2Flocalhost%3A4302%2F&market=SE&locale=en_US&scope=accounts:read,user:read,identity:read&iframe=true&test=true',
    locale: 'sv',
    tinkNorDanskebankLink:
      'https://link.tink.com/1.0/authorize/credentials/no-danskebank-password?client_id=690cbe68c3df412082d5ad8a5a2335d8&redirect_uri=https%3A%2F%2Frente-frontend-dev.herokuapp.com&scope=accounts:read,credentials:read&market=NO&locale=en_US&iframe=true',
    tinkNorHandelsbankenLink:
      'https://link.tink.com/1.0/authorize/credentials/no-handelsbanken-bankid?client_id=690cbe68c3df412082d5ad8a5a2335d8&redirect_uri=https%3A%2F%2Frente-frontend-dev.herokuapp.com&scope=accounts:read,credentials:read&market=NO&locale=en_US&iframe=true',
    coralogixApiUrl: 'https://api.coralogix.com/api/v1/logs',
    coralogixPrivateKey: '26cd19a4-0d74-8c7a-4d91-aa92b7a32bb1',
    coralogixApplicationName: 'rente-frontend-dev_13638'
  };

  private tinkBanks = {
    DANSKE_BANK:
      this.environment.tinkNorDanskebankLink ||
      'https://link.tink.com/1.0/authorize/credentials/no-danskebank-password?client_id=690cbe68c3df412082d5ad8a5a2335d8&redirect_uri=https%3A%2F%2Frente-frontend-dev.herokuapp.com&scope=accounts:read,credentials:read&market=NO&locale=en_US&iframe=true',
    HANDELSBANKEN:
      this.environment.tinkNorHandelsbankenLink ||
      'https://link.tink.com/1.0/authorize/credentials/no-handelsbanken-bankid?client_id=690cbe68c3df412082d5ad8a5a2335d8&redirect_uri=https%3A%2F%2Frente-frontend-dev.herokuapp.com&scope=accounts:read,credentials:read&market=NO&locale=en_US&iframe=true'
  };

  constructor(private http: HttpClient) {}

  // Used to initialize provider in module
  init() {
    this.http.get('../../../../assets/env-config.json').subscribe((env) => {
      console.log(env);
      this.environment = env as Environment;
    });
  }

  getTinkLinkForBank(bankName: any) {
    return this.tinkBanks[bankName];
  }

  isSweden(): boolean {
    return this.environment.locale === 'sv' ? true : false;
  }

  isNorway(): boolean {
    return this.environment.locale === 'nb' ? true : false;
  }
}
