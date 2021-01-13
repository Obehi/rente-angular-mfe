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

  public loginForDemo() {
    const url = `${API_URL_MAP.auth.base}${API_URL_MAP.auth.demo}`;
    const data = {
      guid: '56bd15f7bcd54d1f916a1c88555af5c1'
    }
    return this.http.post(url, data).pipe(
      tap(this.handleLogin.bind(this))
    )
  }

  public loginWithToken(token: String) {
    const url = `${API_URL_MAP.auth.base}${API_URL_MAP.auth.token}`;
    const data = {
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
