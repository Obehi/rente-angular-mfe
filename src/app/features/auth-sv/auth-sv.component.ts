import { AuthService } from "@services/remote-api/auth.service";
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
    private sanitizer: DomSanitizer

  ) { 

  }

  ngOnInit(): void {
    let tinkUrl = environment["tinkUrl"] || "https://link.tink.com/1.0/authorize/?client_id=a84cfc4207574e08be2b561285e05998&redirect_uri=http%3A%2F%2Flocalhost%3A4302%2F&scope=accounts:read,investments:read,transactions:read,user:read&market=SE&locale=en_US&iframe=true&test=true"
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
      this.isLoginStarted = true;
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
    this.router.navigate([`/${ROUTES_MAP.initConfirmation}`]);

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