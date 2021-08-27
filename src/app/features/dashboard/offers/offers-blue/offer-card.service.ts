import { Injectable } from '@angular/core';
import { CustomLangTextService } from '@services/custom-lang-text.service';
import { EnvService } from '@services/env.service';
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
    private langService: CustomLangTextService,
    private envService: EnvService
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

  public isSingleButtonLayout(bank: string): boolean {
    return bank === 'NYBYGGER' || bank === 'DIN_BANK';
  }

  public getOfferButtonText(offer: OfferInfo): string {
    const testText =
      this.getVariation() === 0
        ? 'Flytt boliglånet til Nordea Direct'
        : 'Les mer og søk om lån';
    console.log('testText');
    console.log(testText);
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
      case 'DIN_BANK': {
        text = 'Les mer og søk om lån';
        break;
      }
      case 'BULDER': {
        text = 'Få tilbud fra Bulder!';
        break;
      }

      case 'SWE_HYPOTEKET': {
        text = 'Få erbjudande från Hypoteket';
        break;
      }
      /* case 'YS_NORDEA_DIRECT': {
        text =
          this.getVariation() === 0
            ? 'Flytt boliglånet til Nordea Direct'
            : 'Les mer og søk om lån';
        break;
      }

      case 'UNIO_NORDEA_DIRECT': {
        text =
          this.getVariation() === 0
            ? 'Flytt boliglånet til Nordea Direct'
            : 'Les mer og søk om lån';
        break;
      } */
      default: {
        text = this.langService.getOffeCardCTAButtonText();
        break;
      }
    }
    return text;
  }

  public getVariation() {
    if ((window as any).google_optimize === undefined) {
      console.log('couldnt get optimize');
      return 0;
    }
    let experimentId: string | null;
    if (this.envService.environment.production === true) {
      console.log('is production');
      experimentId = '_7-we-p9SA2OAVDcKn0xVA';
    } else {
      console.log('is not production');
      experimentId = 'A6Fvld2GTAG3VE95NWV1Hw';
    }

    const variation = (window as any).google_optimize.get(experimentId);
    console.log((window as any).google_optimize.get(experimentId));
    console.log(variation);
    return variation || 0;
  }
}
