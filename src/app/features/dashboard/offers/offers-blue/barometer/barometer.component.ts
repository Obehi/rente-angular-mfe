import { Component, Input, OnInit } from '@angular/core';
import { OFFER_SAVINGS_TYPE } from '@config/loan-state';
import { CustomLangTextService } from '@services/custom-lang-text.service';
import { Offers } from '../../../../../shared/models/offers';

@Component({
  selector: 'barometer',
  templateUrl: './barometer.component.html',
  styleUrls: ['./barometer.component.scss']
})
export class BarometerComponent implements OnInit {
  @Input() offersInfo: Offers;
  @Input() offerSavingsType = OFFER_SAVINGS_TYPE;

  baseTextArray = [
    this.customLangService.getBarometerTextState0(),
    this.customLangService.getBarometerTextState1(),
    this.customLangService.getBarometerTextState2(),
    this.customLangService.getBarometerTextState3(),
    this.customLangService.getBarometerTextState4()
  ];
  additionalTextArray = [
    this.customLangService.getBarometerAdditionalTextState0(),
    this.customLangService.getBarometerAdditionalTextState1(),
    this.customLangService.getBarometerAdditionalTextState2(),
    this.customLangService.getBarometerAdditionalTextState3(),
    this.customLangService.getBarometerAdditionalTextState4()
  ];
  state = 0;

  constructor(public customLangService: CustomLangTextService) {}

  ngOnInit(): void {
    this.calcState();
  }

  calcState(): void {
    const median = this.offersInfo.bankStatistics.allBanksStatistics
      .medianEffectiveRate;
    const totalEffectiveRate = this.offersInfo.totalEffectiveRate;
    const z = this.calcZ;

    if (totalEffectiveRate === null) {
      return;
    }
    if (median + 2 * z < totalEffectiveRate) {
      this.state = 0;
    }
    if (
      median + z < totalEffectiveRate &&
      totalEffectiveRate <= median + 2 * z
    ) {
      this.state = 1;
    }
    if (median - z < totalEffectiveRate && totalEffectiveRate <= median + z) {
      this.state = 2;
    }
    if (
      median - 2 * z < totalEffectiveRate &&
      totalEffectiveRate <= median - z
    ) {
      this.state = 3;
    }
    if (totalEffectiveRate <= median - 2 * z) {
      this.state = 4;
    }
  }

  get rateBarPercentageInverted(): number {
    return 100 - this.rateBarPercentage.percentage;
  }

  get calcZ(): number {
    const medianEffectiveRate = this.offersInfo.bankStatistics
      .allBanksStatistics.medianEffectiveRate;
    const bestPercentileEffectiveRate = this.offersInfo.bankStatistics
      .allBanksStatistics.bestPercentileEffectiveRate;

    return (medianEffectiveRate - bestPercentileEffectiveRate) / 3;
  }

  get shouldShowAdditionalText(): boolean {
    return (
      this.offersInfo.offerSavingsType ===
        'SAVINGS_FIRST_YEAR_BETWEEN_0_AND_2000' ||
      this.offersInfo.offerSavingsType ===
        'SAVINGS_FIRST_YEAR_BETWEEN_2000_AND_6000'
    );
  }

  get text(): string | undefined {
    const baseText = this.baseTextArray[this.state];
    const fullText = `${this.baseTextArray[this.state]}, ${
      this.additionalTextArray[this.state]
    }`;
    return this.shouldShowAdditionalText ? fullText : baseText;
  }

  get rateBarPercentage(): RateBar {
    switch (this.state) {
      case 4: {
        return {
          percentage: 95,
          class: 'level-5',
          hex: '#18bc9c'
        };
        break;
      }
      case 3: {
        return {
          percentage: 75,
          class: 'level-4',
          hex: '#82C6B4'
        };
        break;
      }
      case 2: {
        return {
          percentage: 50,
          class: 'level-3',
          hex: '#ff5a00 '
        };
        break;
      }
      case 1: {
        return {
          percentage: 30,
          class: 'level-2',
          hex: '#E45A2A'
        };
        break;
      }
      case 0: {
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
}

interface RateBar {
  percentage: number;
  class: string;
  hex: string;
}
