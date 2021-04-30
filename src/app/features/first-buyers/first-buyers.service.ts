import { Injectable } from '@angular/core';
import { AuthService } from '@services/remote-api/auth.service';
import {
  LoansService,
  MembershipTypeDto
} from '@services/remote-api/loans.service';
import { LocalStorageService } from '@services/local-storage.service';
import { Observable } from 'rxjs';
import { InitialOffersComponent } from './components/initial-offers/initial-offers.component';

export interface FirstBuyersState {
  outstandingDebt: number | null;
  income?: number;
}
@Injectable({
  providedIn: 'root'
})
export class FirstBuyersService {
  selectedMemberships: MembershipTypeDto[] = [];

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private iOffers: InitialOffersComponent
  ) {}

  get offerValue(): FirstBuyersState {
    return this.localStorageService.getObject(
      'firstBuyersOfferValue'
    ) as FirstBuyersState;
  }
  set offerValue(offerValue: FirstBuyersState) {
    this.localStorageService.setObject('firstBuyersOfferValue', offerValue);
  }

  setOffersValue(offerValue: FirstBuyersState): void {
    this.localStorageService.setObject('firstBuyersOfferValue', offerValue);
  }

  getOffersValue(): FirstBuyersState {
    return this.localStorageService.getObject(
      'firstBuyersOfferValue'
    ) as FirstBuyersState;
  }

  getAuthToken(debtData: any): Observable<any> {
    return this.authService.getFirstTimeLoanToken(debtData);
  }

  getSelectedMemberships(): Observable<any> {
    return this.iOffers.getSelectMemberships();
  }
}
