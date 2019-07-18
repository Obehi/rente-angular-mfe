import { AuthService } from '@services/remote-api/auth.service';
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

  constructor(private router: Router, private authService: AuthService) { }

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

            const user = response.data.user;

            this.authService.loginWithToken(user.phone, user.oneTimeToken).subscribe(res => {
              console.log('login', res);
              localStorage.setItem('loans', JSON.stringify(response.data));
              this.router.navigate(['/dashboard/tilbud/']);
            });

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

}
