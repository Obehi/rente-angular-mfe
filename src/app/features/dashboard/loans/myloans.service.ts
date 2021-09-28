import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoanInfo } from '@shared/models/loans';

@Injectable({
  providedIn: 'root'
})
export class MyLoansService {
  private editModeSubject = new BehaviorSubject<number | null>(null);
  private loanStore = new BehaviorSubject<LoanInfo[] | null>(null);

  constructor() {}

  public updateLoans(loans: LoanInfo[] | null): void {
    this.loanStore.next(loans);
  }

  public getLoansValue(): LoanInfo[] | null {
    return this.loanStore.getValue();
  }

  public getLoansAsObservable(): Observable<LoanInfo[] | null> {
    return this.loanStore.asObservable();
  }

  public deleteLoan(loanId: number): LoanInfo[] | null {
    if (this.loanStore.getValue() === null) return null;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newLoans = this.loanStore.getValue()!.filter((loan) => {
      return loan.id !== loanId;
    });

    this.updateLoans(newLoans);

    this.setEditMode(null);

    return newLoans;
  }

  public setEditMode(index: number | null): void {
    this.editModeSubject.next(index);
  }

  public getEditMode(): number | null {
    return this.editModeSubject.value;
  }

  public loanEditIndexAsObservable(): Observable<number | null> {
    return this.editModeSubject.asObservable();
  }

  public getNumericValueFormated(incomeValue: any): number {
    const income: string =
      typeof incomeValue === 'string'
        ? incomeValue.replace(/\s/g, '')
        : incomeValue;
    return Number(income.replace(',', '.'));
  }

  public formatComma(val: string): number {
    return Number(val.replace(',', '.'));
  }

  public countDecimals(value: number): number {
    if (Math.floor(value) === value) return 0;
    return value.toString().split('.')[1].length || 0;
  }
}
