import { LoansService } from '@services/remote-api/loans.service';
import { Offers } from './../../../../shared/models/offers';
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Loans } from '@shared/models/loans';
import { BANKS_DATA } from '@config/banks-config';
import { Router } from '@angular/router';
import {
  OFFER_SAVINGS_TYPE,
  AGGREGATED_RATE_TYPE,
  AGGREGATED_LOAN_TYPE
} from '../../../../config/loan-state';
import { LocalStorageService } from '@services/local-storage.service';

import { AntiChurnDialogComponent } from '@features/dashboard/offers/anti-churn-dialog/anti-churn-dialog.component';
import { AntiChurnErrorDialogComponent } from '@features/dashboard/offers/anti-churn-dialog/anti-churn-error-dialog/anti-churn-error-dialog.component';
import { ChangeBankTooManyTriesDialogError } from '@features/dashboard/offers/change-bank-dialog/change-bank-too-many-tries-dialog-error/change-bank-too-many-tries-dialog-error.component';

import { Subscription, Observable, fromEvent } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { OFFERS_LTV_TYPE } from '../../../../shared/models/offers';
import { UserService } from '@services/remote-api/user.service';
import smoothscroll from 'smoothscroll-polyfill';
import { CustomLangTextService } from '@shared/services/custom-lang-text.service';
import { locale } from '../../../../config/locale/locale';
import { ROUTES_MAP, ROUTES_MAP_NO } from '@config/routes-config';
import { EnvService } from '@services/env.service';
import { LoggingService } from '@services/logging.service';
import {
  OffersService,
  OfferMessage
} from '@features/dashboard/offers/offers.service';
import { NotificationService } from '@services/notification.service';
import { MessageBannerService } from '@services/message-banner.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
@Component({
  selector: 'rente-offers-blue',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
  providers: [OffersService]
})
export class OffersComponentBlue implements OnInit, OnDestroy {
  public offersInfo: Offers;
  public currentOfferInfo: Offers;
  public loansInfo: any;
  public loans: Loans;
  public offerSavingsType = OFFER_SAVINGS_TYPE;
  public aggregatedRateType = AGGREGATED_RATE_TYPE;
  public aggregatedLoanType = AGGREGATED_LOAN_TYPE;
  public offersLtvType = OFFERS_LTV_TYPE;
  public isLoading = true;
  public errorMessage: string;
  public isSmallScreen: boolean;
  public isShowTips: boolean;
  public changeBankLoading: boolean;
  public canBargain: boolean;
  public subscribeShareLinkTimer: Subscription;
  public effRateLoweredDialogVisible: boolean;
  public banksMap = BANKS_DATA;
  public tips: any[];
  public offerTypes: string[];
  public currentOfferType: string;
  public isSweden: boolean;
  public routesMap = ROUTES_MAP;
  public antiChurnIsOn = false;
  public nordeaClickSubscription: Subscription;
  public animationStyles = getAnimationStyles();
  public notificationSubscription: Subscription;
  public onScroll: boolean;

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  constructor(
    public dialog: MatDialog,
    public loansService: LoansService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    public customLangTextSerice: CustomLangTextService,
    public envService: EnvService,
    private offersService: OffersService,
    private logginService: LoggingService,
    private notificationService: NotificationService,
    private messageService: MessageBannerService
  ) {
    this.onResize();

    this.isShowTips = false;
    this.tips = [];
    userService.lowerRateAvailable.subscribe((value) => {
      this.effRateLoweredDialogVisible = value;
    });

    this.scrollOfferNotificationObserver();
  }

  public ngOnDestroy(): void {
    if (this.subscribeShareLinkTimer) {
      this.subscribeShareLinkTimer.unsubscribe();
    }

    if (this.nordeaClickSubscription) {
      this.nordeaClickSubscription.unsubscribe();
    }

    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }

    // Remove message poppus when leaving offers page. Should only effect message with arrow version
    this.messageService.detachView();
  }

  scrollOfferNotificationObserver(): Observable<any> {
    return fromEvent(window, 'scroll').pipe(
      filter(
        () =>
          window.innerHeight -
            document
              .getElementsByClassName('the-offers')[0]
              .getBoundingClientRect().top -
            60 >
          0
      )
    );
  }

  public setNotifAlert(n: number): void {
    if (n > 0) {
      this.messageService.setView(
        this.customLangTextSerice.getOffersUpdatedNotificationText(),
        73333000,
        this.animationStyles.DROP_DOWN_UP,
        'success-with-arrow',
        window,
        true,
        true,
        true
      );

      this.messageService.getClickSubject$().subscribe(() => {
        setTimeout(() => {
          this.scrollTo();
        }, 100);
        this.notificationService.resetOfferNotification();
      });
    }
  }

  public ngOnInit(): void {
    this.notificationSubscription = this.notificationService
      .getOfferNotificationAsObservable()
      .subscribe((n) => {
        this.setNotifAlert(n);
      });

    if (locale.includes('sv')) {
      this.isSweden = true;
    } else {
      this.isSweden = false;
    }
    this.offerTypes = ['threeMonths', 'oneYear', 'all'];
    // kick off the polyfill!
    smoothscroll.polyfill();

    this.offersService.updateOfferResponse$.subscribe(
      (res) => {
        this.offersInfo = Object.assign({}, res);
        this.currentOfferInfo = JSON.parse(JSON.stringify(res));

        this.antiChurnIsOn =
          this.offersInfo.bank === 'NORDEA' ||
          this.offersInfo.bank === 'DANSKE_BANK'
            ? true
            : false;

        this.canBargain =
          res.bank === 'SWE_AVANZA' ||
          res.bank === 'SWE_SBAB' ||
          res.bank === 'SWE_DANSKE_BANK' ||
          res.bank === 'SWE_ICA_BANKEN'
            ? false
            : true;

        this.isLoading = false;
        this.localStorageService.removeItem('isNewUser');
        this.offersService.isUpdatingOffers$.next(false);
      },
      (err) => {
        this.offersService.isUpdatingOffers$.next(false);

        if (err.errorType === 'PROPERTY_VALUE_MISSING') {
          this.errorMessage = err.title;
          this.router.navigate(['/dashboard/' + ROUTES_MAP.property]);
        }
        console.log(err);
      }
    );

    this.offersService.updateOffers$.next();

    this.nordeaClickSubscription = this.offersService
      .messages()
      .pipe(debounceTime(500))
      .subscribe((message: OfferMessage) => {
        switch (message) {
          case OfferMessage.antiChurn: {
            this.openAntiChurnBankDialog(this.offersInfo.offers.top5[0], false);
            break;
          }
        }
      });
  }

  public getOfferNotifications(): Observable<number> {
    return this.notificationService.getOfferNotificationAsObservable();
  }

  public scrollTo(): void {
    const offers = document.getElementById('best-offers-text');
    offers?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start'
    });
  }

  public openAntiChurnBankDialog(offer, shouldLog: boolean): void {
    if (
      this.antiChurnIsOn === false ||
      this.changeBankLoading ||
      this.offersInfo.offerSavingsType === this.offerSavingsType.NO_SAVINGS
    ) {
      return;
    }
    this.changeBankLoading = true;

    if (shouldLog) {
      this.logginService.googleAnalyticsLog({
        category: 'NordeaAntiChurn',
        action: 'Click top button anti-churn',
        label: `top offer: ${this.offersInfo.offers.top5[0].bankInfo.name}`
      });
    }
    const changeBankRef = this.dialog.open(AntiChurnDialogComponent, {
      autoFocus: false,
      data: offer
    });
    changeBankRef.afterClosed().subscribe(() => {
      this.handleChangeBankdialogOnClose(
        changeBankRef.componentInstance.closeState
      );
    });
  }

  public handleChangeBankdialogOnClose(state: string): void {
    this.changeBankLoading = false;
    switch (state) {
      case 'canceled': {
        break;
      }
      case 'do-nothing': {
        break;
      }
      case 'procced': {
        this.router.navigate(['/dashboard/prute-fullfort'], {
          state: { isError: false, fromChangeBankDialog: true }
        });
        break;
      }
      case 'procced-nordea': {
        this.router.navigate(['/dashboard/' + ROUTES_MAP_NO.bargainNordea], {
          state: { isError: false, fromChangeBankDialog: true }
        });
        break;
      }
      case 'error': {
        break;
      }
      case 'error-to-many-bargains': {
        this.dialog.open(ChangeBankTooManyTriesDialogError);
        break;
      }

      case 'error-to-many-bargains-nordea': {
        this.dialog.open(AntiChurnErrorDialogComponent);
        break;
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any = null): void {
    this.isSmallScreen = window.innerWidth <= 1024;
  }

  onDialogAction(answer: boolean): void {
    this.effRateLoweredDialogVisible = false;
    this.userService.lowerRateAvailable.next(false);
    if (answer === true) {
      this.loansService.confirmLowerRate().subscribe((res) => {});
    }
  }

  get rateBarPercentage(): RateBar {
    switch (this.offersInfo.offerSavingsType) {
      case this.offerSavingsType.NO_SAVINGS: {
        return {
          percentage: 95,
          class: 'level-5',
          hex: '#18bc9c'
        };
        break;
      }
      case this.offerSavingsType.SAVINGS_FIRST_YEAR_BETWEEN_0_AND_2000: {
        return {
          percentage: 75,
          class: 'level-4',
          hex: '#82C6B4'
        };
        break;
      }
      case this.offerSavingsType.SAVINGS_FIRST_YEAR_BETWEEN_2000_AND_6000: {
        return {
          percentage: 50,
          class: 'level-3',
          hex: '#ff5a00 '
        };
        break;
      }
      case this.offerSavingsType.SAVINGS_FIRST_YEAR_BETWEEN_6000_AND_10000: {
        return {
          percentage: 30,
          class: 'level-2',
          hex: '#E45A2A'
        };
        break;
      }
      case this.offerSavingsType.SAVINGS_FIRST_YEAR_GREATER_10000: {
        return {
          percentage: 12,
          class: 'level-1',
          hex: '#f41515'
        };
        break;
      }

      default: {
        return {
          percentage: 80,
          class: 'level-3',
          hex: '#'
        };
        break;
      }
    }
  }

  get barBoxPosition(): string {
    switch (this.offersInfo.offerSavingsType) {
      case this.offerSavingsType.NO_SAVINGS: {
        return '100%';
        break;
      }
      case this.offerSavingsType.SAVINGS_FIRST_YEAR_BETWEEN_0_AND_2000: {
        return 'calc(80% - 2.5em)';
        break;
      }
      case this.offerSavingsType.SAVINGS_FIRST_YEAR_BETWEEN_2000_AND_6000: {
        return 'calc(60% - 2.5em)';
        break;
      }
      case this.offerSavingsType.SAVINGS_FIRST_YEAR_BETWEEN_6000_AND_10000: {
        return 'calc(40% - 2.5em)';
        break;
      }
      case this.offerSavingsType.SAVINGS_FIRST_YEAR_GREATER_10000: {
        return 'calc(20%  - 2.5em)';
        break;
      }
      case this.offerSavingsType.SAVINGS_FIRST_YEAR_BETWEEN_0_AND_2000: {
        return 'calc(0% - 2.5em)';
        break;
      }
      default: {
        return 'calc(0% - 2.5em)';
        break;
      }
    }
  }
}
interface RateBar {
  percentage: number;
  class: string;
  hex: string;
}
