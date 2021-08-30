import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyLoansService {
  private editModeSubject = new BehaviorSubject<number | null>(null);
  private loanCount: number;

  constructor() {}

  public setEditMode(index: number | null): void {
    this.editModeSubject.next(index);
  }

  public getEditMode(): number | null {
    return this.editModeSubject.value;
  }

  public loanEditIndexAsObservable(): Observable<number | null> {
    return this.editModeSubject.asObservable();
  }

  public resetEditMode(): void {
    this.editModeSubject.next(0);
  }

  // public setLoansCount(i: number): void {
  //   this.loanCount = i;
  // }

  // public getLoansCount(): number {
  //   return this.loanCount;
  // }
}
