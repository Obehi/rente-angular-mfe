import { AuthService } from "@services/remote-api/auth.service";
import { LoansService } from "@services/remote-api/loans.service";
import { UserService } from "@services/remote-api/user.service";
import { LocalStorageService } from "@services/local-storage.service";

import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  HostListener
} from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ROUTES_MAP } from '@config/routes-config';
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { environment } from "@environments/environment";
import { API_URL_MAP } from "@config/api-url-config";
import { Subscription, interval, Observable, timer, forkJoin } from "rxjs";
import {
  IDENTIFICATION_TIMEOUT_TIME,
  PING_TIME,
  RECONNECTION_TRIES,
  RECONNECTION_TIME,
  BANKID_STATUS,
  BANKID_TIMEOUT_TIME,
  MESSAGE_STATUS
} from "../auth/login-status/login-status.config";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EnvService} from '@services/env.service'

@Component({
  selector: 'rente-auth-sv',
  templateUrl: './auth-sv.component.html',
  styleUrls: ['./auth-sv.component.scss']
})
export class AuthSvComponent implements OnInit, OnDestroy {
  
  public isMockTest = false;
  public isLoginStarted = false;
  public tinkCode: number;
  public tinkSuccess = false;
  private stompClient: any;
  private intervalSubscription: Subscription;
  public isSuccess = false;
  public tinkUrl: SafeUrl;
  public environment: any
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private loansService: LoansService,
    private localStorageService: LocalStorageService,
    private sanitizer: DomSanitizer,
    private envService: EnvService

  ) { 

  }

  ngOnInit(): void {

  }

 

  @HostListener('window:message', ['$event'])
  onMessage(event) {
    if (event.origin !== 'https://link.tink.com') {
    return;
    }

    console.log("Tink response");

    let data = JSON.parse(event.data)
    if (data.type === 'code') {
      // This is the authorization code that should be exchanged for an access token

      this.tinkCode = event.data.data;
      console.log(`T response: ${data.type }`);
      this.initializeWebSocketConnection(data.data)
    }
  }

  ngOnDestroy() {
  }

  private initializeWebSocketConnection(tinkCode: number) {
    this.connectAndReconnectSocket(this.successSocketCallback);
    
    const socket = new SockJS(this.environment.crawlerUrl);
    this.stompClient = Stomp.over(socket);

    if (this.environment.production) {
      this.stompClient.debug = null;
    }

    this.stompClient.connect({}, frame => {
      this.sendUserData(tinkCode);

      //this.resendDataAfterReconnect();
        this.successSocketCallback();
        // Send ping to prevent socket closing
        this.intervalSubscription = interval(PING_TIME).subscribe(() => {
          this.stompClient.send(
            API_URL_MAP.crawlerComunicationUrl,
            {},
            JSON.stringify({ message: "ping" })
          );
        });
    }, () => {})
  }

  private successSocketCallback() {
    this.tinkSuccess = true
    //this.router.navigate([`/${ROUTES_MAP.initConfirmation}`]);

    const repliesUrl = `${API_URL_MAP.crawlerRepliesUrl}`;
    this.stompClient.subscribe(repliesUrl, message => {
        const response = JSON.parse(message.body);
      if (message.body) {
        switch (response.eventType) {
         
          case BANKID_STATUS.LOANS_PERSISTED:

          case BANKID_STATUS.NO_LOANS: {
            this.router.navigate(['/dashboard/' + ROUTES_MAP.noLoan])
          }
            const user = response.data.user;
            this.authService
            .loginWithToken(user.oneTimeToken)
              .subscribe(res => {
                forkJoin([
                  this.loansService.getLoansAndRateType(),
                  this.userService.getUserInfo()
                ]).subscribe(([rateAndLoans, userInfo]) => {
                  this.userService.lowerRateAvailable.next(rateAndLoans.lowerRateAvailable);
                  if (rateAndLoans.loansPresent) {
                    this.localStorageService.removeItem('noLoansPresent');
                    if (rateAndLoans.isAggregatedRateTypeFixed) {
                      this.localStorageService.setItem('isAggregatedRateTypeFixed', true);
                      this.router.navigate(['/dashboard/' + ROUTES_MAP.fixedRate]);
                    } else {
                      if (userInfo.income === null) {
                        this.router.navigate(['/' + ROUTES_MAP.initConfirmation]);
                        this.localStorageService.setItem('isNewUser', true);
                      } else {
                        this.router.navigate(['/dashboard/' + ROUTES_MAP.offers]);
                      }
                    }
                  } else {
                    this.localStorageService.setItem('noLoansPresent', true);
                    this.router.navigate(['/dashboard/' + ROUTES_MAP.noLoan]);
                  }
                });
              });
            break;
        }
      }
    });

  }

  private connectAndReconnectSocket(successCallback) {
  
  }

  sendUserData(tinkCode: number, resendData = false) {
    const dataObj = {
    };
    //this.setDefaultSteps();
    const data = JSON.stringify(dataObj);

    this.stompClient.send(
      API_URL_MAP.tinkSendMessageUrl + tinkCode,
      {},
      data
    );
    if (!resendData) {
      //this.initTimer(IDENTIFICATION_TIMEOUT_TIME);
      //this.initConnectionTimer();
    }
  }
}