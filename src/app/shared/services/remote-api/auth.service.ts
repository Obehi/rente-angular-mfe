import { Injectable } from '@angular/core';
import { API_URL_MAP } from '@config/api-url-config';
import { GenericHttpService } from '@services/generic-http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: GenericHttpService
  ) { }

  public loginWithToken(phone: string, token: string) {
    const url = `${API_URL_MAP.auth.base}${API_URL_MAP.auth.token}`;
    const data = {
      phone: phone.toString(),
      token
    };
    return this.http.post(url, data);
  }
}
