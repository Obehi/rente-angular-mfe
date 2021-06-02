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
import { storageName } from '@config/index';
import { LocalStorageService } from '@services/local-storage.service';
import { SnackBarService } from './snackbar.service';
import { EnvService } from '@services/env.service';

@Injectable({
  providedIn: 'root'
})
export class GenericHttpService {
  private apiUrl: string;
  private deafultContentType: any = {
    name: 'Content-Type',
    value: 'application/json;charset=UTF-8'
  };
  private deafultAcceptType: any = {
    name: 'Accept',
    value: 'application/json, text/plain, */*'
  };

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router,
    private snackBar: SnackBarService,
    private envService: EnvService
  ) {
    this.apiUrl = this.envService.environment.baseUrl;
  }

  public get(path: string, searchParams: any = {}): Observable<any> {
    const fullPath = `${this.apiUrl}${path}`;
    const params: HttpParams = new HttpParams({
      fromObject: searchParams
    });

    const httpOptions = {
      headers: this.shapeHeaders(),
      withCredentials: true
    };

    return this.http
      .get(fullPath, httpOptions)
      .pipe(catchError((error) => this.handleError(error)));
  }

  public getWithParams(path: string, searchParams): Observable<any> {
    const fullPath = `${this.apiUrl}${path}`;

    const params: HttpParams = new HttpParams({ fromObject: searchParams });

    const httpOptions = {
      headers: this.shapeHeaders(),
      withCredentials: true,
      params: params
    };

    return this.http
      .get(fullPath, httpOptions)
      .pipe(catchError((error) => this.handleError(error)));
  }

  public postExternal(path: string, body: any = {}): Observable<any> {
    const fullPath = `${path}`;
    const jsonBody: string = JSON.stringify(body);

    let headers: HttpHeaders = new HttpHeaders();

    headers = headers.append('Content-Type', 'application/json');

    // responseType is text, json responses will not be approved
    const httpOptions = {
      headers: headers,
      responseType: 'text' as 'json'
    };

    return this.http
      .post(fullPath, jsonBody, httpOptions)
      .pipe(catchError((error) => this.handleError(error)));
  }

  public post(path: string, body: any = {}): Observable<any> {
    const fullPath = `${this.apiUrl}${path}`;

    const jsonBody: string = JSON.stringify(body);
    const httpOptions = {
      headers: this.shapeHeaders()
    };

    return this.http
      .post(fullPath, jsonBody, httpOptions)
      .pipe(catchError((error) => this.handleError(error)));
  }

  public postWithParams(path: string, searchParams: any): Observable<any> {
    const fullPath = `${this.apiUrl}${path}`;
    const params: HttpParams = new HttpParams({ fromObject: searchParams });

    const httpOptions = {
      headers: this.shapeHeaders(),
      withCredentials: true,
      params: params
    };

    return this.http
      .post(fullPath, null, httpOptions)
      .pipe(catchError((error) => this.handleError(error)));
  }

  public del(path: string): Observable<any> {
    const fullPath = `${this.apiUrl}${path}`;

    const httpOptions = {
      headers: this.shapeHeaders()
    };

    return this.http
      .delete(fullPath, httpOptions)
      .pipe(catchError((error) => this.handleError(error)));
  }

  public put(path: string, body: any = {}): Observable<any> {
    const fullPath = `${this.apiUrl}${path}`;

    const jsonBody: string = JSON.stringify(body);
    const httpOptions = {
      headers: this.shapeHeaders()
    };

    return this.http
      .put(fullPath, jsonBody, httpOptions)
      .pipe(catchError((error) => this.handleError(error)));
  }

  private shapeHeaders(): HttpHeaders {
    const userInfo = this.localStorageService.getObject(storageName.user);
    const accessToken = userInfo ? userInfo.token : null;

    let headers: HttpHeaders = new HttpHeaders()
      .set(this.deafultContentType.name, this.deafultContentType.value)
      .set(this.deafultAcceptType.name, this.deafultAcceptType.value);

    if (Boolean(accessToken)) {
      headers = headers.append('X-Auth-Token', accessToken);
    }

    return headers;
  }

  private handleError(responseError: HttpResponse<any> | any): Observable<any> {
    console.log(responseError);
    if (responseError.status === 401) {
      // TODO: Show unauthorized error
      console.log('Not logged in!');
      this.clearSession();
    }
    return throwError(responseError.error);
  }

  private clearSession(): void {
    this.localStorageService.clear();
    this.router.navigate(['/']);
  }
}
