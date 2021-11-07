import { Injectable } from '@angular/core';
import { GenericHttpService } from '@services/generic-http.service';
import { API_URL_MAP } from '@config/api-url-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  constructor(private http: GenericHttpService) {}

  public getHouseInfo(): Observable<any> {
    return this.http.get(API_URL_MAP.house);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public updateHouseInfo(houseInfoData): Observable<any> {
    return this.http.post(API_URL_MAP.house, houseInfoData);
  }
}
