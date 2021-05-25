import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API_URL_MAP } from '@config/api-url-config';
import { storageName } from '@config/index';
import { GenericHttpService } from '@services/generic-http.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LocalStorageService } from './../local-storage.service';
import { DemoUserInfo, FirstTimeLoanDebtData } from '@shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: GenericHttpService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  public get isLoggedIn(): boolean {
    const user = this.localStorageService.getObject(storageName.user);
    return !!(user && user.token);
  }

  public loginForDemo(guid: string): Observable<DemoUserInfo> {
    const url = `${API_URL_MAP.auth.base}${API_URL_MAP.auth.demo}`;
    const data = {
      guid: guid
    };
    return this.http.post(url, data).pipe(tap(this.handleLogin.bind(this)));
  }

  public loginBankIdStep1(): Observable<any> {
    const url = `${API_URL_MAP.auth.base}${API_URL_MAP.auth.bankidLogin}`;
    return this.http.post(url);
  }

  public loginBankIdStep2(sessionId: string, bank: string): Observable<any> {
    const url = `${API_URL_MAP.auth.base}${API_URL_MAP.auth.bankidLogin}/${sessionId}`;

    const data = {
      bank: bank
    };

    return this.http
      .postWithParams(url, data)
      .pipe(tap(this.handleLogin.bind(this)));
  }

  public loginWithToken(token: string): Observable<DemoUserInfo> {
    const url = `${API_URL_MAP.auth.base}${API_URL_MAP.auth.token}`;
    const data = {
      token
    };
    return this.http.post(url, data).pipe(tap(this.handleLogin.bind(this)));
  }

  public logout(): void {
    const url = `${API_URL_MAP.auth.base}${API_URL_MAP.auth.logout}`;

    this.http.post(url, {}).subscribe(() => {
      this.router.navigate(['/']);
      this.localStorageService.clear();
    });
  }

  public getFirstTimeLoanToken(
    debtData: FirstTimeLoanDebtData
  ): Observable<{ token: string }> {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.firstLoan}`;
    return this.http.post(url, debtData);
  }

  private handleLogin(userInfo) {
    this.localStorageService.setObject(storageName.user, userInfo);
  }
}
