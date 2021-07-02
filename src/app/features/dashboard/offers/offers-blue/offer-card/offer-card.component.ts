import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BANKS_DATA } from '@config/banks-config';
import {
  TrackingDto,
  TrackingService
} from '@services/remote-api/tracking.service';
import { CustomLangTextService } from '@shared/services/custom-lang-text.service';

import { OFFER_SAVINGS_TYPE } from '../../../../../config/loan-state';
import { BankScoreLangGenericComponent } from '../../../../../local-components/components-output';
import { OfferInfo, Offers } from './../../../../../shared/models/offers';
import { OfferCardService } from '../offer-card.service';

import {
  OffersService,
  OfferMessage
} from '@features/dashboard/offers/offers.service';
import { locale } from '../../../../../config/locale/locale';

@Component({
  selector: 'rente-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.scss']
})
export class OfferCardComponent implements OnInit {
  public banksMap = BANKS_DATA;
  public offerSavingsType = OFFER_SAVINGS_TYPE;
  public xpandStatus = false;
  public offerType: string;
  public isSweden: boolean;
  public isNordea = false;
  public bankSpecialPromoText: string | null = null;

  @Input() offer: OfferInfo;
  @Input() offersInfo: Offers;
  @Input() index: number;
  constructor(
    private trackingService: TrackingService,
    public dialog: MatDialog,
    private router: Router,
    public customLangTextSerice: CustomLangTextService,
    private offersService: OffersService,
    public offerCardService: OfferCardService
  ) {}

  ngOnInit(): void {
    if (locale.includes('sv')) {
      this.isSweden = true;
    } else {
      this.isSweden = false;
    }

    this.bankSpecialPromoText = this.getBankSpecialPromoText();
    this.isNordea = this.offersInfo.bank === 'NORDEA';

    if (this.offer.bankInfo.bank === 'NYBYGGER') {
      this.offer.bankInfo.partner = true;
    }

    if (this.offer.fixedRatePeriod === 0) {
      this.offerType = 'threeMonths';
    } else if (this.offer.fixedRatePeriod === 1) {
      this.offerType = 'oneYear';
    }

    if (this.offer.bankInfo.score === null) this.offer.bankInfo.score = 3;
  }

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  public getBankSpecialPromoText(): string | null {
    if (this.offer.bankInfo.bank === 'BULDER') {
      return 'Gir kundeutbytte';
    }
    return null;
  }

  getbankNameOrDefault(offer: OfferInfo, isHompepageLink: boolean): string {
    let text = '';
    switch (offer.bankInfo.bank) {
      case 'SPAREBANKENOST': {
        text = 'Sparebanken Øst';
        break;
      }
      case 'NYBYGGER': {
        text = isHompepageLink ? "Nybygger.no'" : 'Nybygger.no';
        break;
      }
      case 'SBANKEN': {
        text = 'Sbanken';
        break;
      }
      case 'BULDER': {
        text = 'Bulder';
        break;
      }
      default: {
        text = 'banken';
        break;
      }
    }
    return text;
  }

  private sendOfferTrackingData(trackingDto: TrackingDto) {
    this.trackingService.sendTrackingStats(trackingDto).subscribe(
      () => {},
      (err) => {
        console.log('err');
        console.log(err);
      }
    );
  }

  public clickHeaderBankUrl(offer: OfferInfo): void {
    this.offerCardService.clickHeaderBankUrl(offer);
  }

  public openBankUrlByButton(offer: OfferInfo): void {
    if (offer.bankInfo.url === null || offer.bankInfo.partner === false) return;

    const trackingDto = new TrackingDto();
    trackingDto.offerId = offer.id;
    trackingDto.type = 'BANK_BUTTON_1';
    if (
      this.offerCardService.handleNybyggerProductSpecialCase(offer) === true
    ) {
      this.sendOfferTrackingData(trackingDto);
      return;
    }

    window.open(offer.bankInfo.url, '_blank');
    this.sendOfferTrackingData(trackingDto);
  }

  public openNewOfferDialog(offer: OfferInfo): void {
    if (offer.bankInfo.partner === false) return;

    const trackingDto = new TrackingDto();
    trackingDto.offerId = offer.id;
    trackingDto.type = 'BANK_BUTTON_2';

    if (
      this.offerCardService.handleNybyggerProductSpecialCase(offer) === true
    ) {
      this.sendOfferTrackingData(trackingDto);
      return;
    }

    window.open(offer.bankInfo.transferUrl, '_blank');
    this.sendOfferTrackingData(trackingDto);
  }

  public detailOpenClicked(): void {
    this.xpandStatus = true;
  }

  public openInfoDialog(): void {
    const bankRatingDialogRef = this.dialog.open(
      BankScoreLangGenericComponent,
      {
        height: '400px'
      }
    );

    bankRatingDialogRef.afterClosed().subscribe(() => {
      this.handlebankRatingdialogOnClose(
        bankRatingDialogRef.componentInstance.closeState
      );
    });
  }

  public handlebankRatingdialogOnClose(state: string): void {
    switch (state) {
      case 'canceled': {
        break;
      }
      case 'procced': {
        this.router.navigate(['/dashboard', 'epsi-kundetilfredshet']);
        break;
      }
    }
  }

  public clickNordea(): void {
    this.offersService.pushMessage(OfferMessage.antiChurn);
  }
}
