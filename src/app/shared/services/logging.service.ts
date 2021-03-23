import { Injectable } from '@angular/core';
import { LocalStorageService } from '@services/local-storage.service';
import { environment } from '@environments/environment';
import { GenericHttpService } from '@services/generic-http.service';
import { HttpClient } from '@angular/common/http';
import { first, tap } from 'rxjs/operators';
import * as uuid from 'uuid';
import { EnvService } from '@services/env.service';
@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private apiUrl: string;
  private privateKey: string;
  private applicationName: string;

  public Level = Level;
  public SubSystem = SubSystem;

  constructor(
    private http: GenericHttpService,
    private httpClient: HttpClient,
    storage: LocalStorageService,
    private envService: EnvService
  ) {
    this.apiUrl = this.envService.environment.coralogixApiUrl;
    this.privateKey = this.envService.environment.coralogixPrivateKey;
    this.applicationName = this.envService.environment.coralogixApplicationName;

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
    object?: any,
    overrideShouldLog?: boolean
  ): void {
    if (
      !this.envService.environment.shouldLog &&
      overrideShouldLog !== undefined &&
      overrideShouldLog === false
    ) {
      return;
    } else {
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
        .postExternal(this.envService.environment.coralogixApiUrl, logg)
        .pipe(first())
        .subscribe(() => {});
    }
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
  TinkMockup = 'Tink Mockup',
  UserConfirmation = 'UserConfirmation'
}
