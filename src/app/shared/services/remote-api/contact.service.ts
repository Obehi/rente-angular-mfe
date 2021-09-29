import { Injectable } from '@angular/core';
import { GenericHttpService } from '@services/generic-http.service';
import { API_URL_MAP } from '@config/api-url-config';
import { Observable } from 'rxjs';
import { UserContactUsForm } from '@shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private http: GenericHttpService) {}

  public sendContactForm(contactForm: UserContactUsForm): Observable<void> {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.communication.base}${API_URL_MAP.user.communication.contactUs}`;
    return this.http.post(url, contactForm);
  }

  // This isnt used anywhere yet!
  public getMissingBanks(): Observable<any> {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.communication.base}${API_URL_MAP.user.communication.missingBanks}`;
    return this.http.get(url);
  }

  public sendMissingBank(missingBankData: {
    email: string;
    bank: string;
  }): Observable<void> {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.communication.base}${API_URL_MAP.user.communication.missingBanks}`;
    return this.http.post(url, missingBankData);
  }
}
