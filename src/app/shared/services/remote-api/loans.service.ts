import { Injectable } from '@angular/core';
import { API_URL_MAP } from '@config/api-url-config';
import { GenericHttpService } from '@services/generic-http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { locale } from '../../../config/locale/locale';

import {
  LoanUpdateInfoDto,
  SignicatLoanInfoDtoArray
} from '@shared/models/loans';

@Injectable({
  providedIn: 'root'
})
export class LoansService {
  constructor(private http: GenericHttpService) {}

  public getLoans() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.loans.base}`;
    return this.http.get(url);
  }

  public getBankGuide(id: string) {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.bankInfo}/${id}`;
    return this.http.get(url);
  }

  public getOffers() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.offers.base}`;
    return this.http.get(url);
  }

  public getOffersBanks() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.offers.base}${API_URL_MAP.loan.offers.bank}`;
    return this.http.get(url);
  }

  public updateNewOffers() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.offers.base}${API_URL_MAP.loan.newOffers}`;
    return this.http.post(url);
  }

  public getUsersMemberships() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.membership.base}`;
    return this.http.get(url);
  }

  public getAllMemberships() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.membership.base}${API_URL_MAP.loan.membership.all}`;
    return this.http.get(url);
  }

  public setUsersMemberships(membershipsArray) {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.membership.base}`;
    return this.http.put(url, membershipsArray);
  }

  public getMembershipTypes() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.membership.membershipTypes}`;
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

  mapClientAddressDto(r: any) {
    const dto = new ClientAddressDto();
    dto.totalPropertyValue = r.totalPropertyValue;
    dto.addresses = r.addresses.map((item) => {
      const a: AddressDto = Object.assign(new AddressDto(), item);
      a.useManualPropertyValue = item.useManualPropertyValue == true;
      return a;
    });
    return dto;
  }

  public updateApartmentSize(appartmentData) {
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

  public getLoanPreferences() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.preferences}`;
    return this.http.get(url);
  }

  public updateLoanPreferences(loanData) {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.preferences}`;
    return this.http.put(url, loanData);
  }

  public UpdateSignicatLoansInfo(
    signicatLoanInfoDtoArray: SignicatLoanInfoDtoArray
  ): Observable<any> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.loans.base}${API_URL_MAP.loan.loans.info}`;
    return this.http.put(url, signicatLoanInfoDtoArray);
  }

  public CreateSignicatLoansInfo(
    signicatLoanInfoDtoArray: SignicatLoanInfoDtoArray
  ): Observable<any> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.loans.base}${API_URL_MAP.loan.loans.info}`;
    return this.http.post(url, signicatLoanInfoDtoArray);
  }

  public getSignicatLoansInfo(): Observable<SignicatLoanInfoDtoArray> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.loans.base}${API_URL_MAP.loan.loans.info}`;
    return this.http.get(url);
  }

  public updateClientInfo(clientUpdateInfo: ClientUpdateInfo) {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.user.base}${API_URL_MAP.loan.user.info}`;
    return this.http.put(url, clientUpdateInfo);
  }

  public getClientInfo() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.loans.base}${API_URL_MAP.loan.user.info}`;
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

  public getAddressStatistics(id: number) {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.address}${API_URL_MAP.loan.statistics}/${id}`;
    return this.http.get(url);
  }

  public getLoanStatistics() {
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

export class LoanStateDto {
  isAddressNeeded: boolean;
  isAggregatedRateTypeFixed: boolean;
  loansPresent: boolean;
  lowerRateAvailable: boolean;
}

export class AddressDto {
  id: number;
  street: string;
  zip: string | null = null;
  apartmentSize: number;
  manualPropertyValue?: number | null = null;
  propertyType: string | null = null;
  estimatedPropertyValue?: number | null = null;
  useManualPropertyValue: boolean;
  commonDebt: number | null = null;
  message: string;
  error: boolean;
}

export class ClientAddressDto {
  addresses: AddressDto[];
  totalPropertyValue: number;
}

export class ConfirmationGetDto {
  email: string;
  name: string | null;
  bank: string;
  income: number | null;
  memberships: string[];
  apartmentSize: number;
  apartmentValue: number;
  availableMemberships: MembershipTypeDto[];
}

export class ConfirmationSetDto {
  memberships: string[];
  apartmentSize: number;
  email: string;
  income: number;
  name: string;
  address: AddressCreationDto;
  apartmentValue: number;
}

export class AddressCreationDto {
  apartmentSize: number;
  apartmentValue: number;
  propertyType: string;
  street: string;
  zip: string;
}

export class ClientUpdateInfo {
  address: AddressCreationDto;
  email: string;
  income: number;
  memberships: string[];
}
export class PreferencesDto {
  email: string;
  name: string;
  income: number;
  availableMemberships: MembershipTypeDto[];
  memberships: string[];
  communicationChannelType: string;
  receiveNewsEmails: boolean;
  checkRateReminderType: string;
  fetchCreditLinesOnly: boolean;
  noAdditionalProductsRequired: boolean;
  interestedInEnvironmentMortgages: boolean;
}

export class PreferencesUpdateDto {
  memberships: string[];
  checkRateReminderType: string;
  fetchCreditLinesOnly: boolean;
  noAdditionalProductsRequired: boolean;
  interestedInEnvironmentMortgages: boolean;
  email: string;
  income: string;
  receiveNewsEmails: boolean;
}

export class MembershipTypeDto {
  name: string;
  label: string;
}

export class EmailDto {
  checkRateReminderType: null | string;
  receiveNewsEmails: false | true;
}
