import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrawlerLoginService {
  numberofRetries = 0;
  public firstRetry$: Subject<any>;
  public secondRetry$: Subject<any>;

  constructor() {
    this.firstRetry$ = new Subject<any>();
    this.secondRetry$ = new Subject<any>();
  }

  public getFirstRetryObserver(): Observable<any> {
    return this.firstRetry$;
  }

  postError(): void {
    this.numberofRetries++;

    this.numberofRetries < 2
      ? this.firstRetry$.next()
      : this.secondRetry$.next();
  }

  forceSignicatRedirect(): void {
    this.secondRetry$.next();
  }
}
