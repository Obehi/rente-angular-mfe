import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { repeat } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  private showFooter: Subject<boolean>;

  public setFooterState(show: boolean): void {
    this.showFooter.next(show);
  }

  public getFooterState(): Observable<boolean> {
    return this.showFooter;
  }
  constructor() {
    this.showFooter = new Subject<boolean>();
  }
}
