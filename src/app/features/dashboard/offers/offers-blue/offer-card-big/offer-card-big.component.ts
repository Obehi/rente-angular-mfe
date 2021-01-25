import { Component, OnInit, Input } from '@angular/core';
import { OfferInfo, Offers } from './../../../../../shared/models/offers';
import { BANKS_DATA } from '@config/banks-config';
import {
  TrackingService,
  TrackingDto
} from '@services/remote-api/tracking.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from '../../dialog-info/dialog-info.component';

import { BankScoreLangGenericComponent } from '../../../../../local-components/components-output';

import { Router } from '@angular/router';
import { CustomLangTextService } from '@shared/services/custom-lang-text.service';
import { locale } from '../../../../../config/locale/locale';

import {
  OFFER_SAVINGS_TYPE,
  AGGREGATED_RATE_TYPE,
  AGGREGATED_LOAN_TYPE
} from '../../../../../config/loan-state';

@Component({
  selector: 'rente-offer-card-big-blue',
  templateUrl: './offer-card-big.component.html',
  styleUrls: ['./offer-card-big.component.scss']
})
export class OfferCardBigComponentBlue implements OnInit {
  public banksMap = BANKS_DATA;
  public offerSavingsType = OFFER_SAVINGS_TYPE;
  public offerType: string;
  public isSweden: boolean;

  @Input() offer: OfferInfo;
  @Input() offersInfo: Offers;
  @Input() index: number;
  constructor(
    private trackingService: TrackingService,
    public dialog: MatDialog,
    private router: Router,
    public customLangTextSerice: CustomLangTextService
  ) {}

  ngOnInit() {
    if (locale.includes('sv')) {
      this.isSweden = true;
    } else {
      this.isSweden = false;
    }
    if (this.offer.fixedRatePeriod === 0) {
      this.offerType = 'threeMonths';
    } else if (this.offer.fixedRatePeriod === 1) {
      this.offerType = 'oneYear';
    }
  }

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  getbankNameOrDefault(offer: OfferInfo): string {
    let text = '';
    switch (offer.bankInfo.bank) {
      case 'SPAREBANKENOST': {
        text = 'Sparebanken Øst';
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

  private sendOfferTrackingData(trackingDto: TrackingDto, offer: OfferInfo) {
    this.trackingService.sendTrackingStats(trackingDto).subscribe(
      (res) => {},
      (err) => {
        console.log('err');
        console.log(err);
      }
    );
  }

  public handleNybyggerProductSpecialCase(offer: OfferInfo): boolean {
    if (
      offer.productName.includes('Rammelån') &&
      offer.bankInfo.bank == 'NYBYGGER'
    ) {
      window.open(
        'https://www.nybygger.no/kampanje-rammelan/?utm_medium=affiliate%20&utm_source=renteradar.no&utm_campaign=rammelan110&utm_content=cta',
        '_blank'
      );

      return true;
    }
    return false;
  }

  public openOfferDialog(offer: OfferInfo): void {
    this.dialog.open(DialogInfoComponent, {
      data: offer
    });
  }

  public openBankUrl(offer: OfferInfo) {
    if (this.handleNybyggerProductSpecialCase(offer) == true) {
      return;
    }

    if (offer.bankInfo.url === null) return;

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
    if (this.handleNybyggerProductSpecialCase(offer) == true) {
      return;
    }

    if (offer.bankInfo.partner === false) return;

    window.open(offer.bankInfo.transferUrl, '_blank');

    const trackingDto = new TrackingDto();
    trackingDto.offerId = offer.id;
    trackingDto.type = 'BANK_BUTTON_2';
    this.sendOfferTrackingData(trackingDto, offer);
  }

  public openInfoDialog(text: string): void {
    const bankRatingDialogRef = this.dialog.open(BankScoreLangGenericComponent);

    bankRatingDialogRef.afterClosed().subscribe(() => {
      this.handlebankRatingdialogOnClose(
        bankRatingDialogRef.componentInstance.closeState
      );
    });
  }

  public handlebankRatingdialogOnClose(state: string) {
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
}
