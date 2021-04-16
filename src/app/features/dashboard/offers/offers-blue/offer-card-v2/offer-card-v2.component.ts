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
import {
  OffersService,
  OfferMessage
} from '@features/dashboard/offers/offers.service';
import { locale } from '../../../../../config/locale/locale';

@Component({
  selector: 'rente-offer-card-v2',
  templateUrl: './offer-card-v2.component.html',
  styleUrls: ['./offer-card-v2.component.scss']
})
export class OfferCardV2Component implements OnInit {
  public banksMap = BANKS_DATA;
  public offerSavingsType = OFFER_SAVINGS_TYPE;
  public xpandStatus = false;
  public offerType: string;
  public isSweden: boolean;
  public isNordea = false;

  @Input() offer: OfferInfo;
  @Input() offersInfo: Offers;
  @Input() index: number;
  constructor(
    private trackingService: TrackingService,
    public dialog: MatDialog,
    private router: Router,
    public customLangTextSerice: CustomLangTextService,
    private offersService: OffersService
  ) {}

  ngOnInit(): void {
    if (locale.includes('sv')) {
      this.isSweden = true;
    } else {
      this.isSweden = false;
    }

    this.isNordea = this.offersInfo.bank === 'NORDEA';

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

  getbankNameOrDefault(offer: OfferInfo): string {
    let text = '';
    switch (offer.bankInfo.bank) {
      case 'SPAREBANKENOST': {
        text = 'Sparebanken Øst';
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

  public openBankUrl(offer: OfferInfo): void {
    if (offer.bankInfo.url === null) return;

    if (this.handleNybyggerProductSpecialCase(offer) === true) {
      return;
    }
    window.open(offer.bankInfo.url, '_blank');

    const trackingDto = new TrackingDto();
    trackingDto.offerId = offer.id;
    trackingDto.type = 'OFFER_HEADER_LINK';
    this.sendOfferTrackingData(trackingDto);
  }

  public openBankUrlByButton(offer: OfferInfo): void {
    if (offer.bankInfo.url === null || offer.bankInfo.partner === false) return;

    window.open(offer.bankInfo.url, '_blank');

    const trackingDto = new TrackingDto();
    trackingDto.offerId = offer.id;
    trackingDto.type = 'BANK_BUTTON_1';
    this.sendOfferTrackingData(trackingDto);
  }

  public handleNybyggerProductSpecialCase(offer: OfferInfo): boolean {
    if (
      offer.productName.includes('Rammelån') &&
      offer.bankInfo.bank === 'NYBYGGER'
    ) {
      window.open(
        'https://www.nybygger.no/kampanje-rammelan/?utm_medium=affiliate%20&utm_source=renteradar.no&utm_campaign=rammelan110&utm_content=cta',
        '_blank'
      );
      return true;
    }
    return false;
  }

  public openNewOfferDialog(offer: OfferInfo): void {
    if (offer.bankInfo.partner === false) return;

    if (this.handleNybyggerProductSpecialCase(offer) === true) {
      return;
    }

    window.open(offer.bankInfo.transferUrl, '_blank');

    const trackingDto = new TrackingDto();
    trackingDto.offerId = offer.id;
    trackingDto.type = 'BANK_BUTTON_2';
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
