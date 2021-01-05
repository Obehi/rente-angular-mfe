import { AuthService } from "@services/remote-api/auth.service";
import { LoansService } from "@services/remote-api/loans.service";
import { UserService } from "@services/remote-api/user.service";
import { LocalStorageService } from "@services/local-storage.service";
import { MatDialog } from '@angular/material/dialog';
import { ChangeBrowserDialogInfoComponent } from '../landing/landing-top-sv/change-browser-dialog-info/dialog-info.component';
import { locale } from '../../config/locale/locale';

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
  selector: 'rente-bank-select-variation',
  templateUrl: './bank-select.component.html',
  styleUrls: ['./bank-select.component.scss']
})
export class BankSelectSvComponent implements OnInit, OnDestroy {
  
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
      private sanitizer: DomSanitizer, 
      private dialog: MatDialog
  
    ) { 
  
    }
  
    ngOnInit(): void {
      let tinkUrl = environment["tinkUrl"] || "https://link.tink.com/1.0/authorize/?client_id=3973e78ee8c140edbf36e53d50132ba1&redirect_uri=https%3A%2F%2Franteradar.se&scope=accounts:read,identity:read&market=SE&locale=sv_SE&iframe=true"

      if(history.state.data !== undefined && (history.state.data.iosPopup === true || history.state.data.androidPopup === true)) {
        let androidPopup = history.state.data.androidPopup 
        let app = history.state.data.app
        let type =  history.state.data.type
        console.log("1.")
        history.state.data = undefined;
        
          this.dialog.open(ChangeBrowserDialogInfoComponent, {
            panelClass: 'custom-modalbox',
            data: { type: type, androidPopup: androidPopup, app: app}
            });
      }
      console.log("2.")
      this.tinkUrl = this.sanitizer.bypassSecurityTrustResourceUrl(tinkUrl)
    }
  
    @HostListener('window:message', ['$event'])
    onMessage(event) {
      if (event.origin !== 'https://link.tink.com') {
      return;
      }
  
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
      this.tinkSuccess = true
      console.log("3.")
      const repliesUrl = `${API_URL_MAP.crawlerRepliesUrl}`;
      this.stompClient.subscribe(repliesUrl, message => {
          const response = JSON.parse(message.body);
        if (message.body) {
          switch (response.eventType) {
           
            case BANKID_STATUS.LOANS_PERSISTED:
              console.log("5.")
              const user = response.data.user;
              this.authService
              .loginWithToken(user.oneTimeToken)
                .subscribe(res => {
                  forkJoin([
                    this.loansService.getLoansAndRateType(),
                    this.userService.getUserInfo()
                  ]).subscribe(([rateAndLoans, userInfo]) => {
                    console.log("6.");
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
  
    sendUserData(loginId: number, resendData = false) {
      var country = ""
      if(locale.includes("nb")) {
        country = 'NOR'
      } else {
        country = 'SWE'
      }
  
      let data = {
        country: country,
        code: loginId
      }
    
      this.stompClient.send( 
        API_URL_MAP.tinkSendMessageUrl,
        {},
        JSON.stringify(data)
      );
    }
  }