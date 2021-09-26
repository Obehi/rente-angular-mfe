import { Injectable } from '@angular/core';
import { GenericHttpService } from '@services/generic-http.service';
import { API_URL_MAP } from '@config/api-url-config';
import { Observable, of } from 'rxjs';
import {
  BankOfferLocations,
  BankOfferPreview,
  offerOfficeDto
} from '@shared/models/bank';

@Injectable({
  providedIn: 'root'
})
export class ChangeBankServiceService {
  constructor(private http: GenericHttpService) {}

  public getBankOfferRequest(offerId: number): Observable<BankOfferPreview> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.bankOfferRequest.base}${API_URL_MAP.loan.bankOfferRequest.preview}/${offerId}`;
    return this.http.get(url);
  }

  public getBankOfferPreviewWithOffice(
    offerId: number,
    offerOffice: offerOfficeDto
  ): Observable<BankOfferPreview> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.bankOfferRequest.base}${API_URL_MAP.loan.bankOfferRequest.preview}/${offerId}`;
    return this.http.getWithParams(url, offerOffice);
  }

  public sendBankOfferRequest(offerId: number): Observable<any> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.bankOfferRequest.base}${API_URL_MAP.loan.bankOfferRequest.send}/${offerId}`;
    return of(true);
  }

  public sendBankOfferRequestV2(): Observable<void> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.bankOfferRequest.base}${API_URL_MAP.loan.bankOfferRequest.send}`;
    return this.http.post(url);
  }

  public sendAntiChurnRequest(): Observable<void> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.bankOfferRequest.base}${API_URL_MAP.loan.bankOfferRequest.send}`;
    return this.http.post(url);
  }

  public getBankOfferLocations(bank: string): Observable<BankOfferLocations> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.bankOfferRequest.base}/${bank}`;
    return this.http.get(url);
  }

  public sendBankOfferRequestWithOffice(
    offerId: number,
    offerOffice: offerOfficeDto
  ): Observable<void> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.bankOfferRequest.base}${API_URL_MAP.loan.bankOfferRequest.send}/${offerId}`;
    return this.http.post(url, offerOffice);
  }
}
