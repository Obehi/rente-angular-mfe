import { Component, OnInit } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from '@environments/environment';

@Component({
  selector: 'rente-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.scss']
})
export class LoginStatusComponent implements OnInit {
  private stompClient;

  constructor() { }

  ngOnInit() {}

  // ngOnInit() {
  //   this.initializeWebSocketConnection();
  // }

  // private initializeWebSocketConnection() {
  //   this.connectAndReconnectSocket(this.successSocketCallback);
  // }

  // private resendDataAfterReconnect() {
  //   const notConnectionLost = !this.viewStatuses.isSocketConnectionLost && !this.viewStatuses.isRecconectFail;
  //   const isUserDataEntered = this.userData.phone && this.userData.dob;
  //   if (this.reconnectIterator > 0 && notConnectionLost && isUserDataEntered && !this.viewStatuses.isOfferCreated) {
  //     this.sendUserData(true);
  //   }
  // }

  // private connectAndReconnectSocket(successCallback) {
  //   const socket = new SockJS(environment.crawlerUrl);
  //   this.stompClient = Stomp.over(socket);
  //   // Disable websocket logs for production
  //   if (environment.production) {
  //     this.stompClient.debug = null;
  //   }
  //   this.stompClient.connect({}, (frame) => {
  //     this.viewStatuses.isSocketConnectionLost = false;
  //     // Resend user data after reconnection
  //     this.resendDataAfterReconnect();
  //     this.successSocketCallback();
  //     // Send ping to prevent socket closing
  //     interval(PING_TIME)
  //       .subscribe(() => {
  //         this.stompClient.send(this.config.crawlerComunicationUrl , {}, JSON.stringify({message: 'ping'}));
  //       });

  //   }, () => {
  //     this.viewStatuses.isSocketConnectionLost = true;
  //     this.setErrorMessage(this.errorMessages.RECONNECTION, messageTypes.info);
  //     if (this.reconnectIterator <= RECONNECTION_TRIES) {
  //       setTimeout(() => {
  //         this.reconnectIterator++;
  //         this.connectAndReconnectSocket(successCallback);
  //       }, RECONNECTION_TIME);
  //     } else {
  //       this.viewStatuses.isRecconectFail = true;
  //       this.setErrorMessage(this.errorMessages.RECONNECT_FAILED);
  //     }
  //   });
  // }

  // private successSocketCallback() {
  //   const repliesUrl = `${this.config.crawlerRepliesUrl}`;
  //   this.viewStatuses.isSocketConnectionLost = false;
  //   this.stompClient.subscribe(repliesUrl, (message) => {
  //     if (message.body) {
  //       const response = JSON.parse(message.body);

  //       switch (response.messageType.toString()) {
  //         // Passphrase
  //         case BANKID_STATUS.CONFIRM_PASSPHRASE:
  //           this.initTimer(BANKID_TIMEOUT_TIME);
  //           this.passPhrase = response.content;
  //           break;

  //         // TRYG confirmation step
  //         case BANKID_STATUS.TRYG_CONFIRM_INFO:
  //           this.showConfirmationStep();
  //           if (response.data) {
  //             this.trygUserData = JSON.parse(response.data);
  //           }
  //           break;

  //         // GJENSIDIGE confirmation step
  //         case BANKID_STATUS.GJENSIDIGE_CONFIRM_INFO:
  //           this.showConfirmationStep();
  //           if (response.data) {
  //             this.gjensidigeUserData = JSON.parse(response.data);
  //           }
  //           break;

  //         // FRENDE confirmation step (confirm data use)
  //         case BANKID_STATUS.FRENDE_CONFIRM_INFO:
  //           this.showConfirmationStep();
  //           if (response.data) {
  //             this.frendeUserData = JSON.parse(response.data);
  //           }
  //           break;

  //         // FRENDE configuration step (set feed email)
  //         case BANKID_STATUS.FRENDE_FEED_CONFIRM_INFO:
  //           this.showConfirmationStep();
  //           if (response.data) {
  //             this.frendeUserData = null;
  //             this.frendeFeedUserData = JSON.parse(response.data);
  //           }
  //           break;

  //         // IF confirmation step
  //         case BANKID_STATUS.IF_CONFIRM_INFO:
  //           this.showConfirmationStep();
  //           if (response.data) {
  //             this.ifUserData = JSON.parse(response.data);
  //           }
  //           break;

  //         // Success bankID login
  //         case BANKID_STATUS.BANKID_APPROVED:
  //           this.viewStatuses.isBankIdApproved = true;
  //           this.viewStatuses.isSpinnerShown = false;
  //           this.viewStatuses.isConfirmationStep = false;
  //           break;

  //         case BANKID_STATUS.DOCUMENTS_DOWNLOADED:
  //           this.viewStatuses.isConfirmationStep = false;
  //           this.viewStatuses.isSubmitingConfirmationStep = false;
  //           this.viewStatuses.isSpinnerShown = false;
  //           this.viewStatuses.isParsingFinished = true;
  //           break;

  //         case BANKID_STATUS.OFFER_DETAILS:
  //           this.viewStatuses.isOfferCreated = true;
  //           this.viewStatuses.isBankIdApproved = false;

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
  //           this.viewStatuses.isNoActiveInsurances = true;
  //           break;

  //         // Phone, date of birth or both are not valid
  //         case BANKID_STATUS.PROVIDED_DATA_NOT_VALID:
  //           this.showInvalidDataView();
  //           this.setErrorMessage(this.errorMessages.PROVIDED_DATA_NOT_VALID);
  //           break;

  //         // Confirm info inputs are invalid
  //         case BANKID_STATUS.CONFIRM_INFO_INVALID:
  //           this.showInvalidDataView();
  //           this.viewStatuses.isError = false;
  //           this.viewStatuses.isConfirmationStep = false;
  //           this.setErrorMessage(this.errorMessages.PROVIDED_DATA_NOT_VALID);
  //           break;

  //         // No documents available for customer
  //         case BANKID_STATUS.NO_DOCUMENTS_AVAILABLE:
  //           this.setErrorView();
  //           this.viewStatuses.isConfirmationStep = false;
  //           this.setErrorMessage(this.errorMessages.NO_DOCUMENTS_AVAILABLE);
  //           break;

  //         // BankId login was not approved by user
  //         case BANKID_STATUS.BANK_ID_WASNT_APPROVED:
  //           this.setErrorView();
  //           this.viewStatuses.isCommonError = true;
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
  //           this.viewStatuses.isConfirmationStep = false;
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
  //           this.viewStatuses.isConfirmationStep = false;
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

