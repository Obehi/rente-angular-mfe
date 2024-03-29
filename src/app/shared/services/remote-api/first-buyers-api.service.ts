/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_MAP } from '../../../config/api-url-config';
import { GenericHttpService } from '../generic-http.service';

@Injectable({
  providedIn: 'root'
})
export class FirstBuyersAPIService {
  constructor(private http: GenericHttpService) {}

  // Not used yet!
  public updateInterestedFixedRate(dto: number): Observable<void> {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.interestedFixedRate}`;
    return this.http.put(url, { interestedFixedRate: dto });
  }

  public updateQualify4Blu(dto: boolean): Observable<void> {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.qualify4Blu}`;
    return this.http.put(url, { qualify4Blu: dto });
  }

  public updateSavings(dto: number): Observable<void> {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.savings}`;
    return this.http.put(url, { savings: dto });
  }

  public updateOtherDebt(dto): Observable<void> {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.otherDebt}`;
    return this.http.put(url, { otherDept: dto });
  }

  public updateIncome(dto: number): Observable<void> {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.income}`;
    return this.http.put(url, { income: dto });
  }

  public updateBirthdate(dto: string): Observable<void> {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.birthdate}`;
    return this.http.put(url, { birthdate: dto ? '01.01.1975' : '01.01.1995' });
  }

  public updateMembership(dto: string[]): Observable<void> {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.membership}`;
    return this.http.put(url, { memberships: dto });
  }

  public updateLoanSubType(dto): Observable<void> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.loanSubType}`;
    return this.http.put(url, { loanSubType: dto });
  }

  public updateLoanType(dto): Observable<void> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.loanType}`;
    return this.http.put(url, { loanType: dto });
  }

  public updateRemainingYears(dto: number): Observable<void> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.remainingYears}`;
    return this.http.put(url, { remainingYears: dto });
  }

  public updateOutstandingDebt(dto: number): Observable<void> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.outstandingDebt}`;
    return this.http.put(url, { outstandingDebt: dto });
  }

  public updatelocalOffers(dto: boolean): Observable<void> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.localOffers}`;
    return this.http.put(url, { showLocalOffers: dto });
  }
}
