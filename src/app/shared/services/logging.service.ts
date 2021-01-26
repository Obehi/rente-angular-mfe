import { Injectable } from '@angular/core';
import { LocalStorageService } from '@services/local-storage.service';
import { environment } from '@environments/environment';
import { GenericHttpService } from '@services/generic-http.service';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private apiUrl =
    environment['coralogixApiUrl'] || 'https://api.coralogix.com/api/v1/logs';
  private privateKey =
    environment['coralogixPrivateKey'] ||
    'bf331188-c87b-2ce5-4b72-b45e7f47b6f3';
  private applicationName =
    environment['coralogixApplicationName'] || 'se-rente-frontend-dev_13164';
  public Level = Level;
  public SubSystem = SubSystem;

  constructor(
    private http: GenericHttpService,
    private httpClient: HttpClient,
    storage: LocalStorageService
  ) {
    this.sessionId = storage.getItem('LoggingSessionId');
    if (this.sessionId == null) {
      this.sessionId = uuid.v4();
      storage.setItem('LoggingSessionId', this.sessionId);
    }
  }

  sessionId: string;

  public logg(level: string, msg: string, obj: object) {
    if (obj === undefined || obj === null) {
      obj = {};
    }

    obj['message'] = msg;
    obj['sessionID'] = this.sessionId;
    this.httpClient.post('/postlogg', obj).pipe(first()).subscribe();
  }

  public logger(
    level: number,
    category: string,
    className: string,
    methodName: string,
    subSystem: string,
    msg?: string,
    object?: any
  ) {
    let text: any;
    if (msg === undefined && object != undefined) {
      object['sessionId'] = this.sessionId;
      text = JSON.stringify(object);
    } else if (msg !== undefined && object === undefined) {
      text = msg + ' -- ' + this.sessionId;
    } else if (msg !== undefined && object !== undefined) {
      object['message'] = msg;
      object['sessionId'] = this.sessionId;
      text = JSON.stringify(object);
    }

    const tag =
      environment['name'] === undefined || null
        ? category
        : environment['name'] + '_' + category;
    const logg = {
      privateKey: this.privateKey,
      applicationName: this.applicationName,
      subsystemName: subSystem,
      computerName: this.sessionId,
      logEntries: [
        {
          timestamp: Date.now(),
          severity: level,
          text: text,
          category: tag,
          className: className,
          methodName: methodName,
          threadId: this.sessionId
        }
      ]
    };

    this.http
      .postExternal(this.apiUrl, logg)
      .pipe(first())
      .subscribe((res) => {});
  }
}

export enum Level {
  Debug = 1,
  Verbose = 2,
  Info = 3,
  Warn = 4,
  Error = 5,
  Critical = 6
}

export enum SubSystem {
  Tink = 'Tink',
  CrawlerLogin = 'Crawler Login',
  TinkMockup = 'Tink Mockup'
}
