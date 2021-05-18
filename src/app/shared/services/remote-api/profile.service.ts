import { GenericHttpService } from '@services/generic-http.service';
import { Injectable } from '@angular/core';
import { API_URL_MAP } from '@config/api-url-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: GenericHttpService) {}

  public getProfileInfo(): Observable<any> {
    return this.http.get(API_URL_MAP.profile);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public updateProfileInfo(profileData): Observable<any> {
    return this.http.post(API_URL_MAP.profile, profileData);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public updateMembership(dto): Observable<any> {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.membership}`;
    return this.http.put(url, { memberships: dto });
  }
}
