import { Injectable } from '@angular/core';
import { GenericHttpService } from '@services/generic-http.service';
import { API_URL_MAP } from '@config/api-url-config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoansService {
  constructor(private http: GenericHttpService) {}

  public getLoans() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.loans.base}`;
    return this.http.get(url);
  }

  public getOffers() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.offers}`;
    return this.http.get(url);
  }

  public getUsersMemberships() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.membership}`;
    return this.http.get(url);
  }

  public setUsersMemberships(membershipsArray) {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.membership}`;
    return this.http.post(url, membershipsArray);
  }

  public getMembershipTypes() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.membershipTypes}`;
    return this.http.get(url);
  }

  public getAddresses(): Observable<ClientAddressDto> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.address}`;
    return this.http.get(url).pipe(map(r => this.mapClientAddressDto(r)));
  }

  public updateAddress(addresses: AddressDto[]): Observable<ClientAddressDto> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.address}`;

    return this.http
      .post(url, addresses)
      .pipe(map(r => this.mapClientAddressDto(r)));
  }

  mapClientAddressDto(r: any) {
    const dto = new ClientAddressDto();
    dto.totalPropertyValue = r.totalPropertyValue;
    dto.addresses = r.addresses.map(item => {
      let a: AddressDto = Object.assign(new AddressDto(), item);
      a.useManualPropertyValue = item.useManualPropertyValue == true;
      return a;
    });
    return dto;
  }

  public updateApartmentSize(appartmentData) {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.address}${API_URL_MAP.loan.size}`;
    return this.http.put(url, appartmentData);
  }

  public getConfirmationData():Observable<ConfirmationGetDto> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.confirmation}`;
    return this.http.get(url);
  }

  public setConfirmationData(dto:ConfirmationSetDto):Observable<ConfirmationSetDto> {
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
      .pipe(map(res => Object.assign(new LoanStateDto(), res)));
  }

  public getAddressStatistics(id: number) {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.address}${API_URL_MAP.loan.statistics}/${id}`;
    return this.http.get(url);
  }

  public getLoanStatistics() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.statistics}`;
    return this.http.get(url);
  }

  public confirmLowerRate(): Observable<any> {
    const url = `${API_URL_MAP.loan.base}/lower-rate/confirm`;
    return this.http.post(url, null);
  }

  // Preferences

  getPreferencesDto():Observable<PreferencesDto> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.preferences}`;
    return this.http.get(url);
  }

  updateUserPreferences(dto:PreferencesUpdateDto):Observable<PreferencesUpdateDto> {
    const url = `${API_URL_MAP.loan.base}/preferences`;
    return this.http.post(url, dto);
  }
}

export class LoanStateDto {
  isAggregatedRateTypeFixed: boolean;
  loansPresent: boolean;
  lowerRateAvailable: boolean;
}

export class AddressDto {
  id: number;
  street: string;
  zip: string;
  apartmentSize: number;
  manualPropertyValue: number;
  estimatedPropertyValue: number;
  useManualPropertyValue: boolean;
  commonDebt: number;
  message: string;
}

export class ClientAddressDto {
  addresses: AddressDto[];
  totalPropertyValue: number;
}

export class ConfirmationGetDto {
  email:string;
  name:string;
  income:number;
  memberships:string[];
  apartmentSize:number;
  availableMemberships:MembershipTypeDto[];
}

export class ConfirmationSetDto {
  memberships:string[];
  apartmentSize:number;
  email:string;
  income:number;
}

export class PreferencesDto {
  email:string;
  name:string;
  income:number;
  availableMemberships:MembershipTypeDto[];
  memberships:string[];
  communicationChannelType:string;
  receiveNewsEmails: boolean;
  checkRateReminderType:string;
  fetchCreditLinesOnly:boolean;
  noAdditionalProductsRequired:boolean;
  interestedInEnvironmentMortgages:boolean;
}

export class PreferencesUpdateDto {
  memberships:string[];
  checkRateReminderType:string;
  fetchCreditLinesOnly:boolean;
  noAdditionalProductsRequired:boolean;
  interestedInEnvironmentMortgages:boolean;
  email:string;
  income:string;
  receiveNewsEmails: boolean;
}

export class MembershipTypeDto {
  name:string;
  label:string;
}

export class EmailDto  {
  checkRateReminderType: null | string;
  receiveNewsEmails: false | true;
}

