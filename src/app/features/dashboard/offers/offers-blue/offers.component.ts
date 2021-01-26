import { LoansService } from '@services/remote-api/loans.service';
import { OffersService } from './offers.service';
import { OfferInfo, Offers } from './../../../../shared/models/offers';
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogInfoComponent } from './../dialog-info/dialog-info.component';
import { Loans } from '@shared/models/loans';
import { BANKS_DATA } from '@config/banks-config';
import { Router } from '@angular/router';
import {
  OFFER_SAVINGS_TYPE,
  AGGREGATED_RATE_TYPE,
  AGGREGATED_LOAN_TYPE
} from '../../../../config/loan-state';
import { LocalStorageService } from '@services/local-storage.service';
import { ChangeBankDialogLangGenericComponent } from '../../../../local-components/components-output';
import { GetOfferFromBankDialogComponent } from './../get-offer-from-bank-dialog/get-offer-from-bank-dialog.component';
import { LtvTooHighDialogComponent } from './../ltv-too-high-dialog/ltv-too-high-dialog.component';
import { ChangeBankServiceService } from '@services/remote-api/change-bank-service.service';
import {
  TrackingService,
  TrackingDto
} from '@services/remote-api/tracking.service';
import { Subscription } from 'rxjs';
import { OFFERS_LTV_TYPE } from '../../../../shared/models/offers';
import { UserService } from '@services/remote-api/user.service';
import smoothscroll from 'smoothscroll-polyfill';
import { BankUtils } from '@shared/models/bank';
import { CustomLangTextService } from '@shared/services/custom-lang-text.service';
import { locale } from '../../../../config/locale/locale';
import { ROUTES_MAP } from '@config/routes-config';

@Component({
  selector: 'rente-offers-blue',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
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
  public tips: object[];
  public offerTypes: string[];
  public currentOfferType: string;
  public isSweden: boolean;
  public routesMap = ROUTES_MAP;
  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  get hasStatensPensjonskasseMembership(): boolean {
    return (
      this.offersInfo &&
      this.offersInfo.memberships &&
      this.offersInfo.memberships.indexOf(
        'STATENS_PENSJONSKASSE_STATLIG_ANSATT'
      ) > -1
    );
  }

  getBankLogo(bankName: string): string {
    const b = BANKS_DATA[bankName];
    if (b && b.img) {
      return b.img;
    } else {
      const bank = BankUtils.getBankByName(bankName);
      return bank && bank.icon
        ? '../../assets/img/banks-logo/round/' + bank.icon
        : '../../assets/img/banks-logo/round/annen.png';
    }
  }

  constructor(
    public dialog: MatDialog,
    public offersService: OffersService,
    public loansService: LoansService,
    private changeBankServiceService: ChangeBankServiceService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private trackingService: TrackingService,
    public customLangTextSerice: CustomLangTextService
  ) {
    this.onResize();

    this.isShowTips = false;
    this.tips = [];
    userService.lowerRateAvailable.subscribe((value) => {
      this.effRateLoweredDialogVisible = value;
    });
  }

  public ngOnDestroy(): void {
    if (this.subscribeShareLinkTimer) {
      this.subscribeShareLinkTimer.unsubscribe();
    }
  }

  public ngOnInit(): void {
    if (locale.includes('sv')) {
      this.isSweden = true;
    } else {
      this.isSweden = false;
    }
    this.offerTypes = ['threeMonths', 'oneYear', 'all'];
    // kick off the polyfill!
    smoothscroll.polyfill();
    this.loansService.getOffers().subscribe(
      (res: Offers) => {
        this.offersInfo = Object.assign({}, res);
        this.currentOfferInfo = JSON.parse(JSON.stringify(res));

        this.canBargain =
          res.bank === 'SWE_AVANZA' ||
          res.bank === 'SWE_SBAB' ||
          res.bank === 'SWE_DANSKE_BANK' ||
          res.bank === 'SWE_ICA_BANKEN'
            ? false
            : true;

        this.isLoading = false;
        this.localStorageService.removeItem('isNewUser');
        this.getTips();
      },
      (err) => {
        if (err.errorType === 'PROPERTY_VALUE_MISSING') {
          this.errorMessage = err.title;
          this.router.navigate(['/dashboard/' + ROUTES_MAP.property]);
        }
        console.log(err);
      }
    );
  }

  public getTips(): void {
    if (this.offersInfo.incompleteInfoLoanPresent !== true) {
      this.tips.push({
        header: 'Obs',
        text: this.customLangTextSerice.getLimitedLoanInfoWarning(),
        icon: 'warning',
        obs: true
      });
    }

    if (
      this.offersInfo.aggregatedLoanType ===
        this.aggregatedLoanType.CREDIT_LINE ||
      this.offersInfo.aggregatedLoanType === this.aggregatedLoanType.MIX_D_C
    ) {
      this.tips.push({
        header: 'Belåningsgrad',
        text: this.customLangTextSerice.getHouseValue(),
        buttonLink: '/dashboard/' + ROUTES_MAP.property,
        icon: this.isMobile ? 'house' : 'house-blue'
      });
    }

    if (!this.offersInfo.memberships.length) {
      this.tips.push({
        header: 'Medlemskap',
        text: this.customLangTextSerice.getMembershipWarning(),
        buttonLink: '/dashboard/' + ROUTES_MAP.profile,
        icon: this.isMobile ? 'profile-icon-white' : 'profile-icon-blue'
      });
    }
    if (
      this.offersInfo.aggregatedRateType ===
      this.aggregatedRateType.MIX_FIXED_FLOATING
    ) {
      this.tips.push({
        header: 'Fastrentelån',
        text:
          'Vi ser du har ett eller flere fastrentelån. Renteradar viser besparelsespotensialet kun for lånet/lånene med flytende rente. Beste rente viser også kun beste rente for lånet/lånene med flytende rente.',
        buttonLink: './',
        icon: 'rate'
      });
    }
    if (
      this.offersInfo.aggregatedLoanType ===
        this.aggregatedLoanType.CREDIT_LINE ||
      this.offersInfo.aggregatedLoanType === this.aggregatedLoanType.MIX_D_C
    ) {
      this.tips.push({
        header: 'Rammelån/boligkreditt',
        text:
          'Du har rammelån/boligkreditt. Ønsker du å se tilbud kun for denne typen lån?',
        buttonLink: '/dashboard/' + ROUTES_MAP.profile,
        icon: this.isMobile ? 'profile-icon-white' : 'profile-icon-blue'
      });
    }

    if (this.hasStatensPensjonskasseMembership) {
      this.tips.push({
        header: 'Statens pensjonskasse',
        text:
          'Medlemmer i Statens Pensjonskasse kan finansiere opptil 2 millioner hos Statens Pensjonskasse. Klikk her for mer info om tilbudet.',
        buttonLink: 'https://www.finansportalen.no/bank/boliglan/',
        external: true,
        icon: this.isMobile ? 'profile-icon-white' : 'profile-icon-blue'
      });
    }
  }

  public goToBestOffer(): void {
    const element = document.getElementById('best-offers-text');
    const headerOffset = this.isMobile ? 80 : 180;

    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  public goToProperty() {
    this.router.navigate(['/dashboard/' + ROUTES_MAP.property]);
  }

  public goToLoans() {
    this.router.navigate(['/dashboard/' + ROUTES_MAP.loans]);
  }

  public setOfferType(type: string) {
    this.currentOfferType = type;

    if (type === 'all') {
      this.currentOfferInfo.offers.top5 = this.offersInfo.offers.top5;
      return;
    }
    const newLoanTypeSelected = this.offersInfo.offers.top5.filter((item) => {
      return item.loanType === type;
    });

    this.currentOfferInfo.offers.top5 = newLoanTypeSelected;
  }

  public openOfferDialog(offer: OfferInfo): void {
    this.dialog.open(DialogInfoComponent, {
      data: offer
    });
  }

  public openBankUrl(offer: OfferInfo): void {
    if (offer.bankInfo.url === null) {
      return;
    }

    window.open(offer.bankInfo.url, '_blank');

    const trackingDto = new TrackingDto();
    trackingDto.offerId = offer.id;
    trackingDto.type = 'OFFER_HEADER_LINK';
    this.sendOfferTrackingData(trackingDto, offer);
  }

  public openBankUrlByButton(offer: OfferInfo) {
    if (offer.bankInfo.url === null || offer.bankInfo.partner == false) return;

    window.open(offer.bankInfo.url, '_blank');

    const trackingDto = new TrackingDto();
    trackingDto.offerId = offer.id;
    trackingDto.type = 'BANK_BUTTON_1';
    this.sendOfferTrackingData(trackingDto, offer);
  }

  public openNewOfferDialog(offer: OfferInfo): void {
    if (offer.bankInfo.partner === false) {
      return;
    }
    window.open(offer.bankInfo.transferUrl, '_blank');

    const trackingDto = new TrackingDto();
    trackingDto.offerId = offer.id;
    trackingDto.type = 'BANK_BUTTON_2';
    this.sendOfferTrackingData(trackingDto, offer);
  }

  private sendOfferTrackingData(trackingDto: TrackingDto, offer: OfferInfo) {
    this.trackingService.sendTrackingStats(trackingDto).subscribe(
      (res) => {},
      (err) => {
        console.log('err');
        console.log(err);
      }
    );
  }

  public openChangeBankDialog(offer): void {
    if (
      this.changeBankLoading ||
      this.offersInfo.offerSavingsType === this.offerSavingsType.NO_SAVINGS
    ) {
      return;
    }
    this.changeBankLoading = true;
    const offerId = offer.id;
    const currentBank = this.offersInfo.bank;
    this.changeBankServiceService.getBankOfferRequest(offerId).subscribe(
      (preview) => {
        this.changeBankLoading = false;

        const changeBankRef = this.dialog.open(
          ChangeBankDialogLangGenericComponent,
          {
            autoFocus: false,
            data: { preview, offerId, currentBank }
          }
        );
        changeBankRef.afterClosed().subscribe(() => {
          this.handleChangeBankdialogOnClose(
            changeBankRef.componentInstance.closeState
          );
        });
      },
      (err) => {
        this.changeBankLoading = false;
      }
    );
  }

  public handleChangeBankdialogOnClose(state: string) {
    switch (state) {
      case 'canceled': {
        break;
      }
      case 'procced': {
        this.router.navigate(['/dashboard/prute-fullfort'], {
          state: { isError: false, fromChangeBankDialog: true }
        });
        break;
      }
      case 'error': {
        this.router.navigate(['/dashboard/prute-fullfort'], {
          state: { isError: false, fromChangeBankDialog: true }
        });
        break;
      }
    }
  }

  openLtvTooHightDialog(): void {
    this.dialog.open(LtvTooHighDialogComponent);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any = null) {
    this.isSmallScreen = window.innerWidth <= 1024;
  }

  onDialogAction(answer: boolean): void {
    this.effRateLoweredDialogVisible = false;
    if (answer === true) {
      this.userService.lowerRateAvailable.next(false);
      this.loansService.confirmLowerRate().subscribe((res) => {});
    }
  }

  get isDialogVisble(): boolean {
    return this.effRateLoweredDialogVisible;
  }

  getbankNameOrDefault(offer: OfferInfo): string {
    let text = '';
    switch (offer.bankInfo.bank) {
      case 'SBANKEN': {
        text = 'Sbanken';
        break;
      }
      case 'BULDER': {
        text = 'Bulder';
        break;
      }
      case 'LANDKREDITT': {
        text = 'Landkreditt';
        break;
      }
      default: {
        text = 'banken';
        break;
      }
    }
    return text;
  }

  get rateBarPercentageInverted(): number {
    return 100 - this.rateBarPercentage.percentage;
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
