import { storageName } from './../../config/index';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public appPrefix = storageName.appPrefix;

  public get isFixedRateType() {
    return !!this.getItem('isAggregatedRateTypeFixed');
  }

  public get isNoLoansPresent() {
    return !!this.getItem('noLoansPresent');
  }
  public get isNewUser() {
    return !!this.getItem('isNewUser');
  }

  public setItem(param: string, value: any): void {
    localStorage.setItem(`${this.appPrefix}-${param}`, value);
  }

  public setObject(param: string, value: any): void {
    localStorage.setItem(`${this.appPrefix}-${param}`, JSON.stringify(value));
  }

  public getItem(param: string): any {
    return localStorage.getItem(`${this.appPrefix}-${param}`);
  }

  public getObject(param: string): any {
    const parseObject = localStorage.getItem(`${this.appPrefix}-${param}`);
    if (parseObject !== null) {
      return JSON.parse(parseObject);
    }
  }

  public removeItem(param: string): any {
    localStorage.removeItem(`${this.appPrefix}-${param}`);
  }

  public clear(): void {
    localStorage.clear();
  }
}
