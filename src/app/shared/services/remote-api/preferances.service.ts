import { Injectable } from '@angular/core';
import { GenericHttpService } from '@services/generic-http.service';
import { API_URL_MAP } from '@config/api-url-config';

@Injectable({
  providedIn: 'root'
})
export class PreferancesService {

  constructor(
    private http: GenericHttpService
  ) { }

  public getPreferances() {
    return this.http.get(API_URL_MAP.preferances);
  }

  public updatePreferances(preferancesData) {
    return this.http.post(API_URL_MAP.preferances, preferancesData);
  }
}
