import { LocalStorageService } from './../local-storage.service';
import { Injectable } from '@angular/core';
import { API_URL_MAP } from '@config/api-url-config';
import { GenericHttpService } from '@services/generic-http.service';
import { tap } from 'rxjs/operators';
import { storageName } from '@config/index';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: GenericHttpService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  public loginWithToken(phone: string, token: string, country: string) {
    const url = `${API_URL_MAP.auth.base}${API_URL_MAP.auth.token}`;
    const data = {
      identifier: phone.toString(),
      country: country,
      token
    };
    return this.http.post(url, data)
      .pipe(
        tap(this.handleLogin.bind(this))
      );
  }

  public logout() {
    const url = `${API_URL_MAP.auth.base}${API_URL_MAP.auth.logout}`;

    this.http.post(url, {}).subscribe(res => {
      this.router.navigate(['/']);
      this.localStorageService.clear();
    });
  }

  public get isLoggedIn() {
    const user = this.localStorageService.getObject(storageName.user);
    return user && user.token ? true : false;
  }

  private handleLogin(userInfo) {
    this.localStorageService.setObject(storageName.user, userInfo);
  }
}
