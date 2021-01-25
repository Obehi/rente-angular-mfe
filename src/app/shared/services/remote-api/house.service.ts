import { Injectable } from '@angular/core';
import { GenericHttpService } from '@services/generic-http.service';
import { API_URL_MAP } from '@config/api-url-config';

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  constructor(private http: GenericHttpService) {}

  public getHouseInfo() {
    return this.http.get(API_URL_MAP.house);
  }

  public updateHouseInfo(houseInfoData) {
    return this.http.post(API_URL_MAP.house, houseInfoData);
  }
}
