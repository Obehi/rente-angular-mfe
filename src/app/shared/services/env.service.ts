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
  public environment: Environment;

  constructor(private http: HttpClient) {}

  // Used to initialize provider in module
  init(): void {
    console.log('env init');

    this.http.get('assets/env-config.json').subscribe(
      (env) => {
        this.environment = env as Environment;
        console.log('env');
        console.log(this.environment);
      },
      (error) => {
        console.log('error');
        console.log(error);
      }
    );
  }

  getTinkLinkForBank(bankName: any) {
    const tinkBanks = {
      DANSKE_BANK:
        this.environment.tinkNorDanskebankLink ||
        'https://link.tink.com/1.0/authorize/credentials/no-danskebank-password?client_id=690cbe68c3df412082d5ad8a5a2335d8&redirect_uri=https%3A%2F%2Frente-frontend-dev.herokuapp.com&scope=accounts:read,credentials:read&market=NO&locale=en_US&iframe=true',
      HANDELSBANKEN:
        this.environment.tinkNorHandelsbankenLink ||
        'https://link.tink.com/1.0/authorize/credentials/no-handelsbanken-bankid?client_id=690cbe68c3df412082d5ad8a5a2335d8&redirect_uri=https%3A%2F%2Frente-frontend-dev.herokuapp.com&scope=accounts:read,credentials:read&market=NO&locale=en_US&iframe=true'
    };
    return tinkBanks[bankName];
  }

  isSweden(): boolean {
    return this.environment.locale === 'sv' ? true : false;
  }

  isNorway(): boolean {
    return this.environment.locale === 'nb' ? true : false;
  }
}
