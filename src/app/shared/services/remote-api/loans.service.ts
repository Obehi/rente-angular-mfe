import { Injectable } from '@angular/core';
import { GenericHttpService } from '@services/generic-http.service';
import { API_URL_MAP } from '@config/api-url-config';

@Injectable({
  providedIn: 'root'
})
export class LoansService {

  constructor(private http: GenericHttpService) { }

  public getLoans() {
    const url = `${API_URL_MAP.loan.base}${API_URL_MAP.loan.loans}`;
    return this.http.get(url);
  }
}
