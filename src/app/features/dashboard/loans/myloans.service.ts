import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { LoanInfo, Loans } from '@shared/models/loans';
import { LoansService } from '@services/remote-api/loans.service';
import { map, share, shareReplay, tap } from 'rxjs/operators';

export interface LoanOverView {
  aggregatedTotalInterestAndFee: number;
  aggregatedTotalInterestAndFeeByRemainingYears: number;
  totalEffectiveRate: number;
  totalOutstandingDebt: number;
}
@Injectable({
  providedIn: 'root'
})
export class MyLoansService {
  private editModeSubject = new BehaviorSubject<number | null>(null);
  private loanStore = new BehaviorSubject<LoanInfo[] | null>(null);
  // public loansObservable$: Observable<Loans>;
  // public loanOverViewObservable$: Observable<LoanOverView>;

  public loansObservable$ = this.fetchLoans().pipe(
    map((res) => res[0]),
    shareReplay(1)
  );
  public loanOverViewObservable$ = this.loansObservable$.pipe(
    map((loans) => {
      return {
        aggregatedTotalInterestAndFee: loans.aggregatedTotalInterestAndFee,
        aggregatedTotalInterestAndFeeByRemainingYears:
          loans.aggregatedTotalInterestAndFeeByRemainingYears,
        totalEffectiveRate: loans.totalEffectiveRate,
        totalOutstandingDebt: loans.totalOutstandingDebt
      };
    }),
    shareReplay(1)
  );

  constructor(private loansService: LoansService) {
    // this.loansObservable$.subscribe((res) => console.log('res'));
    // this.loanOverViewObservable$.subscribe((res) => console.log(res));
  }

  public updateLoans(loans: LoanInfo[] | null): void {
    this.loanStore.next(loans);
  }

  public getLoansValue(): LoanInfo[] | null {
    return this.loanStore.getValue();
  }

  public getLoansAsObservable(): Observable<LoanInfo[] | null> {
    return this.loanStore.asObservable();
  }

  public deleteLoan(loanId: number): void {
    const prevLoans = this.loanStore.getValue();

    if (!prevLoans) return;

    prevLoans.filter((loan) => {
      return loan.id === loanId;
    })[0].isDeleted = true;

    this.updateLoans(prevLoans);

    this.setEditMode(null);
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

  fetchLoans(): Observable<any[]> {
    return forkJoin([
      this.loansService.getLoans(),
      this.loansService.getOffersBanks()
    ]).pipe(
      // share(),
      shareReplay(1),
      tap((val) => console.log('Hello'))
    );

    // return this.loansService.getLoanAndOffersBanks().pipe(share());
    // return this.loansService.getLoanAndOffersBanks().pipe(share());
  }
}
