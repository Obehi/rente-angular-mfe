import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  NgForm,
  FormControl
} from "@angular/forms";
import { ContactService } from "@services/remote-api/contact.service";
import { Router } from "@angular/router";
import { SnackBarService } from "@services/snackbar.service";
import { Mask } from '@shared/constants/mask'
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


import { ViewStatus } from "../auth/login-status/login-view-status";

import { take } from "rxjs/operators";
import { AuthService } from "@services/remote-api/auth.service";
import { UserService } from "@services/remote-api/user.service";
import { LoansService } from "@services/remote-api/loans.service";
import { LocalStorageService } from "@services/local-storage.service";
import { BankVo, BankUtils } from "@shared/models/bank";
import { ROUTES_MAP } from '@config/routes-config';



@Component({
  selector: 'rente-auth-sv-mockup',
  templateUrl: './auth-sv-mockup.component.html',
  styleUrls: ['./auth-sv-mockup.component.scss']
})
export class AuthSvMockupComponent implements OnInit, OnDestroy {

  public contactUsForm: FormGroup;
  public mask = Mask
  public isLoading: boolean;
  public loginIdError: boolean = false
  private stompClient: any;
  private intervalSubscription: Subscription;

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
  private timerSubscription: Subscription;
  private timer: Observable<number>;
  private connectionTimer: Observable<number>;
  private crawlingTimer: Observable<number>;
  private connectionTimerSubscription: Subscription;
  private crawlingTimerSubscription: Subscription;
  public isShowTimer: boolean;
  isNotSB1customer: boolean;
  isAccountSelection: boolean;
  accounts: string[];
  userSessionId: string;

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

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private snackBar: SnackBarService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private loansService: LoansService,
    private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit(): void {
    this.contactUsForm = this.fb.group({
      loginId: [
        ""
      ]
    });
  }

  public isErrorState(
    control: AbstractControl | null,
    form: FormGroup | NgForm | null
  ): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  public sendContactUsForm(formData) {
    this.isLoading = true;
    this.contactUsForm.markAllAsTouched();
    this.contactUsForm.updateValueAndValidity();
    this.contactService.sendContactForm(formData).subscribe(
      _ => {
        this.isLoading = false;
        this.router.navigate(["/"]);
        this.snackBar.openSuccessSnackBar("Din melding er sendt", 2);
      },
      err => {
        this.isLoading = false;
      }
    );
  }

  inValid() {
    return (
      this.contactUsForm.get('loginId').hasError('pattern') && 
      this.contactUsForm.get('loginId').dirty
    );
  } 
  onBlurErrorCheck() {
    this.loginIdError = this.inValid()
   }

  public request() {
    var data = this.contactUsForm.value.loginId
    this.initializeWebSocketConnection(data)
   
  }

  private initializeWebSocketConnection(loginId: number) {
    this.connectAndReconnectSocket(this.successSocketCallback);

    console.log("environment.crawlerUrl")
    console.log(environment.crawlerUrl)
    const socket = new SockJS(environment.crawlerUrl);
    this.stompClient = Stomp.over(socket);

    if (environment.production) {
      this.stompClient.debug = null;
    }

    this.stompClient.connect({}, frame => {
      console.log("send data")
      this.sendUserData(loginId);

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

  private successSocketCallback() {
    const repliesUrl = `${API_URL_MAP.crawlerRepliesUrl}`;
    this.viewStatus.isSocketConnectionLost = false;
    console.log("subscribing to: " + API_URL_MAP.crawlerRepliesUrl)
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

            console.log("user")
            console.log(user)
            this.authService
              .loginWithToken(user.ssn, user.oneTimeToken, "SWE")
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
  private connectAndReconnectSocket(successCallback) {
  
  }

  sendUserData(loginId: number, resendData = false) {
    const dataObj = {
    };
    //this.setDefaultSteps();
    const data = JSON.stringify(dataObj);

    console.log("loginId")
    console.log(loginId)
    this.stompClient.send( 
      API_URL_MAP.tinkSendMessageUrl + loginId,
      {},
      data
    );
    if (!resendData) {
      //this.initTimer(IDENTIFICATION_TIMEOUT_TIME);
      //this.initConnectionTimer();
    }
  }


}
