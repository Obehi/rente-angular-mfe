import { Injectable } from '@angular/core';
import { API_URL_MAP } from '@config/api-url-config';
import { GenericHttpService } from '@services/generic-http.service';
import {
  AddressDto,
  AddressStatisticsDto,
  ClientAddressDto,
  ClientUpdateInfo,
  ConfirmationGetDto,
  ConfirmationSetDto,
  Loans,
  LoanStateDto,
  LoanStatisticsDto
} from '@shared/models/loans';
import { BankGuideInfo, Offers } from '@shared/models/offers';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { locale } from '../../../config/locale/locale';

import { LoanUpdateInfoDto } from '@shared/models/loans';
import { NewOffers, OffersBank } from '@models/bank';

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
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.offers.base}`;
    return this.http.get(url);
  }

  public getOffersBanks(): Observable<OffersBank> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.offers.base}${API_URL_MAP.loan.offers.bank}`;
    return this.http.get(url);
  }

  public updateNewOffers(): Observable<NewOffers[]> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.offers.base}${API_URL_MAP.loan.newOffers}`;
    return this.http.post(url);
  }

  // Not used yet!
  public getUsersMemberships(): Observable<{ memberships: string[] }> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.membership}`;
    return this.http.get(url);
  }

  // Also not used!
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public setUsersMemberships(membershipsArray): Observable<any> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.membership}`;
    return this.http.post(url, membershipsArray);
  }

  // Also not used!
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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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

  // Not used yet!
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

  public updateLoanUserInfo(
    loanUpdateInfoDto: LoanUpdateInfoDto
  ): Observable<void> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.loan.base}${API_URL_MAP.loan.loan.info}`;
    return this.http.put(url, loanUpdateInfoDto);
  }

  public updateClientInfo(
    clientUpdateInfo: ClientUpdateInfo
  ): Observable<void> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.user.base}${API_URL_MAP.loan.user.info}`;
    return this.http.put(url, clientUpdateInfo);
  }

  // Change this after merging
  public getClientInfo(): Observable<any> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.base}${API_URL_MAP.loan.user.info}`;
    return this.http.get(url);
  }

  // Not used yet, but do not delete!
  public getPropertyValue(): Observable<any> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.property}${API_URL_MAP.loan.value}`;
    return this.http.get(url);
  }

  // Not used yet, but do not delete!
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

  public getAddressStatistics(id: number): Observable<AddressStatisticsDto> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.address}${API_URL_MAP.loan.statistics}/${id}`;
    return this.http.get(url);
  }

  // Not used!
  public getLoanStatistics(): Observable<LoanStatisticsDto> {
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

  public confirmLowerRate(): Observable<void> {
    const url = `${API_URL_MAP.loan.base}/lower-rate/confirm`;
    return this.http.post(url, null);
  }
}
