import { Injectable } from '@angular/core';
import { GenericHttpService } from '@services/generic-http.service';
import { API_URL_MAP } from '@config/api-url-config';
import {
  EmailDto,
  PreferencesDto,
  PreferencesUpdateDto
} from '@shared/models/loans';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: GenericHttpService) {}

  public getPreferencesDto(): Observable<PreferencesDto> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.preferences}`;
    return this.http.get(url);
  }

  public updateUserPreferences(
    dto: PreferencesUpdateDto
  ): Observable<PreferencesDto> {
    const url = `${API_URL_MAP.loan.base}/preferences`;
    return this.http.post(url, dto);
  }

  public getPreferancesWithGUID(guId: string): Observable<EmailDto> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.public.base}${API_URL_MAP.loan.public.email.base}${API_URL_MAP.loan.public.email.preferences}${guId}`;
    return this.http.get(url);
  }

  public postPreferancesWithGUID(
    guId: string,
    preferences: EmailDto
  ): Observable<EmailDto> {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.public.base}${API_URL_MAP.loan.public.email.base}${API_URL_MAP.loan.public.email.preferences}${guId}`;
    return this.http.put(url, preferences);
  }
}
