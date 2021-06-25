import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { repeat } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  private showFooter: Subject<boolean>;
  private isDashboard: Subject<boolean>;

  constructor() {
    this.showFooter = new Subject<boolean>();
    this.isDashboard = new Subject<false>();
  }

  public setFooterState(show: boolean): void {
    this.showFooter.next(show);
  }

  public getFooterState(): Observable<boolean> {
    return this.showFooter;
  }

  public setDashboardState(state: boolean): void {
    this.isDashboard.next(state);
  }

  public getDashboardState(): Subject<boolean> {
    return this.isDashboard;
  }

  public setContentClassName(currentName: string, newName: string): void {
    document.getElementsByClassName(currentName)[0].className = newName;
  }
}
