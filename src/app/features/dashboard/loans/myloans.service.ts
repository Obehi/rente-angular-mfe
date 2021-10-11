import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  forkJoin,
  merge,
  Observable,
  of,
  Subject
} from 'rxjs';
import { LoanInfo, Loans, SignicatLoanInfoDto } from '@shared/models/loans';
import { LoansService } from '@services/remote-api/loans.service';
import {
  catchError,
  map,
  share,
  shareReplay,
  switchMap,
  tap
} from 'rxjs/operators';
import { OffersBank } from '@models/bank';

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
  private loanInfoBEStore = new BehaviorSubject<SignicatLoanInfoDto[]>([
    {
      fee: 0,
      id: 0,
      loanSubType: '',
      loanType: '',
      nominalInterestRate: 0,
      outstandingDebt: 0,
      productId: '',
      remainingYears: 0
    }
  ]);
  private loanStore = new BehaviorSubject<LoanInfo[]>([
    {
      bank: '',
      bankKey: '',
      effectiveRate: 0,
      id: 0,
      fee: 0,
      isDeleted: false,
      isIncompleteInfoLoan: true,
      loanName: 'Nedbetalingslån',
      loanType: 'DOWNPAYMENT_REGULAR_LOAN',
      nominalRate: 1,
      outstandingDebt: 1,
      remainingYears: 1,
      totalInterestAndTotalFee: 0,
      totalInterestAndTotalFeeByRemainingYears: 0
    }
  ]);

  public loansObservable$ = this.fetchLoans().pipe(
    tap((res) => console.log('res from myloanservice loansobservable: ', res)),
    map((res) => res[0])
  );

  private loans$: Observable<Loans | null> = this.loansService.getLoans();
  private offerBanks$: Observable<OffersBank | null> = this.loansService.getOffersBanks();

  private reloadLoans$: Subject<boolean> = new Subject();
  reloadLoans = (): void => this.reloadLoans$.next(true);

  private loansAndOfferBanks$ = merge(
    this.reloadLoans$.pipe(
      switchMap(() => forkJoin([this.loans$, this.offerBanks$])),
      share()
    ),
    this.fetchLoans()
  );

  get loansAndOfferBanks(): Observable<any[]> {
    return this.loansAndOfferBanks$;
  }

  public loanOverViewObservable$: Observable<any> = this.loansAndOfferBanks.pipe(
    tap(() => console.log('Loan overview tap!')),
    map(([loans, offers]) => {
      return {
        aggregatedTotalInterestAndFee: loans.aggregatedTotalInterestAndFee,
        aggregatedTotalInterestAndFeeByRemainingYears:
          loans.aggregatedTotalInterestAndFeeByRemainingYears,
        totalEffectiveRate: loans.totalEffectiveRate,
        totalOutstandingDebt: loans.totalOutstandingDebt
      };
    })
  );

  constructor(private loansService: LoansService) {}

  public addNewLoan(): void {
    let infoList = this.loanStore.getValue();

    if (infoList === null) {
      infoList = [];
    }

    // Remove if there are loans with id 0
    if (infoList.some((val) => val.id === 0)) {
      infoList = infoList.filter((val) => val.id !== 0);
    }

    // There should always be one loan
    // NB! loanName property needs to be one of the offers to work
    const newLoan = {
      bank: infoList[0].bank,
      bankKey: infoList[0].bankKey,
      effectiveRate: 0,
      id: 0,
      fee: null,
      isDeleted: false,
      isIncompleteInfoLoan: true,
      loanName: 'Boliglån 75 %',
      loanType: 'DOWNPAYMENT_REGULAR_LOAN',
      nominalRate: null,
      outstandingDebt: null,
      remainingYears: null,
      totalInterestAndTotalFee: 0,
      totalInterestAndTotalFeeByRemainingYears: 0
    };

    infoList.push(newLoan);
    this.loanStore.next(infoList);
  }

  public updateLoans(loans: LoanInfo[]): void {
    this.loanStore.next(loans);
  }

  public getLoansValue(): LoanInfo[] {
    return this.loanStore.getValue();
  }

  public getLoansAsObservable(): Observable<LoanInfo[]> {
    return this.loanStore.asObservable();
  }

  public setLoanInfoBEStore(loans: SignicatLoanInfoDto[]): void {
    return this.loanInfoBEStore.next(loans);
  }

  public getLoanInfoBEValue(): SignicatLoanInfoDto[] {
    return this.loanInfoBEStore.getValue();
  }

  public getLoanInfoBEAsObservable(): Observable<SignicatLoanInfoDto[]> {
    return this.loanInfoBEStore.asObservable();
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
      share(),
      catchError((err) => {
        console.log(err);
        console.log('My loans service error pipe');

        return of(err);
      })
    );
  }
}
