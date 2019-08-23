import { Injectable } from '@angular/core';
import { GenericHttpService } from '@services/generic-http.service';
import { API_URL_MAP } from '@config/api-url-config';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private http: GenericHttpService,
  ) { }

  public sendContactForm(contactForm) {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.communication.base}${API_URL_MAP.user.communication.contactUs}`;
    return this.http.post(url, contactForm);
  }

  public getMissingBanks() {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.communication.base}${API_URL_MAP.user.communication.missingBanks}`;
    return this.http.get(url);
  }

  public sendMissingBank(missingBankData) {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.communication.base}${API_URL_MAP.user.communication.missingBanks}`;
    return this.http.post(url, missingBankData);
  }
}
