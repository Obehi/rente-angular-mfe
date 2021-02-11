import { Injectable } from '@angular/core';
import { AuthService } from '@services/remote-api/auth.service';
import { MembershipTypeDto } from '@services/remote-api/loans.service';
import { forkJoin, Observable } from 'rxjs';
import { LocalStorageService } from '@services/local-storage.service';
import { FirstBuyersModule } from './first-buyers.module';

export interface FirstBuyersState {
  outstandingDebt?: number;
  income?: number;
}
@Injectable({
  providedIn: 'root'
})
export class FirstBuyersService {
  offerValue: FirstBuyersState;
  selectedMemberships: MembershipTypeDto[] = [];

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {
    console.log('FirstBuyersService');
  }

  get bar(): FirstBuyersState {
    return this.localStorageService.getObject(
      'firstBuyersOfferValue'
    ) as FirstBuyersState;
  }
  set bar(offerValue: FirstBuyersState) {
    this.localStorageService.setObject('firstBuyersOfferValue', offerValue);
    const test = this.localStorageService.getItem(
      'firstBuyersOfferValue'
    ) as FirstBuyersState;
  }

  setOffersValue(offerValue: FirstBuyersState) {
    console.log('offerValue');
    console.log(offerValue);
    this.localStorageService.setObject('firstBuyersOfferValue', offerValue);
    const test = this.localStorageService.getItem(
      'firstBuyersOfferValue'
    ) as FirstBuyersState;
  }

  getOffersValue(): FirstBuyersState {
    return this.localStorageService.getObject(
      'firstBuyersOfferValue'
    ) as FirstBuyersState;
  }

  getAuthToken(debtData) {
    return this.authService.getFirstTimeLoanToken(debtData);
  }
}
