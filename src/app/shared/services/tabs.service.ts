import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabsService {
  private activeLinkIndex = new BehaviorSubject<number | null>(null);
  constructor() {}

  public setActiveLinkIndex(index: number | null): void {
    this.activeLinkIndex.next(index);
  }

  public getActiveLinkIndex(): number | null {
    return this.activeLinkIndex.getValue();
  }

  public activeLinkIndexAsObservable(): Observable<number | null> {
    return this.activeLinkIndex.asObservable();
  }
}
