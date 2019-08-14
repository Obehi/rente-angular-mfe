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

      case LOAN_STATE_MAP.SAVINGS_FIRST_YEAR_GREATER_10000:
        return 1;

      case LOAN_STATE_MAP.SAVINGS_FIRST_YEAR_BETWEEN_6000_AND_10000:
        return 2;

      case LOAN_STATE_MAP.SAVINGS_FIRST_YEAR_BETWEEN_2000_AND_6000:
        return 3;

      case LOAN_STATE_MAP.SAVINGS_FIRST_YEAR_BETWEEN_0_AND_2000:
        return 4;
      case LOAN_STATE_MAP.NO_SAVINGS:
        return 5;

      default:
        return 0;
    }
  }
}
