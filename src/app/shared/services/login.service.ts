import { Injectable } from '@angular/core';
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
import { ViewStatus } from '../../features/auth/login-status/login-view-status';
import { API_URL_MAP } from '@config/api-url-config';
import {
  IDENTIFICATION_TIMEOUT_TIME,
  PING_TIME,
  RECONNECTION_TRIES,
  RECONNECTION_TIME,
  BANKID_STATUS,
  BANKID_TIMEOUT_TIME,
  MESSAGE_STATUS
} from '../../features/auth/login-status/login-status.config';

import { Subscription, interval, Observable, timer, forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '@services/remote-api/user.service';
import { LoansService, LoanStateDto } from '@services/remote-api/loans.service';
import { LocalStorageService } from '@services/local-storage.service';
import { BankVo, BankUtils } from '@shared/models/bank';
import { ROUTES_MAP } from '@config/routes-config';
import { LoggingService } from '@services/logging.service';
import { EnvService } from '@services/env.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  bank: BankVo;
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

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private loansService: LoansService,
    private localStorageService: LocalStorageService,
    private logging: LoggingService,
    private envService: EnvService,
    private sanitizer: DomSanitizer
  ) {}

  public loginWithBankAndToken(): void {
    forkJoin([
      this.loansService.getLoansAndRateType(),
      this.userService.getUserInfo()
    ]).subscribe(([_rateAndLoans, _userInfo]) => {
      const rateAndLoans = _rateAndLoans as LoanStateDto;
      const userInfo = _userInfo as any;
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

      this.userService.lowerRateAvailable.next(rateAndLoans.lowerRateAvailable);
      if (rateAndLoans.loansPresent) {
        this.localStorageService.removeItem('noLoansPresent');
        if (rateAndLoans.isAggregatedRateTypeFixed) {
          this.localStorageService.setItem('isAggregatedRateTypeFixed', true);
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
          this.router.navigate(['/dashboard/' + ROUTES_MAP.fixedRate]);
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
  }
}
