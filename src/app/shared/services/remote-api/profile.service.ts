import { GenericHttpService } from '@services/generic-http.service';
import { Injectable } from '@angular/core';
import { API_URL_MAP } from '@config/api-url-config';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: GenericHttpService) {}

  public getProfileInfo() {
    return this.http.get(API_URL_MAP.profile);
  }

  public updateProfileInfo(profileData) {
    return this.http.post(API_URL_MAP.profile, profileData);
  }

  public updateMembership(dto) {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.membership}`;
    return this.http.put(url, { memberships: dto });
  }
}
