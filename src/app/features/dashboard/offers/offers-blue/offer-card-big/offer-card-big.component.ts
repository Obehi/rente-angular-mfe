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
import {
  OffersService,
  OfferMessage
} from '@features/dashboard/offers/offers.service';
import { Router } from '@angular/router';
import { CustomLangTextService } from '@shared/services/custom-lang-text.service';
import { locale } from '../../../../../config/locale/locale';
import { LoggingService } from '@services/logging.service';

import { OFFER_SAVINGS_TYPE } from '../../../../../config/loan-state';
import { OfferCardService } from '../offer-card.service';
import { GenericInfoDialogComponent } from '@shared/components/ui-components/dialogs/generic-info-dialog/generic-info-dialog.component';

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
  public isAntiChurnBank: boolean;
  public isSingleButtonLayout = false;
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
    private logginService: LoggingService,
    public offerCardService: OfferCardService
  ) {}

  ngOnInit(): void {
    if (locale.includes('sv')) {
      this.isSweden = true;
    } else {
      this.isSweden = false;
    }

    this.isAntiChurnBank =
      this.offersInfo.bank === 'NORDEA' ||
      this.offersInfo.bank === 'DANSKE_BANK';

    this.isSingleButtonLayout = this.offerCardService.isSingleButtonLayout(
      this.offer.bankInfo.bank
    );

    if (
      this.offer.bankInfo.bank === 'NYBYGGER' ||
      this.offer.bankInfo.bank === 'DIN_BANK'
    ) {
      this.offer.bankInfo.partner = true;
    }

    if (this.offer.fixedRatePeriod === 0) {
      this.offerType = 'threeMonths';
    } else if (this.offer.fixedRatePeriod === 1) {
      this.offerType = 'oneYear';
    }

    if (this.offer.bankInfo.score === null) this.offer.bankInfo.score = 3;

    this.bankSpecialPromoText = this.offerCardService.getBankSpecialPromoText(
      this.offer.bankInfo.bank
    );

    if (
      this.offer.bankInfo.bank === 'UNIO_NORDEA_DIRECT' ||
      this.offer.bankInfo.bank === 'YS_NORDEA_DIRECT'
    ) {
      this.offer.bankInfo.partner = true;
    }
  }

  get isMobile(): boolean {
    return window.innerWidth < 600;
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

  public openOfferDialog(offer: OfferInfo): void {
    this.dialog.open(DialogInfoComponent, {
      data: offer
    });
  }

  public openCustomerDividend(): void {
    if (this.offer.bankInfo.bank !== 'BULDER') return;
    this.dialog.open(GenericInfoDialogComponent, {
      data: {
        header: 'Kundeutbytte',
        text: 'Har du boliglån i Bulder Bank kvalifiserer du til kundeutbytte.',
        linkAbbreviation: 'Les mer her',
        link:
          'https://blogg.renteradar.no/kundeutbytte-i-banker-sa-mye-kan-du-fa/'
      }
    });
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

  public openInfoDialog(): void {
    const bankRatingDialogRef = this.dialog.open(BankScoreLangGenericComponent);

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
    this.logginService.googleAnalyticsLog({
      category: 'NordeaAntiChurn',
      action: 'Click offer card anti-churn',
      label: `top offer: ${this.offersInfo.offers.top5[0].bankInfo.name}`
    });
    this.offersService.pushMessage(OfferMessage.antiChurn);
  }
}
