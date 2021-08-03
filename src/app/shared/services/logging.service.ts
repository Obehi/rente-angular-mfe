import { Injectable } from '@angular/core';
import { LocalStorageService } from '@services/local-storage.service';
import { environment } from '@environments/environment';
import { GenericHttpService } from '@services/generic-http.service';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import * as uuid from 'uuid';
import { EnvService } from '@services/env.service';
@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private apiUrl?: string | null | undefined;
  private privateKey?: string | null;
  private applicationName?: string | null;

  public Level = Level;
  public SubSystem = SubSystem;
  sessionId: string;

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
    // eslint-disable-next-line eqeqeq
    if (this.sessionId == null) {
      this.sessionId = uuid.v4();
      storage.setItem('LoggingSessionId', this.sessionId);
    }
  }

  public googleAnalyticsLog(item: GoogleAnalyticsDto): void {
    (window as any).dataLayer.push({
      event: 'eventTracking',
      category: item.category,
      action: item.action,
      label: item.label
    });
  }

  public logger(
    level: number,
    category: string,
    className: string,
    methodName: string,
    subSystem: string,
    msg?: string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
      // eslint-disable-next-line eqeqeq
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
      if (this.apiUrl !== undefined && this.apiUrl !== null) {
        this.http
          .postExternal(this.apiUrl, logg)
          .pipe(first())
          .subscribe(() => {});
      }
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

export interface GoogleAnalyticsDto {
  category: string;
  label: string;
  action: string;
}
