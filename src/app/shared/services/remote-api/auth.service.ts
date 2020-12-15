import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API_URL_MAP } from '@config/api-url-config';
import { storageName } from '@config/index';
import { GenericHttpService } from '@services/generic-http.service';
import { tap } from 'rxjs/operators';
import { LocalStorageService } from './../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: GenericHttpService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
  }

  public get isLoggedIn() {
    const user = this.localStorageService.getObject(storageName.user);
    return !!(user && user.token);
  }

  public loginWithToken(token: String) {
    const url = `${API_URL_MAP.auth.base}${API_URL_MAP.auth.token}`;
    const data = {
      token
    };
    return this.http.post(url, data)
      .pipe(tap(this.handleLogin.bind(this)));
  }

  public logout() {
    const url = `${API_URL_MAP.auth.base}${API_URL_MAP.auth.logout}`;

    this.http.post(url, {})
      .subscribe(res => {
        this.router.navigate(['/']);
        this.localStorageService.clear();
      });
  }

  public getFirstTimeLoanToken(debtData) {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.firstLoan}`;
    return this.http.post(url, debtData);
  }

  private handleLogin(userInfo) {
    this.localStorageService.setObject(storageName.user, userInfo);
  }
}
