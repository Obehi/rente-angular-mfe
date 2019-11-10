import { Injectable } from '@angular/core';
import { GenericHttpService } from '@services/generic-http.service';
import { API_URL_MAP } from '@config/api-url-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoansService {

  constructor(private http: GenericHttpService) { }

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

  public getAddresses():Observable<any> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.address}`;
    return this.http.get(url);
  }

  public updateAddress(addressData) {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.address}`;
    return this.http.put(url, addressData);
  }

  public updateApartmentSize(appartmentData) {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.address}${API_URL_MAP.loan.size}`;
    return this.http.put(url, appartmentData);
  }

  public setConfirmationData(confirmationData) {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.confirmation}`;
    return this.http.post(url, confirmationData);
  }

  public getLoanPreferences() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.preferences}`;
    return this.http.get(url);
  }

  public updateLoanPreferences(loanData) {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.preferences}`;
    return this.http.put(url, loanData);
  }

  public getPropertyValue():Observable<any> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.property}${API_URL_MAP.loan.value}`;
    return this.http.get(url);
  }
  public getEstimatedPropertValue():Observable<any> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.property}${API_URL_MAP.loan.estimatedValue}`;
    return this.http.get(url);
  }

  public getLoansAndRateType() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.loans.base}${API_URL_MAP.loan.loans.state}`;
    return this.http.get(url);
  }

  public getExtendedInfo() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.property}${API_URL_MAP.loan.extendedInfo}`;
    return this.http.get(url);
  }
}
