import { Injectable } from '@angular/core';
import { OFFER_SAVINGS_TYPE } from '../../../../config/loan-state';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  getRatingNumberFromLoanState(loanState: string) {
    switch (loanState) {
      case OFFER_SAVINGS_TYPE.SAVINGS_FIRST_YEAR_GREATER_10000:
        return 1;

      case OFFER_SAVINGS_TYPE.SAVINGS_FIRST_YEAR_BETWEEN_6000_AND_10000:
        return 2;

      case OFFER_SAVINGS_TYPE.SAVINGS_FIRST_YEAR_BETWEEN_2000_AND_6000:
        return 3;

      case OFFER_SAVINGS_TYPE.SAVINGS_FIRST_YEAR_BETWEEN_0_AND_2000:
        return 4;
      case OFFER_SAVINGS_TYPE.NO_SAVINGS:
        return 5;

      default:
        return 0;
    }
  }
}
