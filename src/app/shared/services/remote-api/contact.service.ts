import { Injectable } from '@angular/core';
import { GenericHttpService } from '@services/generic-http.service';
import { API_URL_MAP } from '@config/api-url-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private http: GenericHttpService) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public sendContactForm(contactForm): Observable<any> {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.communication.base}${API_URL_MAP.user.communication.contactUs}`;
    return this.http.post(url, contactForm);
  }

  public getMissingBanks(): Observable<any> {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.communication.base}${API_URL_MAP.user.communication.missingBanks}`;
    return this.http.get(url);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public sendMissingBank(missingBankData): Observable<any> {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.communication.base}${API_URL_MAP.user.communication.missingBanks}`;
    return this.http.post(url, missingBankData);
  }
}
