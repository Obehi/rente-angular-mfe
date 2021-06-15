import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  private showFooter: Subject<boolean>;
  private showHeader: Subject<boolean>;

  constructor() {
    this.showHeader = new Subject<true>();
    this.showFooter = new Subject<boolean>();
  }

  public setHeaderState(show: boolean): void {
    this.showHeader.next(show);
  }

  public getHeaderState(): Subject<boolean> {
    return this.showHeader;
  }

  public setFooterState(show: boolean): void {
    this.showFooter.next(show);
  }

  public getFooterState(): Subject<boolean> {
    return this.showFooter;
  }
}
