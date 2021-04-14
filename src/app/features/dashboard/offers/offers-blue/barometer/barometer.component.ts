import { Component, Input, OnInit } from '@angular/core';
import { OFFER_SAVINGS_TYPE } from '@config/loan-state';
import { Offers } from '../../../../../shared/models/offers';

@Component({
  selector: 'barometer',
  templateUrl: './barometer.component.html',
  styleUrls: ['./barometer.component.scss']
})
export class BarometerComponent implements OnInit {
  @Input() offersInfo: Offers;
  @Input() offerSavingsType = OFFER_SAVINGS_TYPE;

  constructor() {}

  ngOnInit() {
    console.log(this.offerSavingsType);
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
}

interface RateBar {
  percentage: number;
  class: string;
  hex: string;
}
