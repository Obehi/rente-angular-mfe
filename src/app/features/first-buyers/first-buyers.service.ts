import { Injectable } from '@angular/core';
import { AuthService } from '@services/remote-api/auth.service';
import { MembershipTypeDto } from '@services/remote-api/loans.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable()
export class FirstBuyersService {

  offerValue: { outstandingDebt: number; income: number; };
  selectedMemberships: MembershipTypeDto[] = [];

  constructor(private authService: AuthService) {

  }

  getAuthToken(debtData) {
    return this.authService.getFirstTimeLoanToken(debtData);
  }

}


