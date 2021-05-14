import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  private showFooter: Subject<boolean>;

  public setFooterState(show: boolean): void {
    this.showFooter.next(show);
  }

  public getFooterState(): Subject<boolean> {
    return this.showFooter;
  }
  constructor() {
    this.showFooter = new Subject<boolean>();
  }
}
