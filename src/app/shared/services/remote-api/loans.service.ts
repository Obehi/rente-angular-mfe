import { Injectable } from '@angular/core';
import { GenericHttpService } from '@services/generic-http.service';
import { API_URL_MAP } from '@config/api-url-config';

@Injectable({
  providedIn: 'root'
})
export class LoansService {

  constructor(private http: GenericHttpService) { }

  public getLoans() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.loans}`;
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

  public getAddresses() {
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

  public getPropertValue() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.property}${API_URL_MAP.loan.value}`;
    return this.http.get(url);
  }
}
