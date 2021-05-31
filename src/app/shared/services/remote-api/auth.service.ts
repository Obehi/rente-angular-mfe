import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API_URL_MAP } from '@config/api-url-config';
import { storageName } from '@config/index';
import { GenericHttpService } from '@services/generic-http.service';
import { tap } from 'rxjs/operators';
import { LocalStorageService } from './../local-storage.service';
import { CustomLangTextService } from '@services/custom-lang-text.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedOutSubject = new BehaviorSubject<string>('LoggedIn');
  constructor(
    private http: GenericHttpService,
    private localStorageService: LocalStorageService,
    private router: Router,
    public customLangTextService: CustomLangTextService
  ) {}

  public get isLoggedIn(): boolean {
    const user = this.localStorageService.getObject(storageName.user);
    return !!(user && user.token);
  }

  public loginForDemo(guid: string) {
    const url = `${API_URL_MAP.auth.base}${API_URL_MAP.auth.demo}`;
    const data = {
      guid: guid
    };
    return this.http.post(url, data).pipe(tap(this.handleLogin.bind(this)));
  }

  public loginWithToken(token: string) {
    const url = `${API_URL_MAP.auth.base}${API_URL_MAP.auth.token}`;
    const data = {
      token
    };
    return this.http.post(url, data).pipe(tap(this.handleLogin.bind(this)));
  }

  public logout() {
    const url = `${API_URL_MAP.auth.base}${API_URL_MAP.auth.logout}`;

    this.http.post(url, {}).subscribe(() => {
      this.loggedOutSubject.next('LoggedOut');
      this.router.navigate(['/']);
      this.localStorageService.clear();
    });
  }

  public get logoutSubject(): BehaviorSubject<string> {
    return this.loggedOutSubject;
  }

  public getFirstTimeLoanToken(debtData) {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.firstLoan}`;
    return this.http.post(url, debtData);
  }

  private handleLogin(userInfo) {
    this.localStorageService.setObject(storageName.user, userInfo);
  }
}
