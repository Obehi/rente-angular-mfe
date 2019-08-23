import { Injectable } from '@angular/core';
import { GenericHttpService } from '@services/generic-http.service';
import { API_URL_MAP } from '@config/api-url-config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: GenericHttpService) { }

  public getUserInfo() {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.me}`;
    return this.http.get(url);
  }

  public updateUserInfo(userData) {
    const url = `${API_URL_MAP.user.base}${API_URL_MAP.user.me}`;
    return this.http.post(url, userData);
  }
}
