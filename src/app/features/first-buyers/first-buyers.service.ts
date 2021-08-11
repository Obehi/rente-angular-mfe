import { Injectable } from '@angular/core';
import { AuthService } from '@services/remote-api/auth.service';
import { MembershipTypeDto } from '@shared/models/loans';
import { LocalStorageService } from '@services/local-storage.service';
import { Observable } from 'rxjs';
import { FirstTimeLoanDebtData } from '@shared/models/user';

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
    private localStorageService: LocalStorageService
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

  getAuthToken(debtData: FirstTimeLoanDebtData): Observable<{ token: string }> {
    return this.authService.getFirstTimeLoanToken(debtData);
  }
}
