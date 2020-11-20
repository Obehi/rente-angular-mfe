import { AuthService } from "@services/remote-api/auth.service";
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter
} from "@angular/core";
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { environment } from "@environments/environment";
import { ViewStatus } from "./login-view-status";
import { API_URL_MAP } from "@config/api-url-config";
import {
  IDENTIFICATION_TIMEOUT_TIME,
  PING_TIME,
  RECONNECTION_TRIES,
  RECONNECTION_TIME,
  BANKID_STATUS,
  BANKID_TIMEOUT_TIME,
  MESSAGE_STATUS
} from "./login-status.config";
import { Subscription, interval, Observable, timer, forkJoin } from "rxjs";
import { take } from "rxjs/operators";
import { Router } from "@angular/router";
import { UserService } from "@services/remote-api/user.service";
import { LoansService } from "@services/remote-api/loans.service";
import { LocalStorageService } from "@services/local-storage.service";
import { BankVo, BankUtils } from "@shared/models/bank";
import { ROUTES_MAP } from '@config/routes-config';

@Component({
  selector: "rente-login-status",
  templateUrl: "./login-status.component.html",
  styleUrls: ["./login-status.component.scss"]
})
export class LoginStatusComponent implements OnInit, OnDestroy {
  @Input() bank: BankVo;
  @Input() userData: any = {};

  @Output() returnToInputPage = new EventEmitter<any>();

  public viewStatus: ViewStatus = new ViewStatus();
  public reconnectIterator = 0;
  public passPhrase = "";
  public ticks: number;
  public MESSAGE_STATUS = MESSAGE_STATUS;
  public loginStep1Status: string;
  public loginStep2Status: string;
  public loginStep3Status: string;
  public firstStepTimer = 10;
  public firstStepTimerFinished: boolean;
  public thirdStepTimer = 20;
  public thirdStepTimerFinished: boolean;
  public isShowPassPhrase: boolean;
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
  isNotSB1customer: boolean;
  isAccountSelection: boolean;
  accounts: string[];
  userSessionId: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private loansService: LoansService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.setDefaultSteps();
    this.initializeWebSocketConnection();
    window.scrollTo(0, 0);
  }

  ngOnDestroy() {
    this.unsubscribeEverything();
  }

  get bankLogo(): string {
    return this.bank
      ? BankUtils.getBankLogoUrl(this.bank.name)
      : "../../../assets/img/banks-logo/round/annen.png";
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
      this.router.navigate(["/autentisering/sparebank1-sub"]);
    }
  }

  sendUserData(resendData = false) {
    const dataObj = {
      birthdateOrSsn: this.userData.ssn || this.userData.birthdate,
      mobile: this.userData.phone
    };
    this.setDefaultSteps();
    const data = JSON.stringify(dataObj);
    this.passPhrase = "";

    this.stompClient.send(
      API_URL_MAP.crawlerSendMessageUrl + this.bank.name,
      {},
      data
    );
    if (!resendData) {
      this.initTimer(IDENTIFICATION_TIMEOUT_TIME);
      this.initConnectionTimer();
    }
  }

  private initializeWebSocketConnection() {
    this.connectAndReconnectSocket(this.successSocketCallback);
  }

  private resendDataAfterReconnect() {
    const notConnectionLost =
      !this.viewStatus.isSocketConnectionLost &&
      !this.viewStatus.isRecconectFail;
    const isUserDataEntered = this.userData.phone && this.userData.dob;
    if (
      this.reconnectIterator > 0 &&
      notConnectionLost &&
      isUserDataEntered &&
      !this.viewStatus.isLoansPersisted
    ) {
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
    this.stompClient.connect(
      {},
      frame => {
        this.viewStatus.isSocketConnectionLost = false;
        // Resend user data after reconnection
        this.sendUserData();
        this.resendDataAfterReconnect();
        this.successSocketCallback();
        // Send ping to prevent socket closing
        this.intervalSubscription = interval(PING_TIME).subscribe(() => {
          this.stompClient.send(
            API_URL_MAP.crawlerComunicationUrl,
            {},
            JSON.stringify({ message: "ping" })
          );
        });
      },
      () => {
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
      }
    );
  }

  private initTimer(timeoutTime: number) {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.ticks = timeoutTime;
    this.timer = timer(1000, 1000).pipe(take(timeoutTime + 1));
    this.timerSubscription = this.timer.subscribe(
      time => (this.ticks = this.ticks > 0 ? timeoutTime - time : 0)
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
    this.stompClient.subscribe(repliesUrl, message => {
      if (message.body) {
        const response = JSON.parse(message.body);
        console.log('STATUS:', response.eventType);
        switch (response.eventType) {

          case BANKID_STATUS.BANKID_UNSTABLE:
            this.viewStatus.isBankIdUnstable = true
            this.loginStep1Status = MESSAGE_STATUS.ERROR;
            this.unsubscribeEverything();
            break;


          case BANKID_STATUS.PROCESS_STARTED:
            this.initTimer(BANKID_TIMEOUT_TIME);
            this.initConnectionTimer();
            // this.loginStep1Status = MESSAGE_STATUS.SUCCESS;
            this.viewStatus.isProcessStarted = true;
            break;
          case BANKID_STATUS.PASSPHRASE_CONFIRM:
            this.isShowPassPhrase = true;
            this.isShowTimer = false;
            this.passPhrase = response.passphrase;
            this.loginStep1Status = MESSAGE_STATUS.SUCCESS;
            this.loginStep2Status = MESSAGE_STATUS.LOADING;
            break;
          case BANKID_STATUS.PASSPHRASE_CONFIRM_SUCCESS:
            this.startCrawlingTimer();
            this.isShowPassPhrase = false;
            this.viewStatus.isPassphraseConfirmSuccess = true;
            this.loginStep2Status = MESSAGE_STATUS.SUCCESS;
            this.loginStep3Status = MESSAGE_STATUS.LOADING;
            break;
          case BANKID_STATUS.BANKID_NO_ACCESS_FOR_SIGNIN:
            this.viewStatus.isCrawlerError = true;
            this.isShowPassPhrase = false;
            this.loginStep3Status = MESSAGE_STATUS.ERROR;
            this.unsubscribeEverything();
            break;
          case BANKID_STATUS.NOT_BANK_CUSTOMER:
            this.isShowPassPhrase = false;
            this.connectionTimerSubscription.unsubscribe();
            this.isNotSB1customer = true;
            this.viewStatus.isNotBankCustomer = true;
            this.viewStatus.isPassphraseConfirmSuccess = true;
            this.loginStep1Status = MESSAGE_STATUS.SUCCESS;
            this.loginStep2Status = MESSAGE_STATUS.SUCCESS;
            this.loginStep3Status = MESSAGE_STATUS.ERROR;
            break;
          case BANKID_STATUS.PASSPHRASE_CONFIRM_FAIL:
            this.isShowPassPhrase = false;
            this.viewStatus.isPassphraseConfirmFail = true;
            this.loginStep2Status = MESSAGE_STATUS.ERROR;
            this.unsubscribeEverything();
            break;
          case BANKID_STATUS.CONFIRMATION_REQUIRED:
          case BANKID_STATUS.CONFIRMATION_REQUIRED_DNB_PORTAL_AGREEMENT:
            this.isShowPassPhrase = false;
            this.viewStatus.isConfirmationRequired = true;
            this.loginStep3Status = MESSAGE_STATUS.ERROR;
            this.unsubscribeEverything();
            break;
          case BANKID_STATUS.CONFIRMATION_REQUIRED_DNB_RENEW_BANK_ID:
            this.isShowPassPhrase = false;
            this.viewStatus.isRenewBankIdRequired = true;
            this.loginStep3Status = MESSAGE_STATUS.ERROR;
            this.unsubscribeEverything();
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
          case BANKID_STATUS.EIKA_CHOOSE_ACCOUNT_TO_PROCESS:
            if (response.accounts && response.accounts.length > 0) {
              this.stopCrawlerTimer();
              this.userSessionId = response.sessionId;
              this.accounts = response.accounts;
              this.isAccountSelection = true;
            }
            break;
          case BANKID_STATUS.DIALOG_NO_RESPONSE_FROM_USER:
            this.isAccountSelection = false;
            this.loginStep3Status = MESSAGE_STATUS.ERROR;
            this.viewStatus.isSelectUserAccountTimeout = true;
            this.unsubscribeEverything();
            break;
          case BANKID_STATUS.BANK_WEBSITE_DOESNT_WORK:
            this.unsubscribeEverything();
            this.viewStatus.isBankError = true;
            if (this.loginStep1Status === MESSAGE_STATUS.LOADING) {
              this.loginStep1Status = MESSAGE_STATUS.ERROR;
            } else if (this.loginStep2Status === MESSAGE_STATUS.LOADING) {
              this.loginStep2Status = MESSAGE_STATUS.ERROR;
            } else if (this.loginStep3Status === MESSAGE_STATUS.LOADING) {
              this.loginStep3Status = MESSAGE_STATUS.ERROR;
            } else {
              this.loginStep1Status = MESSAGE_STATUS.INFO;
              this.loginStep2Status = MESSAGE_STATUS.INFO;
              this.loginStep3Status = MESSAGE_STATUS.ERROR;
            }
            break;
          case BANKID_STATUS.BID_C167:
            this.viewStatus.isErrorBIDC167 = true
            this.loginStep1Status = MESSAGE_STATUS.ERROR;
            this.unsubscribeEverything();
            break;
          case BANKID_STATUS.LOANS_PERSISTED:
            this.viewStatus.isLoansPersisted = true;
            const user = response.data.user;
            this.authService
              .loginWithToken(user.oneTimeToken)
              .subscribe(res => {
                forkJoin([
                  this.loansService.getLoansAndRateType(),
                  this.userService.getUserInfo()
                ]).subscribe(([rateAndLoans, userInfo]) => {
                  this.loginStep3Status = MESSAGE_STATUS.SUCCESS;
                  this.userService.lowerRateAvailable.next(rateAndLoans.lowerRateAvailable);
                  if (rateAndLoans.loansPresent) {
                    this.localStorageService.removeItem('noLoansPresent');
                    if (rateAndLoans.isAggregatedRateTypeFixed) {
                      this.localStorageService.setItem('isAggregatedRateTypeFixed', true);
                      this.router.navigate(['/dashboard/' + ROUTES_MAP.fixedRate]);
                    } else {
                      if (userInfo.income === null) {
                        this.router.navigate(['/bekreft']);
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

  startCrawlingTimer() {
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

  stopCrawlerTimer() {
    if (this.crawlingTimerSubscription) {
      this.crawlingTimerSubscription.unsubscribe();
      this.crawlingTimerSubscription = null;
    }
  }

  private setDefaultSteps() {
    this.isShowTimer = true;
    this.isAccountSelection = false;
    this.loginStep1Status = MESSAGE_STATUS.LOADING;
    this.loginStep2Status = MESSAGE_STATUS.INFO;
    this.loginStep3Status = MESSAGE_STATUS.INFO;
  }

  get isStep1InProgress(): boolean {
    return this.loginStep1Status === MESSAGE_STATUS.LOADING;
  }

  get isStep1Error(): boolean {
    return this.loginStep1Status === MESSAGE_STATUS.ERROR;
  }

  get isStep1Success(): boolean {
    return this.loginStep1Status === MESSAGE_STATUS.SUCCESS;
  }

  get isStep2InProgress(): boolean {
    return this.loginStep2Status === MESSAGE_STATUS.LOADING;
  }

  get isStep2Success(): boolean {
    return this.loginStep2Status === MESSAGE_STATUS.SUCCESS;
  }

  get isStep2Error(): boolean {
    return this.loginStep2Status === MESSAGE_STATUS.ERROR;
  }

  get isStep3Error(): boolean {
    return this.loginStep3Status === MESSAGE_STATUS.ERROR;
  }

  get isStep3InProgress(): boolean {
    return this.loginStep3Status === MESSAGE_STATUS.LOADING;
  }

  get timerExceeded(): boolean {
    return this.thirdStepTimer <= 0;
  }

  selectAccount(name: string) {
    const data = `{"eventType":"EIKA_CHOOSE_ACCOUNT_TO_PROCESS_RESPONSE", "sessionId":"${this.userSessionId}", "accountToProcess":"${name}"}`;
    this.stompClient.send(API_URL_MAP.crawlerAccountSelectEikaUrl, {}, data);
    this.isAccountSelection = false;
    this.startCrawlingTimer();
  }
}
