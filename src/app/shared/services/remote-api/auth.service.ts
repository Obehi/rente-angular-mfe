import { LocalStorageService } from './../local-storage.service';
import { Injectable } from '@angular/core';
import { API_URL_MAP } from '@config/api-url-config';
import { GenericHttpService } from '@services/generic-http.service';
import { tap } from 'rxjs/operators';
import { storageName } from '@config/index';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: GenericHttpService,
    private localStorageService: LocalStorageService
  ) { }

  public loginWithToken(phone: string, token: string) {
    const url = `${API_URL_MAP.auth.base}${API_URL_MAP.auth.token}`;
    const data = {
      phone: phone.toString(),
      token
    };
    return this.http.post(url, data)
      .pipe(
        tap(this.handleLogin.bind(this))
      );
  }

  private handleLogin(userInfo) {
    console.log(userInfo);
    this.localStorageService.setObject(storageName.user, userInfo);

  }
}
