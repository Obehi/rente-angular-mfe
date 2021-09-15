import { storageName } from './../../config/index';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public appPrefix = storageName.appPrefix;

  public get isFixedRateType(): boolean {
    return !!this.getItem('isAggregatedRateTypeFixed');
  }

  public get isNoLoansPresent(): boolean {
    return !!this.getItem('noLoansPresent');
  }
  public get isNewUser(): boolean {
    return !!this.getItem('isNewUser');
  }

  public get isUserDefinedOfferPreferences() {
    const isUserDefinedOfferPreferences = this.getItem(
      'isUserDefinedOfferPreferences'
    );

    return isUserDefinedOfferPreferences === null
      ? null
      : JSON.parse(isUserDefinedOfferPreferences);
  }

  public set isUserDefinedOfferPreferences(value: boolean) {
    this.setItem('isUserDefinedOfferPreferences', value);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public setItem(param: string, value: any): void {
    localStorage.setItem(`${this.appPrefix}-${param}`, value);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public setObject(param: string, value: any): void {
    localStorage.setItem(`${this.appPrefix}-${param}`, JSON.stringify(value));
  }

  public getItem(param: string): any | null {
    return localStorage.getItem(`${this.appPrefix}-${param}`);
  }

  public getObject(param: string): any {
    const parseObject = localStorage.getItem(`${this.appPrefix}-${param}`);
    if (parseObject !== null) {
      return JSON.parse(parseObject);
    } else {
      return null;
    }
  }

  public getBoolean(param: string): boolean | null {
    const item = localStorage.getItem(`${this.appPrefix}-${param}`);

    if (item === 'true') {
      return true;
    } else if (item === 'false') {
      return false;
    }

    return null;
  }

  public removeItem(param: string): any {
    localStorage.removeItem(`${this.appPrefix}-${param}`);
  }

  public clear(): void {
    localStorage.clear();
  }
}
