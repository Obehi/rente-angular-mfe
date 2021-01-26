import { Injectable } from '@angular/core';
import { GenericHttpService } from '@services/generic-http.service';
import { API_URL_MAP } from '@config/api-url-config';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  constructor(private http: GenericHttpService) {}

  public sendTrackingStats(trackingData: TrackingDto) {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.stat.base}${API_URL_MAP.loan.stat.click}`;
    return this.http.post(url, trackingData);
  }
}

export class TrackingDto {
  offerId: number;
  type: string;
}
