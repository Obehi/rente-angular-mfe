import { LoansService } from '@services/remote-api/loans.service';
import { OffersService } from './offers.service';
import { OfferInfo, Offers } from './../../../shared/models/offers';
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from './dialog-info/dialog-info.component';
import { Loans } from '@shared/models/loans';
import { BANKS_DATA } from '@config/banks-config';
import { Router } from '@angular/router';
import { OFFER_SAVINGS_TYPE, AGGREGATED_RATE_TYPE, AGGREGATED_LOAN_TYPE } from '../../../config/loan-state';
import { LocalStorageService } from '@services/local-storage.service';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { ChangeBankDialogComponent } from './change-bank-dialog/change-bank-dialog.component';
import { ChangeBankServiceService } from '@services/remote-api/change-bank-service.service';
import { Subscription } from 'rxjs';
import { OFFERS_RESULT_TYPE } from '../../../shared/models/offers';
import { UserService } from '@services/remote-api/user.service';

@Component({
  selector: 'rente-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('0.5s ease-out',
              style({ height: 200, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: 200, opacity: 1 }),
            animate('0.5s ease-in',
              style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    ),
    trigger(
      'shakeAnimation',
      [
        transition(':enter', animate('200ms ease-in', keyframes([
          style({ transform: 'translate3d(-15px, 0, 0)' }),
          style({ transform: 'translate3d(0, 0, 0)' }),
          style({ transform: 'translate3d(7px, 0, 0)' }),
          style({ transform: 'translate3d(0, 0, 0)' })
        ]))),
      ]
    ),
  ]
})
export class OffersComponent implements OnInit, OnDestroy {
  public offersInfo: Offers;
  public loansInfo: any;
  public loans: Loans;
  public banksMap = BANKS_DATA;
  public offerSavingsType = OFFER_SAVINGS_TYPE;
  public aggregatedRateType = AGGREGATED_RATE_TYPE;
  public aggregatedLoanType = AGGREGATED_LOAN_TYPE;
  public offersResultType = OFFERS_RESULT_TYPE;
  public isLoading = true;
  public errorMessage: string;
  public isSmallScreen: boolean;
  public isShowTips: boolean;
  public changeBankLoading: boolean;
  public subscribeShareLinkTimer: Subscription;
  public effRateLoweredDialogVisible: boolean;

  get hasLoansStatistics(): boolean {
    const res: boolean = this.offersInfo
      && this.offersInfo.bestPercentileEffectiveRateYourBank > 0
      && this.offersInfo.bestPercentileEffectiveRateAllBanks > 0
      && this.offersInfo.medianEffectiveRateYourBank > 0
      && this.offersInfo.medianEffectiveRateAllBanks > 0;
    return res;
  }

  get hasStatensPensjonskasseMembership(): boolean {
    return this.offersInfo && this.offersInfo.memberships && this.offersInfo.memberships.indexOf('STATENS_PENSJONSKASSE_STATLIG_ANSATT') > -1;
  }

  constructor(
    public dialog: MatDialog,
    public offersService: OffersService,
    public loansService: LoansService,
    private changeBankServiceService: ChangeBankServiceService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.onResize();
    this.isShowTips = true;
    UserService.lowerRateAvailable.subscribe(value => {
      if (value) {
        this.effRateLoweredDialogVisible = value;
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.subscribeShareLinkTimer) {
      this.subscribeShareLinkTimer.unsubscribe();
    }
  }

  public ngOnInit(): void {
    this.loansService.getOffers().subscribe((res: Offers) => {
      this.offersInfo = res;
      this.isLoading = false;
      // const shareLinkTimer = timer(30000);
      // if (!this.localStorageService.getItem('shareSheetShown')) {
      //   this.subscribeShareLinkTimer = shareLinkTimer.subscribe(_ => {
      //     this.bottomSheet.open(ShareSheetComponent);
      //     this.localStorageService.setItem('shareSheetShown', true);
      //   });
      // }
      this.localStorageService.removeItem('isNewUser');
    }, err => {
      if (err.errorType === 'PROPERTY_VALUE_MISSING') {
        this.errorMessage = err.title;
        this.router.navigate(['/dashboard/bolig']);
      }
      console.log(err);
    });
  }

  public openOfferDialog(offer: OfferInfo): void {
    this.dialog.open(DialogInfoComponent, {
      width: '600px',
      data: offer
    });
  }

  public openBottomSheet() {

  }

  public openChangeBankDialog(offer): void {
    if (this.changeBankLoading || this.offersInfo.offerSavingsType === this.offerSavingsType.NO_SAVINGS) {
      return;
    }
    this.changeBankLoading = true;
    const offerId = offer.id;
    this.changeBankServiceService.getBankOfferRequest(offerId).subscribe(preview => {
      this.changeBankLoading = false;
      this.dialog.open(ChangeBankDialogComponent, {
        width: '800px',
        maxHeight: '90vh',
        data: { preview, offerId }
      });
    }, err => {
      this.changeBankLoading = false;
    });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any=null) {
    this.isSmallScreen = window.innerWidth <= 1024;
  }

  onDialogAction(answer: boolean) {
    this.effRateLoweredDialogVisible = false;
    if (answer === true) {
        UserService.lowerRateAvailable.next(false);
        this.loansService.confirmLowerRate().subscribe(res => {});
    }
  }

  get isDialogVisble(): boolean {
    return this.effRateLoweredDialogVisible;
  }

}
