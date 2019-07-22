import { LOAN_STATE_MAP } from './../../../config/loan-state';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  constructor() { }

  getRatingNumberFromLoanState(loanState: string) {
    switch (loanState) {
      case LOAN_STATE_MAP.NO_LOANS:
        return 0;

      case LOAN_STATE_MAP.NO_OFFERS:
        return 1;

      case LOAN_STATE_MAP.SAVINGS_FIRST_YEAR_BELOW_0:
        return 3;

      case LOAN_STATE_MAP.SAVINGS_FIRST_YEAR_BETWEEN_3000_AND_0:
        return 4;

      case LOAN_STATE_MAP.SAVINGS_FIRST_YEAR_GREATER_3000:
        return 5;

      default:
        return 0;
    }
  }
}
