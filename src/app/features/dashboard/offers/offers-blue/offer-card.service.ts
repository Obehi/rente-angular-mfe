import { Injectable } from '@angular/core';
import { CustomLangTextService } from '@services/custom-lang-text.service';
import {
  TrackingDto,
  TrackingService
} from '@services/remote-api/tracking.service';
import { OfferInfo } from '../../../../shared/models/offers';

@Injectable({
  providedIn: 'root'
})
export class OfferCardService {
  constructor(
    private trackingService: TrackingService,
    private langService: CustomLangTextService
  ) {}

  public handleNybyggerProductSpecialCase(offer: OfferInfo): boolean {
    if (
      offer.productName.includes('Rammelån') &&
      offer.bankInfo.bank === 'NYBYGGER'
    ) {
      window.open(
        'https://www.nybygger.no/kampanje-rammelan/?utm_source=renteradar.no&utm_medium=affiliate&utm_content=nyb-13&utm_term=sales&utm_campaign=sommer_21',
        '_blank'
      );
      return true;
    }

    if (
      offer.productName.includes('Boliglån 75') &&
      offer.bankInfo.bank === 'NYBYGGER'
    ) {
      window.open(
        'https://www.nybygger.no/kampanje-boliglan/?utm_source=renteradar.no&utm_medium=affiliate&utm_content=nyb-12&utm_term=sales&utm_campaign=sommer_21'
      );
      return true;
    }

    if (
      offer.productName.includes('Ung 85') &&
      offer.bankInfo.bank === 'NYBYGGER'
    ) {
      window.open(
        'https://www.nybygger.no/boliglan/boliglan-for-unge-85/?utm_source=renteradar.no&utm_medium=affiliate&utm_content=nyb-14&utm_term=sales&utm_campaign=sommer_21'
      );
      return true;
    }
    return false;
  }

  public sendOfferTrackingData(trackingDto: TrackingDto): void {
    this.trackingService.sendTrackingStats(trackingDto).subscribe(
      () => {},
      (err) => {
        console.log('err');
        console.log(err);
      }
    );
  }

  public clickHeaderBankUrl(offer: OfferInfo): void {
    if (offer.bankInfo.url === null) return;

    const trackingDto = new TrackingDto();
    trackingDto.offerId = offer.id;
    trackingDto.type = 'OFFER_HEADER_LINK';
    window.open(offer.bankInfo.url, '_blank');
    this.sendOfferTrackingData(trackingDto);
  }

  public getOfferButtonText(offer: OfferInfo): string {
    let text = '';
    switch (offer.bankInfo.bank) {
      case 'SPAREBANKENOST': {
        text = 'Få tilbud fra Sparebanken Øst!';
        break;
      }
      case 'NYBYGGER': {
        text = 'Les mer og søk om lån';
        break;
      }
      case 'BULDER': {
        text = 'Få tilbud fra Bulder!';
        break;
      }

      case 'SWE_HYPOTEKET': {
        text = 'Få erbjudande ifrån Hypoteket!';
        break;
      }

      default: {
        text = this.langService.getOfferCardButtonDefaultCTAText();
        break;
      }
    }
    return text;
  }
}
