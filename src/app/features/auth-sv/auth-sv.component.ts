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

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private loansService: LoansService,
    private localStorageService: LocalStorageService,
    private sanitizer: DomSanitizer

  ) { 

  }

  ngOnInit(): void {
    let tinkUrl = environment["tinkUrl"] || "https://link.tink.com/1.0/authorize/?client_id=2a14f1970f0b4b39a861a1c42b65daca&redirect_uri=http%3A%2F%2Flocalhost%3A4302%2F&scope=accounts:read,user:read,identity:read&market=SE&locale=en_US&iframe=true&test=true"
    this.tinkUrl = this.sanitizer.bypassSecurityTrustResourceUrl(tinkUrl)
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
      console.log(`Tink Link returned with authorization code: ${data.type }`);
      this.initializeWebSocketConnection(data.data)
    }
  }

  ngOnDestroy() {
  }

  private initializeWebSocketConnection(tinkCode: number) {
    this.connectAndReconnectSocket(this.successSocketCallback);
    
    const socket = new SockJS(environment.crawlerUrl);
    this.stompClient = Stomp.over(socket);

    if (environment.production) {
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
    console.log("this is the shit")
    this.tinkSuccess = true
    //this.router.navigate([`/${ROUTES_MAP.initConfirmation}`]);

    const repliesUrl = `${API_URL_MAP.crawlerRepliesUrl}`;
    console.log(API_URL_MAP.crawlerRepliesUrl)
    this.stompClient.subscribe(repliesUrl, message => {
      console.log(message)
      if (message.body) {
        const response = JSON.parse(message.body);
        console.log('STATUS:', response.eventType);
        switch (response.eventType) {

          case BANKID_STATUS.LOANS_PERSISTED:
            const user = response.data.user;
            this.authService
              .loginWithToken(user.phone, user.oneTimeToken)
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
                      this.router.navigate(['/dashboard/fastrente']);
                    } else {
                      if (userInfo.income === null) {
                        this.router.navigate(['/bekreft']);
                        this.localStorageService.setItem('isNewUser', true);
                      } else {
                        this.router.navigate(['/dashboard/tilbud/']);
                      }
                    }
                  } else {
                    this.localStorageService.setItem('noLoansPresent', true);
                    this.router.navigate(['/dashboard/ingenlaan']);
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