import { Injectable } from '@angular/core';
import { API_URL_MAP } from '@config/api-url-config';
import { GenericHttpService } from '@services/generic-http.service';
import {
  AddressDto,
  ClientAddressDto,
  ClientUpdateInfo,
  ConfirmationGetDto,
  ConfirmationSetDto,
  Loans,
  LoanStateDto,
  PreferencesDto,
  PreferencesUpdateDto
} from '@shared/models/loans';
import { BankGuideInfo, Offers } from '@shared/models/offers';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { locale } from '../../../config/locale/locale';

import { LoanUpdateInfoDto } from '@shared/models/loans';

@Injectable({
  providedIn: 'root'
})
export class LoansService {
  constructor(private http: GenericHttpService) {}

  public getLoans(): Observable<Loans> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.loans.base}`;
    return this.http.get(url);
  }

  public getBankGuide(id: string): Observable<BankGuideInfo> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.bankInfo}/${id}`;
    return this.http.get(url);
  }

  public getOffers(): Observable<Offers> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.offers}`;
    return this.http.get(url);
  }

  public getOffersBanks() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.offers.base}${API_URL_MAP.loan.offers.bank}`;
    return this.http.get(url);
  }

  public updateNewOffers(): Observable<Offers> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.offers}${API_URL_MAP.loan.newOffers}`;
    return this.http.post(url);
  }

  public getUsersMemberships(): Observable<string[]> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.membership}`;
    return this.http.get(url);
  }

  public setUsersMemberships(membershipsArray): Observable<string[]> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.membership}`;
    return this.http.post(url, membershipsArray);
  }

  public getMembershipTypes(): Observable<any> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.membershipTypes}`;
    return this.http.get(url);
  }

  public getAddresses(): Observable<ClientAddressDto> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.address}`;
    return this.http.get(url).pipe(map((r) => this.mapClientAddressDto(r)));
  }

  public updateAddress(addresses: AddressDto[]): Observable<ClientAddressDto> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.address}`;

    return this.http
      .post(url, addresses)
      .pipe(map((r) => this.mapClientAddressDto(r)));
  }

  mapClientAddressDto(r: any): ClientAddressDto {
    const dto = new ClientAddressDto();
    dto.totalPropertyValue = r.totalPropertyValue;
    dto.addresses = r.addresses.map((item) => {
      const a: AddressDto = Object.assign(new AddressDto(), item);
      a.useManualPropertyValue = item.useManualPropertyValue === true;
      return a;
    });
    return dto;
  }

  public updateApartmentSize(
    appartmentData: AddressDto
  ): Observable<AddressDto> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.address}${API_URL_MAP.loan.size}`;
    return this.http.put(url, appartmentData);
  }

  public getConfirmationData(): Observable<ConfirmationGetDto> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.confirmation}`;
    return this.http.get(url);
  }

  public setConfirmationData(
    dto: ConfirmationSetDto
  ): Observable<ConfirmationSetDto> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.confirmation}`;
    return this.http.post(url, dto); // TODO: Object.assign()
  }

  // TODO: create a loanPreference?
  public getLoanPreferences(): Observable<any> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.preferences}`;
    return this.http.get(url);
  }

  public updateLoanPreferences(loanData): Observable<any> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.preferences}`;
    return this.http.put(url, loanData);
  }

  public updateLoanUserInfo(loanUpdateInfoDto: LoanUpdateInfoDto) {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.loan.base}${API_URL_MAP.loan.loan.info}`;
    return this.http.put(url, loanUpdateInfoDto);
  }

  public updateClientInfo(clientUpdateInfo: ClientUpdateInfo) {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.user.base}${API_URL_MAP.loan.user.info}`;
    return this.http.put(url, clientUpdateInfo);
  }

  public getClientInfo() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.base}${API_URL_MAP.loan.user.info}`;
    return this.http.get(url);
  }

  public getPropertyValue(): Observable<any> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.property}${API_URL_MAP.loan.value}`;
    return this.http.get(url);
  }

  public getEstimatedPropertValue(): Observable<any> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.property}${API_URL_MAP.loan.estimatedValue}`;
    return this.http.get(url);
  }

  public getLoansAndRateType(): Observable<LoanStateDto> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.loans.base}${API_URL_MAP.loan.loans.state}`;
    return this.http
      .get(url)
      .pipe(map((res) => Object.assign(new LoanStateDto(), res)));
  }

  public getAddressStatistics(id: number): Observable<any> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.address}${API_URL_MAP.loan.statistics}/${id}`;
    return this.http.get(url);
  }

  public getLoanStatistics(): Observable<any> {
    let country;
    if (locale.includes('sv')) {
      country = 'SWE';
    } else if (locale.includes('nb')) {
      country = 'NOR';
    }
    const params = { country: country };
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.statistics}`;

    return this.http.getWithParams(url, params);
  }

  public confirmLowerRate(): Observable<any> {
    const url = `${API_URL_MAP.loan.base}/lower-rate/confirm`;
    return this.http.post(url, null);
  }

  // Preferences

  getPreferencesDto(): Observable<PreferencesDto> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.preferences}`;
    return this.http.get(url);
  }

  updateUserPreferences(
    dto: PreferencesUpdateDto
  ): Observable<PreferencesUpdateDto> {
    const url = `${API_URL_MAP.loan.base}/preferences`;
    return this.http.post(url, dto);
  }
}
