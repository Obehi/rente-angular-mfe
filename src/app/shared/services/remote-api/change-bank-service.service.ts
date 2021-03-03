import { Injectable } from '@angular/core';
import { GenericHttpService } from '@services/generic-http.service';
import { API_URL_MAP } from '@config/api-url-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangeBankServiceService {
  constructor(private http: GenericHttpService) {}

  public getBankOfferRequest(offerId): Observable<any> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.bankOfferRequest.base}${API_URL_MAP.loan.bankOfferRequest.preview}/${offerId}`;
    return this.http.get(url);
  }

  public sendBankOfferRequest(offerId): Observable<any> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.bankOfferRequest.base}${API_URL_MAP.loan.bankOfferRequest.send}/${offerId}`;
    return this.http.post(url);
  }

  public getBankOfferLocations(bank): Observable<any> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.bankOfferRequest.base}/${bank}`;
    return this.http.get(url);
  }
}
