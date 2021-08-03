import { AuthService } from '@services/remote-api/auth.service';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
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
import { BankVo, BankUtils } from '@shared/models/bank';
import { ROUTES_MAP, ROUTES_MAP_NO } from '@config/routes-config';
import { LoggingService } from '@services/logging.service';
import { EnvService } from '@services/env.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CrawlerLoginService } from '@services/crawler-login.service';

@Component({
  selector: 'rente-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.scss']
})
export class LoginStatusComponent implements OnInit, OnDestroy {
  @Input() bank: BankVo;
  @Input() userData: any = {};
  @Input() isSb1App = false;
  @Output() returnToInputPage = new EventEmitter<any>();

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
  public isShowPassPhrase: boolean;
  private maxConnectionTime = 110;
  private stompClient: any;
  private timerSubscription: Subscription;
  private timer: Observable<number>;
  private connectionTimer: Observable<number>;
  private crawlingTimer: Observable<number>;
  private connectionTimerSubscription: Subscription;
  private crawlingTimerSubscription: Subscription | null;
  private intervalSubscription: Subscription;
  public isShowTimer: boolean;
  isNotSB1customer: boolean;
  isAccountSelection: boolean;
  accounts: string[];
  userSessionId: string;
  environment: any;
  public isTinkBank = false;
  public tinkUrl: SafeUrl;
  isSuccessTink = false;
  public tinkCode: any = null;
  BANKID_TIMEOUT_TIME;
  bankIdTimeoutTime = BANKID_TIMEOUT_TIME;

  get isSB1Bank(): boolean {
    return (
      (this.bank &&
        this.bank.name &&
        this.bank.name.indexOf('SPAREBANK_1') > -1) ||
      false
    );
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private loansService: LoansService,
    private localStorageService: LocalStorageService,
    private logging: LoggingService,
    private envService: EnvService,
    private sanitizer: DomSanitizer,
    private crawlerLoginService: CrawlerLoginService
  ) {}

  ngOnInit(): void {
    this.logging.logger(
      this.logging.Level.Info,
      '1:INIT',
      'LoginStatusComponent',
      'ngOnInit',
      this.logging.SubSystem.Tink,
      '1: INIT COMPONENT',
      { bank: this.bank.name },
      this.isTinkBank
    );
    this.environment = this.envService.environment;
    this.setDefaultSteps();

    window.scrollTo(0, 0);
    // Special case for DNB and Eika banks
    this.thirdStepTimer =
      this.bank.name === 'DNB' || BankUtils.isEikaBank(this.bank.name)
        ? 34
        : 25;
    this.firstStepTimer = this.bank.name === 'DNB' ? 38 : 10;

    if (this.isSB1Bank) {
      this.firstStepTimer = 40;
      this.bankIdTimeoutTime = 120;
    }
    if (this.bank.name === 'DNB') {
      this.bankIdTimeoutTime = 120;
    }
    if (this.bank.isTinkBank) {
      this.initiateTinkBank();
    } else {
      this.initializeWebSocketConnection();
    }
  }

  initiateTinkBank(): void {
    const tinkUrlUnsanitized = this.envService.getTinkLinkForBank(
      this.bank.name
    );

    this.tinkUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      tinkUrlUnsanitized
    );
    this.isTinkBank = true;
  }

  @HostListener('window:message', ['$event'])
  onMessage(event): void {
    if (event.origin !== 'https://link.tink.com') {
      return;
    }

    const data = JSON.parse(event.data);
    this.logging.logger(
      this.logging.Level.Info,
      '2:TINK_EVENT_RECIEVED',
      'LoginStatusComponent',
      'onMessage',
      this.logging.SubSystem.Tink,
      '2:TINK_EVENT_RECIEVED',
      data,
      this.isTinkBank
    );

    if (data.type === 'code') {
      // This is the authorization code that should be exchanged for an access token
      this.tinkCode = data.data;

      this.logging.logger(
        this.logging.Level.Info,
        '2.1:TINK_LOGIN_SUCCESS',
        'LoginStatusComponent',
        'onMessage',
        this.logging.SubSystem.Tink,
        '2: TINK LOGIN SUCCESS: ' + data.data,
        undefined,
        this.isTinkBank
      );
      this.initializeWebSocketConnection(data.data);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeEverything();
  }

  get bankLogo(): string {
    return this.bank
      ? BankUtils.getBankLogoUrl(this.bank.name)
      : '../../../assets/img/banks-logo/round/annen.png';
  }

  unsubscribeEverything(): void {
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

  returnToInput(): void {
    this.returnToInputPage.emit();
    if (this.isNotSB1customer) {
      this.router.navigate(['/autentisering/sparebank1-sub']);
    }
  }

  sendUserDataTink(tinkCode: any, resendData = false): void {
    const dataObj = {
      code: tinkCode,
      country: 'NOR'
    };
    // this.setDefaultSteps();
    const data = JSON.stringify(dataObj);

    this.stompClient.send(
      API_URL_MAP.tinkSendMessageUrl,
      {
        code: tinkCode,
        country: 'NOR'
      },
      data
    );
    this.logging.logger(
      this.logging.Level.Info,
      '3.7:SEND_MESSAGE_TO_SOCKET_WITH_TINK_CODE',
      'BankSelectSvComponent',
      'sendUserData',
      this.logging.SubSystem.Tink,
      '3.7: CONNECT TO SOCKET WITH TINK CODE',
      {
        tinkCode: tinkCode,
        object: dataObj,
        crawlerEndpoint: API_URL_MAP.tinkSendMessageUrl
      },
      this.isTinkBank
    );
  }

  sendUserData(resendData = false): void {
    const dataObj = {
      birthdateOrSsn: this.userData.ssn || this.userData.birthdate
    };

    if (this.userData.phone) {
      dataObj['mobile'] = this.userData.phone;
    }

    if (this.userData.loginType) {
      dataObj['loginType'] = '1';
    }

    this.setDefaultSteps();
    const data = JSON.stringify(dataObj);
    this.passPhrase = '';

    this.stompClient.send(
      API_URL_MAP.crawlerSendMessageUrl + this.bank.name,
      {},
      data
    );
    this.logging.logger(
      this.logging.Level.Info,
      '3.7:SEND_MESSAGE_TO_SOCKET_WITH_BANK_NAME',
      'LoginStatusComponent',
      'sendUserData',
      this.logging.SubSystem.Tink,
      '3.7: CONNECT TO SOCKET WITH BANK NAME AND INFO_JSON',
      undefined,
      this.isTinkBank
    );

    if (!resendData) {
      this.initTimer(IDENTIFICATION_TIMEOUT_TIME);
      this.initConnectionTimer();
    }
  }

  private initializeWebSocketConnection(tinkCode?: any) {
    this.connectAndReconnectSocket(this.successSocketCallback, tinkCode);
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
      this.logging.logger(
        this.logging.Level.Info,
        '3.8: RESEND_MESSAGE_TO_SOCKET_WITH_BANK_NAME',
        'LoginStatusComponent',
        'resendDataAfterReconnect',
        this.logging.SubSystem.Tink,
        '3.7: CONNECT TO SOCKET WITH BANK NAME AND INFO_JSON',
        undefined,
        this.isTinkBank
      );

      this.sendUserData(true);
    }
  }

  private connectAndReconnectSocket(successCallback, tinkCode?: any) {
    const socket = new SockJS(this.environment.crawlerUrl);

    this.stompClient = Stomp.over(socket);
    this.logging.logger(
      this.logging.Level.Info,
      '3.5:INIT_SOCKET',
      'LoginStatusComponent',
      'connectAndReconnectSocket',
      this.logging.SubSystem.Tink,
      '3.5: CONNECTING TO SOCKET',
      undefined,
      this.isTinkBank
    );

    // Disable websocket logs for production
    if (this.environment.production) {
      this.stompClient.debug = null;
    }
    this.stompClient.connect(
      {},
      () => {
        this.viewStatus.isSocketConnectionLost = false;
        // Resend user data after reconnection
        this.logging.logger(
          this.logging.Level.Info,
          '3.6:CONNECTED_TO_SOCKET',
          'LoginStatusComponent',
          'connectAndReconnectSocket',
          this.logging.SubSystem.Tink,
          '3.6: CONNECTED TO SOCKET',
          { tinkCode: this.tinkCode },
          this.isTinkBank
        );

        this.tinkCode ? this.sendUserDataTink(tinkCode) : this.sendUserData();

        this.resendDataAfterReconnect();
        this.successSocketCallback();
        // Send ping to prevent socket closing
        this.intervalSubscription = interval(PING_TIME).subscribe(() => {
          this.stompClient.send(
            API_URL_MAP.crawlerComunicationUrl,
            {},
            JSON.stringify({ message: 'ping' })
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
      (time) => (this.ticks = this.ticks > 0 ? timeoutTime - time : 0)
    );
  }

  private initConnectionTimer() {
    if (this.connectionTimerSubscription) {
      this.connectionTimerSubscription.unsubscribe();
    }
    this.connectionTimer = timer(1000, 1000);
    this.connectionTimerSubscription = this.connectionTimer.subscribe(
      (time) => {
        if (time > this.maxConnectionTime) {
          if (this.viewStatus.isTimedOut === false) {
            this.logging.logger(
              this.logging.Level.Error,
              'CONNECTION_TIMEOUT:' + ' ' + this.maxConnectionTime + ' SECONDS',
              'LoginStatusComponent',
              'initConnectionTimer',
              this.logging.SubSystem.Tink,
              'CONNECTION TIMEOUT',
              { bank: this.bank.name },
              this.isTinkBank
            );
          }
          this.viewStatus.isTimedOut = true;
        }
        this.firstStepTimer--;
        if (!this.firstStepTimer) {
          if (this.firstStepTimerFinished === false) {
            this.logging.logger(
              this.logging.Level.Error,
              'FIRST_STEP_TIMER_FINISHED',
              'LoginStatusComponent',
              'initConnectionTimer',
              this.logging.SubSystem.Tink,
              'FIRST STEP TIMER FINISHED',
              undefined,
              this.isTinkBank
            );
          }

          this.firstStepTimerFinished = true;
        }
      }
    );
  }

  private successSocketCallback() {
    const repliesUrl = `${API_URL_MAP.crawlerRepliesUrl}`;
    this.viewStatus.isSocketConnectionLost = false;
    this.stompClient.subscribe(repliesUrl, (message) => {
      const response = JSON.parse(message.body);
      const filteredResponse = {
        eventType: response['eventType'],
        bank: response['bank'],
        backendOneTimeToken: response['oneTimeToken'],
        backendclientId: response['clientId']
      };
      this.logging.logger(
        this.logging.Level.Info,
        '4:RESPONSE_FROM_SOCKET',
        'LoginStatusComponent',
        'successSocketCallback',
        this.logging.SubSystem.Tink,
        '4: RESPONSE FROM SOCKET',
        filteredResponse,
        this.isTinkBank
      );

      if (message.body) {
        switch (response.eventType) {
          case BANKID_STATUS.BANKID_UNSTABLE:
            this.viewStatus.isBankIdUnstable = true;
            this.loginStep1Status = MESSAGE_STATUS.ERROR;
            this.unsubscribeEverything();
            break;

          case BANKID_STATUS.ERROR_3:
            this.unsubscribeEverything();
            this.crawlerLoginService.postError();
            break;

          case BANKID_STATUS.ERROR_4:
            this.unsubscribeEverything();
            this.crawlerLoginService.postError();
            break;

          case BANKID_STATUS.PROCESS_STARTED:
            this.initTimer(this.bankIdTimeoutTime);
            this.initConnectionTimer();
            this.logging.logger(
              this.logging.Level.Info,
              '5.1:STATUS: BANKID_STATUS.PROCESS_STARTED',
              'LoginStatusComponent',
              'successSocketCallback',
              this.logging.SubSystem.Tink,
              '5: BANKID_STATUS: PROCESS_STARTED',
              undefined,
              this.isTinkBank
            );

            // this.loginStep1Status = MESSAGE_STATUS.SUCCESS;
            this.viewStatus.isProcessStarted = true;
            break;
          case BANKID_STATUS.PASSPHRASE_CONFIRM:
            this.viewStatus.passPhraseConfirmIsSet = true;
            this.isShowPassPhrase = true;
            this.isShowTimer = false;
            this.passPhrase = response.passphrase;
            this.loginStep1Status = MESSAGE_STATUS.SUCCESS;
            this.loginStep2Status = MESSAGE_STATUS.LOADING;
            break;

          case BANKID_STATUS.BANK_ID_CONFIRM:
            this.isShowPassPhrase = true;
            this.isShowTimer = false;
            this.passPhrase = response.passphrase;
            this.loginStep1Status = MESSAGE_STATUS.SUCCESS;
            this.loginStep2Status = MESSAGE_STATUS.LOADING;
            break;
          case BANKID_STATUS.APP_CONFIRM:
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
          case BANKID_STATUS.APP_CONFIRM_SUCCESS:
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
          case BANKID_STATUS.APP_CONFIRM_FAIL:
            this.isShowPassPhrase = false;
            this.viewStatus.isSb1appConfirmFailError = true;
            this.loginStep2Status = MESSAGE_STATUS.ERROR;
            this.unsubscribeEverything();
            break;
          case BANKID_STATUS.NOT_VALID_DATA_PROVIDED_V2:
            this.viewStatus.isSb1NotValidDataProvidedV2Error = true;
            this.loginStep1Status = MESSAGE_STATUS.ERROR;
            this.loginStep2Status = MESSAGE_STATUS.INFO;

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
            filteredResponse['bank'] = this.bank.name;
            this.logging.logger(
              this.logging.Level.Error,
              '5:STATUS: BANKID_STATUS.CRAWLER_ERROR',
              'LoginStatusComponent',
              'successSocketCallback',
              this.logging.SubSystem.Tink,
              'BANKID_STATUS: CRAWLER_ERROR',
              filteredResponse,
              this.isTinkBank
            );
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
            this.viewStatus.isErrorBIDC167 = true;
            this.loginStep1Status = MESSAGE_STATUS.ERROR;
            this.unsubscribeEverything();
            break;
          case BANKID_STATUS.BID_C325:
            this.viewStatus.isErrorBIDC325 = true;
            if (this.viewStatus.passPhraseConfirmIsSet) {
              this.loginStep2Status = MESSAGE_STATUS.ERROR;
            } else {
              this.loginStep1Status = MESSAGE_STATUS.ERROR;
            }

            this.unsubscribeEverything();
            break;
          case BANKID_STATUS.NO_LOANS:
            this.logging.logger(
              this.logging.Level.Info,
              '5.1.5:STATUS: BANKID_STATUS.NO_LOANS',
              'LoginStatusComponent',
              'successSocketCallback',
              this.logging.SubSystem.Tink,
              '5: BANKID_STATUS: NO_LOANS',
              undefined,
              this.isTinkBank
            );
            this.router.navigate(['/' + ROUTES_MAP.noLoan]);
            break;
          case BANKID_STATUS.LOANS_PERSISTED:
            this.logging.logger(
              this.logging.Level.Info,
              '5.2:STATUS: BANKID_STATUS.LOANS_PERSISTED',
              'LoginStatusComponent',
              'successSocketCallback',
              this.logging.SubSystem.Tink,
              '5: BANKID_STATUS: LOANS_PERSISTED',
              undefined,
              this.isTinkBank
            );

            this.viewStatus.isLoansPersisted = true;
            const user = response.data.user;
            this.authService.loginWithToken(user.oneTimeToken).subscribe(() => {
              forkJoin([
                this.loansService.getLoansAndRateType(),
                this.userService.getUserInfo()
              ]).subscribe(([rateAndLoans, userInfo]) => {
                this.loginStep3Status = MESSAGE_STATUS.SUCCESS;
                this.logging.logger(
                  this.logging.Level.Info,
                  '6:FETCHED_RATE_LOANS_AND_USERINFO',
                  'LoginStatusComponent',
                  'successSocketCallback',
                  this.logging.SubSystem.Tink,
                  '6: FETCHED RATE, LOANS AND USERINFO',
                  undefined,
                  this.isTinkBank
                );

                this.userService.lowerRateAvailable.next(
                  rateAndLoans.lowerRateAvailable
                );
                if (rateAndLoans.loansPresent) {
                  this.localStorageService.removeItem('noLoansPresent');
                  if (rateAndLoans.isAggregatedRateTypeFixed) {
                    this.localStorageService.setItem(
                      'isAggregatedRateTypeFixed',
                      true
                    );
                    this.logging.logger(
                      this.logging.Level.Info,
                      '7:SUCCESS_RATE_TYPE_FIXED',
                      'LoginStatusComponent',
                      'successSocketCallback',
                      this.logging.SubSystem.Tink,
                      '7: SUCCESS: FIXED RATE DETECTED. REDIRECT TO ROUTES_MAP.FIXEDRATE',
                      undefined,
                      this.isTinkBank
                    );
                    this.router.navigate([
                      '/dashboard/' + ROUTES_MAP.fixedRate
                    ]);
                  } else {
                    if (userInfo.income === null) {
                      this.logging.logger(
                        this.logging.Level.Info,
                        '7:SUCCESS_NEW_USER',
                        'LoginStatusComponent',
                        'successSocketCallback',
                        this.logging.SubSystem.Tink,
                        '7: SUCCESS:NEW USER DETECTED. REDIRECT TO ROUTES_MAP.INITCONFIRMATION',
                        undefined,
                        this.isTinkBank
                      );
                      this.router.navigate(['/' + ROUTES_MAP.initConfirmation]);
                      this.localStorageService.setItem('isNewUser', true);
                    } else {
                      this.logging.logger(
                        this.logging.Level.Info,
                        '7:SUCCESS_OLD_USER',
                        'LoginStatusComponent',
                        'successSocketCallback',
                        this.logging.SubSystem.Tink,
                        '7: SUCCESS: USER INCOME DETECTED. REDIRECT TO ROUTES_MAP.OFFERS',
                        undefined,
                        this.isTinkBank
                      );

                      this.router.navigate([
                        '/dashboard/' + ROUTES_MAP.offers,
                        { state: { isInterestRateSet: true } }
                      ]);
                    }
                  }
                } else {
                  this.logging.logger(
                    this.logging.Level.Info,
                    '7:SUCCESS_NO_LOAN_PRESENT',
                    'LoginStatusComponent',
                    'successSocketCallback',
                    this.logging.SubSystem.Tink,
                    '7: SUCCESS: NO LOAN DETECTED. REDIRECT TO ROUTES_MAP.NOLOAN',
                    undefined,
                    this.isTinkBank
                  );
                  this.localStorageService.setItem('noLoansPresent', true);
                  this.router.navigate(['/' + ROUTES_MAP.noLoan]);
                }
              });
            });
            break;
        }
      }
    });
  }

  startCrawlingTimer(): void {
    if (this.crawlingTimerSubscription) {
      this.crawlingTimerSubscription.unsubscribe();
    }
    this.crawlingTimer = timer(1000, 1000);
    this.crawlingTimerSubscription = this.crawlingTimer.subscribe(() => {
      this.thirdStepTimer--;
      if (!this.thirdStepTimer) {
        if (this.thirdStepTimerFinished === false) {
          this.logging.logger(
            this.logging.Level.Error,
            'THIRD_STEP_TIMER_FINISHED',
            'LoginStatusComponent',
            'startCrawlingTimer',
            this.logging.SubSystem.Tink,
            'THIRD STEP TIMER FINISHED'
          );
        }
        this.thirdStepTimerFinished = true;
      }
    });
  }

  stopCrawlerTimer(): void {
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

  selectAccount(name: string): void {
    const data = `{"eventType":"EIKA_CHOOSE_ACCOUNT_TO_PROCESS_RESPONSE", "sessionId":"${this.userSessionId}", "accountToProcess":"${name}"}`;
    this.stompClient.send(API_URL_MAP.crawlerAccountSelectEikaUrl, {}, data);
    this.isAccountSelection = false;
    this.startCrawlingTimer();
  }
}
