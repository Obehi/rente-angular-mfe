import { Injectable } from '@angular/core';
import { GenericHttpService } from '@services/generic-http.service';
import { API_URL_MAP } from '@config/api-url-config';
import { EmailDto } from '@shared/models/loans';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreferancesService {
  constructor(private http: GenericHttpService) {}

  public getPreferances(): Observable<any> {
    return this.http.get(API_URL_MAP.preferances);
  }

  // Assuming it will be preferenceDto but have to check!
  public updatePreferances(preferancesData): Observable<any> {
    return this.http.post(API_URL_MAP.preferances, preferancesData);
  }

  public getPreferancesWithGUID(guId): Observable<EmailDto> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.public.base}${API_URL_MAP.loan.public.email.base}${API_URL_MAP.loan.public.email.preferences}${guId}`;
    return this.http.get(url);
  }

  // The preferences type was EmailDto, so i assume it will return the same object back
  public postPreferancesWithGUID(
    guId: string,
    preferences: EmailDto
  ): Observable<EmailDto> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.public.base}${API_URL_MAP.loan.public.email.base}${API_URL_MAP.loan.public.email.preferences}${guId}`;
    return this.http.put(url, preferences);
  }
}
