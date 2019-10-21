import { AuthService } from '@services/remote-api/auth.service';
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from '@environments/environment';
import { ViewStatus } from './login-view-status';
import { API_URL_MAP } from '@config/api-url-config';
import {
  IDENTIFICATION_TIMEOUT_TIME,
  PING_TIME,
  RECONNECTION_TRIES,
  RECONNECTION_TIME,
  BANKID_STATUS,
  BANKID_TIMEOUT_TIME,
  MESSAGE_STATUS
} from './login-status.config';
import { Subscription, interval, Observable, timer, forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '@services/remote-api/user.service';
import { LoansService } from '@services/remote-api/loans.service';
import { LocalStorageService } from '@services/local-storage.service';

@Component({
  selector: 'rente-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.scss']
})
export class LoginStatusComponent implements OnInit, OnDestroy {
  @Input() userData: any = {};
  @Input() userBank: any = {};
  public viewStatus: ViewStatus = new ViewStatus();
  public reconnectIterator = 0;
  public passPhrase = '';
  public ticks: number;
  public MESSAGE_STATUS = MESSAGE_STATUS;
  public loginStep1Status: string;
  public loginStep2Status: string;
  public loginStep3Status: string;
  public firstStepTimer = 10;
  public firstStepTimerFinished: boolean;
  public thirdStepTimer = 20;
  public thirdStepTimerFinished: boolean;
  public isShowpassPhrase: boolean;
  private maxConnectionTime = 90;
  private stompClient: any;
  private timerSubscription: Subscription;
  private timer: Observable<number>;
  private connectionTimer: Observable<number>;
  private crawlingTimer: Observable<number>;
  private connectionTimerSubscription: Subscription;
  private crawlingTimerSubscription: Subscription;
  private intervalSubscription: Subscription;
  public isShowTimer: boolean;
  @Output() returnToInputPage = new EventEmitter<any>();
  isNotSB1customer: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private loansService: LoansService,
    private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.setDefaultSteps();
    this.initializeWebSocketConnection();
  }

  ngOnDestroy() {
    this.unsubscribeEverything();
  }

  unsubscribeEverything() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect();
      this.stompClient.unsubscribe();
    }

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }

    if (this.connectionTimerSubscription) {
      this.connectionTimerSubscription.unsubscribe();
    }
    if (this.crawlingTimerSubscription) {
      this.crawlingTimerSubscription.unsubscribe();
    }
  }

  returnToInput() {
    this.returnToInputPage.emit();
    if (this.isNotSB1customer) {
      this.router.navigate(['/autentisering/sparebank1-sub']);
    }
  }

  sendUserData(resendData = false) {
    // this.userData = {
    //   birthdateOrSsn: 13018939554,
    //   mobile: 93253768
    // };

    const dataObj = {
      birthdateOrSsn: this.userData.ssn || this.userData.birthdate,
      mobile: this.userData.phone
    };

    // console.log(dataObj);

    this.setDefaultSteps();

    const data = JSON.stringify(dataObj);
    this.passPhrase = '';

    // TODO: Add bank name
    this.stompClient.send(API_URL_MAP.crawlerSendMessageUrl + this.userBank.bankName, {}, data);
    if (!resendData) {
      this.initTimer(IDENTIFICATION_TIMEOUT_TIME);
      this.initConnectionTimer();
    }
  }

  private initializeWebSocketConnection() {
    this.connectAndReconnectSocket(this.successSocketCallback);
  }

  private resendDataAfterReconnect() {
    const notConnectionLost = !this.viewStatus.isSocketConnectionLost && !this.viewStatus.isRecconectFail;
    const isUserDataEntered = this.userData.phone && this.userData.dob;
    if (this.reconnectIterator > 0 && notConnectionLost && isUserDataEntered && !this.viewStatus.isLoansPersisted) {
      this.sendUserData(true);
    }
  }

  private connectAndReconnectSocket(successCallback) {
    const socket = new SockJS(environment.crawlerUrl);
    this.stompClient = Stomp.over(socket);
    // Disable websocket logs for production
    if (environment.production) {
      this.stompClient.debug = null;
    }
    this.stompClient.connect({}, (frame) => {
      // console.log('success connection', frame);
      this.viewStatus.isSocketConnectionLost = false;
      // Resend user data after reconnection
      this.sendUserData();
      this.resendDataAfterReconnect();
      this.successSocketCallback();
      // Send ping to prevent socket closing
      this.intervalSubscription = interval(PING_TIME)
        .subscribe(() => {
          this.stompClient.send(API_URL_MAP.crawlerComunicationUrl, {}, JSON.stringify({ message: 'ping' }));
        });

    }, () => {
      this.viewStatus.isSocketConnectionLost = true;
      // this.setErrorMessage(this.errorMessages.RECONNECTION, messageTypes.info);
      if (this.reconnectIterator <= RECONNECTION_TRIES) {
        setTimeout(() => {
          this.reconnectIterator++;
          this.connectAndReconnectSocket(successCallback);
        }, RECONNECTION_TIME);
      } else {
        this.viewStatus.isRecconectFail = true;
        // this.setErrorMessage(this.errorMessages.RECONNECT_FAILED);
      }
    });
  }

  private initTimer(timeoutTime: number) {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.ticks = timeoutTime;
    this.timer = timer(1000, 1000).pipe(take(timeoutTime + 1));
    this.timerSubscription = this.timer.subscribe(
      time => this.ticks = this.ticks > 0 ? timeoutTime - time : 0
    );
  }

  private initConnectionTimer() {
    if (this.connectionTimerSubscription) {
      this.connectionTimerSubscription.unsubscribe();
    }
    this.connectionTimer = timer(1000, 1000);
    this.connectionTimerSubscription = this.connectionTimer.subscribe(time => {
      if (time > this.maxConnectionTime) {
        this.viewStatus.isTimedOut = true;
      }
      this.firstStepTimer--;
      if (!this.firstStepTimer) {
        this.firstStepTimerFinished = true;
      }
    });
  }

  private successSocketCallback() {
    const repliesUrl = `${API_URL_MAP.crawlerRepliesUrl}`;
    this.viewStatus.isSocketConnectionLost = false;
    this.stompClient.subscribe(repliesUrl, (message) => {
      if (message.body) {
        const response = JSON.parse(message.body);

        // console.log(response);

        switch (response.eventType) {
          case BANKID_STATUS.PROCESS_STARTED:
            this.initTimer(BANKID_TIMEOUT_TIME);
            this.initConnectionTimer();
            // this.loginStep1Status = MESSAGE_STATUS.SUCCESS;
            this.viewStatus.isProcessStarted = true;
            break;
          case BANKID_STATUS.PASSPHRASE_CONFIRM:
            this.isShowpassPhrase = true;
            this.isShowTimer = false;
            this.passPhrase = response.passphrase;
            this.loginStep1Status = MESSAGE_STATUS.SUCCESS;
            this.loginStep2Status = MESSAGE_STATUS.LOADING;
            break;
          case BANKID_STATUS.PASSPHRASE_CONFIRM_SUCCESS:
            this.initCrawlingTimer();
            this.isShowpassPhrase = false;
            this.viewStatus.isPassphraseConfirmSuccess = true;
            this.loginStep2Status = MESSAGE_STATUS.SUCCESS;
            this.loginStep3Status = MESSAGE_STATUS.LOADING;
            break;
          case BANKID_STATUS.NOT_SB1_CUSTOMER:
            this.isShowpassPhrase = false;
            this.connectionTimerSubscription.unsubscribe();
            this.isNotSB1customer = true;
            this.loginStep1Status = MESSAGE_STATUS.SUCCESS;
            this.loginStep2Status = MESSAGE_STATUS.SUCCESS;
            this.loginStep3Status = MESSAGE_STATUS.ERROR;
            break;
          case BANKID_STATUS.PASSPHRASE_CONFIRM_FAIL:
            this.isShowpassPhrase = false;
            this.viewStatus.isPassphraseConfirmFail = true;
            this.unsubscribeEverything();
            this.loginStep2Status = MESSAGE_STATUS.ERROR;
            break;
          case BANKID_STATUS.CONFIRMATION_REQUIRED:
            this.isShowpassPhrase = false;
            this.viewStatus.isPassphraseConfirmFail = true;
            this.viewStatus.isConfirmationRequired = true;
            this.unsubscribeEverything();
            this.loginStep2Status = MESSAGE_STATUS.ERROR;
            break;
          case BANKID_STATUS.CRAWLER_ERROR:
            this.viewStatus.isCrawlerError = true;
            this.unsubscribeEverything();
            this.loginStep1Status = MESSAGE_STATUS.SUCCESS;
            this.loginStep2Status = MESSAGE_STATUS.SUCCESS;
            this.loginStep3Status = MESSAGE_STATUS.ERROR;
            break;
          case BANKID_STATUS.CRAWLER_RESULT:
            this.viewStatus.isCrawlerResult = true;
            break;
          case BANKID_STATUS.NOT_VALID_DATA_PROVIDED:
            this.loginStep1Status = MESSAGE_STATUS.ERROR;
            this.viewStatus.isNotValidDataProvided = true;
            this.unsubscribeEverything();
            break;
          case BANKID_STATUS.LOANS_PERSISTED:
            this.viewStatus.isLoansPersisted = true;
            const user = response.data.user;

            this.authService.loginWithToken(user.phone, user.oneTimeToken).subscribe(res => {
              // console.log('login', res);

              // this.router.navigate(['/dashboard/tilbud/']);
              forkJoin([this.loansService.getLoansAndRateType(), this.userService.getUserInfo()])
                .subscribe(([rateAndLoans, userInfo]) => {
                  this.loginStep3Status = MESSAGE_STATUS.SUCCESS;
                  if (!rateAndLoans.loansPresent) {
                    this.localStorageService.setItem('noLoansPresent', true);
                    this.router.navigate(['/dashboard/ingenlaan']);
                  } else if (rateAndLoans.isAggregatedRateTypeFixed) {
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
                });
            });

            break;

          // case BANKID_STATUS.USER_PERSISTED:
          //     this.viewStatus.isLoansPersisted = true;
          //     this.loginStep3Status = MESSAGE_STATUS.SUCCESS;

          //     const userData = response.data.user;
          //     this.authService.loginWithToken(userData.phone, userData.oneTimeToken).subscribe(res => {
          //       console.log('login', res);
          //       localStorage.setItem('loans', JSON.stringify(response.data));
          //       this.router.navigate(['/dashboard/tilbud/']);
          //     });

          //     break;
        }
      }
    });
  }

  initCrawlingTimer() {
    if (this.crawlingTimerSubscription) {
      this.crawlingTimerSubscription.unsubscribe();
    }
    this.crawlingTimer = timer(1000, 1000);
    this.crawlingTimerSubscription = this.crawlingTimer.subscribe(time => {
      this.thirdStepTimer--;
      if (!this.thirdStepTimer) {
        this.thirdStepTimerFinished = true;
      }
    });
  }

  private setDefaultSteps() {
    this.isShowTimer = true;
    this.loginStep1Status = MESSAGE_STATUS.LOADING;
    this.loginStep2Status = MESSAGE_STATUS.INFO;
    this.loginStep3Status = MESSAGE_STATUS.INFO;
  }

}
