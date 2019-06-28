import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { storageName } from '@config/index';
import { LocalStorageService } from '@services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GenericHttpService {
  private apiUrl: string;
  private deafultContentType: any = {
    name: 'Content-Type',
    value: 'application/json;charset=utf-8'
  };
  private deafultAcceptType: any = {
    name: 'Accept',
    value: 'application/json, text/plain, */*'
  };

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router
    ) {
      this.apiUrl = environment.baseUrl;
    }

  public get(path: string, searchParams: any = {}): Observable<any> {
    const fullPath = `${this.apiUrl}${path}`;
    const params: HttpParams = new HttpParams({
      fromObject: searchParams
    });

    const httpOptions = {
      headers: this.shapeHeaders(),
      withCredentials: true,
      params: {...params}
    };

    return this.http
      .get(fullPath, httpOptions)
      .pipe(
        catchError((error) => this.handleError(error))
      );
  }

  public post(path: string, body: object = {}): Observable<any> {
    const fullPath = `${this.apiUrl}${path}`;

    const jsonBody: string = JSON.stringify(body);
    const httpOptions = {
      headers: this.shapeHeaders()
    };

    return this.http.post(fullPath, jsonBody, httpOptions)
      .pipe(
        catchError((error) => this.handleError(error))
      );
  }

  public del(path: string): Observable<any> {
    const fullPath = `${this.apiUrl}${path}`;

    const httpOptions = {
      headers: this.shapeHeaders()
    };

    return this.http.delete(fullPath, httpOptions)
      .pipe(
        catchError((error) => this.handleError(error))
      );
  }

  public put(path: string, body: object = {}): Observable<any> {
    const fullPath = `${this.apiUrl}${path}`;

    const jsonBody: string = JSON.stringify(body);
    const httpOptions = {
      headers: this.shapeHeaders()
    };

    return this.http
      .put(fullPath, jsonBody, httpOptions)
      .pipe(
        catchError((error) => this.handleError(error))
      );
  }

  private shapeHeaders(): HttpHeaders {
    // const accessToken: string = this.cookiesService
    //   .getCookie(config.accessTokenKey);
    const headers: HttpHeaders = new HttpHeaders()
      .set(this.deafultContentType.name, this.deafultContentType.value);
      // .set(this.deafultAcceptType.name, this.deafultAcceptType.value);

    // if (Boolean(accessToken)) {
    //   headers = headers.append('Authorization', `Bearer ${accessToken}`);
    // }

    return headers;
  }

  private handleError(responseError: HttpResponse<any> | any): Observable<any> {
    console.log(responseError);
    // || !this.cookieService.getCookie('JSESSIONID')
    if (responseError.status === 401) {
      // TODO: Show unauthorized error
      console.log('Not logged in!');
      this.clearSession();
    }

    return throwError(responseError.error);
  }

  private clearSession(): void {
    this.localStorageService.clear();
    // this.cookiesService.deleteCookie('JSESSIONID');
    // this.cookiesService.deleteCookie('SESSION');
    this.router.navigate(['/auth']);
  }
}
