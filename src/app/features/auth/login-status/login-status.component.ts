import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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
import { Subscription, interval, Observable, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

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
  private stompClient: any;
  private timerSubscription: Subscription;
  private timer: Observable<number>;

  constructor(private router: Router) { }

  ngOnInit() {
    this.setDefaultSteps();
    this.initializeWebSocketConnection();
  }

  ngOnDestroy() {
    this.stompClient.unsubscribe();
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
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

    console.log(dataObj);

    this.setDefaultSteps();

    const data = JSON.stringify(dataObj);
    this.passPhrase = '';

    // TODO: Add bank name
    this.stompClient.send(API_URL_MAP.crawlerSendMessageUrl + this.userBank.label, {}, data);
    if (!resendData) {
      this.initTimer(IDENTIFICATION_TIMEOUT_TIME);
    }
  }

  private initializeWebSocketConnection() {
    this.connectAndReconnectSocket(this.successSocketCallback);
  }

  private resendDataAfterReconnect() {
    const notConnectionLost = !this.viewStatus.isSocketConnectionLost && !this.viewStatus.isRecconectFail;
    const isUserDataEntered = this.userData.phone && this.userData.dob;
    if (this.reconnectIterator > 0 && notConnectionLost && isUserDataEntered && !this.viewStatus.isOfferCreated) {
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
      console.log('success connection', frame);
      this.viewStatus.isSocketConnectionLost = false;
      // Resend user data after reconnection
      this.sendUserData();
      this.resendDataAfterReconnect();
      this.successSocketCallback();
      // Send ping to prevent socket closing
      interval(PING_TIME)
        .subscribe(() => {
          this.stompClient.send(API_URL_MAP.crawlerComunicationUrl , {}, JSON.stringify({message: 'ping'}));
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

  private successSocketCallback() {
    const repliesUrl = `${API_URL_MAP.crawlerRepliesUrl}`;
    this.viewStatus.isSocketConnectionLost = false;
    this.stompClient.subscribe(repliesUrl, (message) => {
      if (message.body) {
        const response = JSON.parse(message.body);

        console.log(response);

        switch (response.eventType) {
          case BANKID_STATUS.PROCESS_STARTED:
            this.initTimer(BANKID_TIMEOUT_TIME);
            this.loginStep1Status = MESSAGE_STATUS.SUCCESS;
            this.viewStatus.isProcessStarted = true;
            break;
          case BANKID_STATUS.PASSPHRASE_CONFIRM:
            this.passPhrase = response.passphrase;
            this.loginStep1Status = MESSAGE_STATUS.SUCCESS;
            this.loginStep2Status = MESSAGE_STATUS.LOADING;
            break;
          case BANKID_STATUS.PASSPHRASE_CONFIRM_SUCCESS:
            this.viewStatus.isPassphraseConfirmSuccess = true;
            this.loginStep2Status = MESSAGE_STATUS.SUCCESS;
            this.loginStep3Status = MESSAGE_STATUS.LOADING;
            break;
          case BANKID_STATUS.PASSPHRASE_CONFIRM_FAIL:
            this.viewStatus.isPassphraseConfirmFail = true;
            this.loginStep2Status = MESSAGE_STATUS.ERROR;
            break;
          case BANKID_STATUS.CRAWLER_ERROR:
            this.viewStatus.isCrawlerError = true;
            break;
          case BANKID_STATUS.CRAWLER_RESULT:
            this.viewStatus.isCrawlerResult = true;
            break;
          case BANKID_STATUS.LOANS_PERSISTED:
            this.viewStatus.isLoansPersisted = true;
            this.loginStep3Status = MESSAGE_STATUS.SUCCESS;

            localStorage.setItem('loans', JSON.stringify(response.data));

            this.router.navigate(['/dashboard/tilbud/']);
            break;
        }
      }
    });
  }

  private setDefaultSteps() {
    this.loginStep1Status = MESSAGE_STATUS.LOADING;
    this.loginStep2Status = MESSAGE_STATUS.INFO;
    this.loginStep3Status = MESSAGE_STATUS.INFO;
  }

  // private successSocketCallback() {
  //   const repliesUrl = `${this.config.crawlerRepliesUrl}`;
  //   this.viewStatus.isSocketConnectionLost = false;
  //   this.stompClient.subscribe(repliesUrl, (message) => {
  //     if (message.body) {
  //       const response = JSON.parse(message.body);

  //       switch (response.messageType.toString()) {
  //         // Passphrase
  //         case BANKID_STATUS.CONFIRM_PASSPHRASE:
  //           this.initTimer(BANKID_TIMEOUT_TIME);
  //           this.passPhrase = response.content;
  //           break;


  //         // Success bankID login
  //         case BANKID_STATUS.BANKID_APPROVED:
  //           this.viewStatus.isBankIdApproved = true;
  //           this.viewStatus.isSpinnerShown = false;
  //           this.viewStatus.isConfirmationStep = false;
  //           break;

  //         case BANKID_STATUS.DOCUMENTS_DOWNLOADED:
  //           this.viewStatus.isConfirmationStep = false;
  //           this.viewStatus.isSubmitingConfirmationStep = false;
  //           this.viewStatus.isSpinnerShown = false;
  //           this.viewStatus.isParsingFinished = true;
  //           break;

  //         case BANKID_STATUS.OFFER_DETAILS:
  //           this.viewStatus.isOfferCreated = true;
  //           this.viewStatus.isBankIdApproved = false;

  //           if (response.data.documents.length) {
  //             this.formDocumentsFromRes(this.offerDocumentsService.handleSpecificDocumentsData(response.data));
  //             this.offerDocuments.emit(this.documentsInfo);
  //             this.uploadUserInfo.emit(this.uploadInfo);
  //             this.stepsGoNext.emit(3);
  //           } else {
  //             this.setErrorView();
  //           }
  //           break;

  //         // ----------
  //         // Errors
  //         // ----------

  //         // The user is not a customer
  //         case BANKID_STATUS.USER_IS_NOT_COMPANY_CUSTOMER:
  //           this.setErrorView();
  //           this.setErrorMessage(this.errorMessages.USER_IS_NOT_COMPANY_CUSTOMER);
  //           break;

  //         // No Insurance documents were found
  //         case BANKID_STATUS.NO_ACTIVE_INSURANCES_FOUND:
  //           this.setErrorView();
  //           this.setErrorMessage(this.errorMessages.NO_ACTIVE_INSURANCES_FOUND);
  //           this.viewStatus.isNoActiveInsurances = true;
  //           break;

  //         // Phone, date of birth or both are not valid
  //         case BANKID_STATUS.PROVIDED_DATA_NOT_VALID:
  //           this.showInvalidDataView();
  //           this.setErrorMessage(this.errorMessages.PROVIDED_DATA_NOT_VALID);
  //           break;

  //         // Confirm info inputs are invalid
  //         case BANKID_STATUS.CONFIRM_INFO_INVALID:
  //           this.showInvalidDataView();
  //           this.viewStatus.isError = false;
  //           this.viewStatus.isConfirmationStep = false;
  //           this.setErrorMessage(this.errorMessages.PROVIDED_DATA_NOT_VALID);
  //           break;

  //         // No documents available for customer
  //         case BANKID_STATUS.NO_DOCUMENTS_AVAILABLE:
  //           this.setErrorView();
  //           this.viewStatus.isConfirmationStep = false;
  //           this.setErrorMessage(this.errorMessages.NO_DOCUMENTS_AVAILABLE);
  //           break;

  //         // BankId login was not approved by user
  //         case BANKID_STATUS.BANK_ID_WASNT_APPROVED:
  //           this.setErrorView();
  //           this.viewStatus.isCommonError = true;
  //           this.setErrorMessage(this.errorMessages.COMMON_ERROR);
  //           break;

  //         // Failed to connect to bankID
  //         case BANKID_STATUS.BANK_ID_FAILED_CONNECTION:
  //           this.setErrorView();
  //           this.setErrorMessage(this.errorMessages.BANK_ID_FAILED_CONNECTION, messageTypes.info);
  //           break;

  //         // User haven't upproved bankId login in time
  //         case BANKID_STATUS.BANKID_TIMEOUT:
  //           this.setErrorView();
  //           this.viewStatus.isConfirmationStep = false;
  //           this.setErrorMessage(this.errorMessages.BANKID_TIMEOUT);
  //           break;

  //         // Unknown error happened
  //         case BANKID_STATUS.ERROR_HAPPENED:
  //           this.showCommonError();
  //           break;

  //         // Problem with crowling
  //         case BANKID_STATUS.CROWLER_FRONTEND_PROBLEM:
  //           this.showCommonError();
  //           break;

  //         // Document parse error
  //         case BANKID_STATUS.CAN_NOT_PARSE_PROVIDED_DOCUMENTS:
  //           this.setErrorView();
  //           this.viewStatus.isConfirmationStep = false;
  //           this.setErrorMessage(this.errorMessages.CAN_NOT_PARSE_PROVIDED_DOCUMENTS);
  //           break;

  //         case BANKID_STATUS.NO_CRAWLERS_FOR_SESSION_EXIST:
  //           this.showCommonError();
  //           break;
  //       }
  //     }
  //   });

  // }

}



//   stompClient.connect({}, (frame) => {
//     console.log('success connection', frame);

//     stompClient.send('/app/crawler/start/' + bank, {}, JSON.stringify(data));

//     stompClient.subscribe('/user/topic/replies', (message) => {

//         console.log(message.body);

//         var json = JSON.parse(message.body);

//         switch (json.eventType) {
//             case 'PROCESS_STARTED':
//                 $("#progressbar").text("10%");
//                 $("#progressbar").prop("style", "width: 10%");
//                 break;
//             case 'PASSPHRASE_CONFIRM':
//                 $("#status1").html("<span>Din referanse: <b>" + json.passphrase + "</b></span>");
//                 $("#status2").html("Vennligst følg instruksjonen på mobilen<br>(Hele prosessen tar omtrent 40 sekunder)");
//                 $("#progressbar").text("30%");
//                 $("#progressbar").prop("style", "width: 30%");
//                 break;
//             case 'PASSPHRASE_CONFIRM_SUCCESS':
//                 $("#status1").html("Vi henter rente og låneinformasjon<br/>(Hele prosessen tar omtrent 40 sekunder)");
//                 $("#status2").text("");
//                 $("#progressbar").text("70%");
//                 $("#progressbar").prop("style", "width: 70%");
//                 break;
//             case 'PASSPHRASE_CONFIRM_FAIL':
//                 $("#main-content").hide();
//                 $("#error-section").show();
//                 $("#errorLink").text("Det oppstod en feil, det kan virke som du ikke bekreftet BankID på mobil. Vennligst prøv igjen");
//                 $("#errorLink").prop("href", "/");
//                 break;
//             case 'CRAWLER_ERROR':
//                 $("#main-content").hide();
//                 $("#error-section").show();
//                 $("#errorLink").text("Det oppstod en feil under henting av dine lånedetaljer, vennligst prøv igjen senere ");
//                 $("#errorLink").prop("href", "/");
//                 break;
//             case 'CRAWLER_RESULT':
//                 $("#status1").text("");
//                 $("#progressbar").text("80%");
//                 $("#progressbar").prop("style", "width: 80%");
//                 break;
//             case 'LOANS_PERSISTED':
//                 $("#status1").text("");
//                 $("#progressbar").text("100%");
//                 $("#progressbar").prop("style", "width: 100%");

//                 $(location).attr('href','/auth/authorize?phone=' + data.mobile);
//                 break;
//         }
//     });
// });

