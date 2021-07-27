import { Injectable } from '@angular/core';
import { GenericHttpService } from '@services/generic-http.service';
import { API_URL_MAP } from '@config/api-url-config';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserScorePreferences } from '@models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public lowerRateAvailable: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  constructor(private http: GenericHttpService) {}

  public getUserInfo() {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.me}`;
    return this.http.get(url);
  }

  public updateUserInfo(userData): any {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.me}`;
    return this.http.post(url, userData);
  }

  public getUserScorePreferences(): Observable<UserScorePreferences> {
    const url = `${API_URL_MAP.preferances.base}${API_URL_MAP.preferances.score}`;
    return this.http.get(url);
  }

  public updateUserScorePreferences(
    score: UserScorePreferences
  ): Observable<any> {
    const url = `${API_URL_MAP.preferances.base}${API_URL_MAP.preferances.score}`;
    return this.http.post(url, score);
  }

  public validateSsn(ssn: string): Observable<SsnValidationDto> {
    const url = `${API_URL_MAP.user.base}/validate/ssn/${ssn}`;
    return this.http.get(url);
  }
}

export class SsnValidationDto {
  ssn: string;
  valid: boolean;
}
