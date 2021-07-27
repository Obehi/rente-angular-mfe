import { Injectable } from '@angular/core';
import { ViewStatus } from '../../features/auth/login-status/login-view-status';
import {
  BANKID_TIMEOUT_TIME,
  MESSAGE_STATUS
} from '../../features/auth/login-status/login-status.config';

import { Subscription, Observable, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '@services/remote-api/user.service';
import { LoansService } from '@services/remote-api/loans.service';
import { LoanStateDto } from '@shared/models/loans';
import { LocalStorageService } from '@services/local-storage.service';
import { BankVo } from '@shared/models/bank';
import { ROUTES_MAP } from '@config/routes-config';
import { LoggingService } from '@services/logging.service';
import { SafeUrl } from '@angular/platform-browser';

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
    private userService: UserService,
    private loansService: LoansService,
    private localStorageService: LocalStorageService,
    private logging: LoggingService
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
