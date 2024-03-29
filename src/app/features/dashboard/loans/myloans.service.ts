import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  forkJoin,
  iif,
  merge,
  Observable,
  of,
  Subject
} from 'rxjs';
import { LoanInfo, Loans, SignicatLoanInfoDto } from '@shared/models/loans';
import { LoansService } from '@services/remote-api/loans.service';
import {
  catchError,
  delay,
  filter,
  map,
  mergeMap,
  share,
  switchMap,
  tap
} from 'rxjs/operators';
import { OffersBank } from '@models/bank';
import { RxjsOperatorService } from '@services/rxjs-operator.service';
import { MessageBannerService } from '@services/message-banner.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';

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
  public animationStyle = getAnimationStyles();

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

  private deleteLoanTrigger$: BehaviorSubject<
    number | null
  > = new BehaviorSubject(null);

  private newLoanCreatedStatus = new BehaviorSubject<boolean | null>(null);

  public deleteLoanTrigger(id: number): void {
    this.deleteLoanTrigger$.next(id);
  }

  public loanDeleted$ = this.deleteLoanTrigger$.pipe(
    mergeMap((loanId) =>
      iif(
        () => loanId === 0,
        of(null).pipe(
          tap(() => {
            this.setEditMode(null);

            this.updateLoans(
              this.loanStore.getValue().filter((loan) => loan.id !== loanId)
            );
          })
        ),
        of(loanId)
      )
    ),
    filter((loanId) => loanId !== null),
    switchMap((loanId: number) =>
      this.loansService.deleteLoan(loanId).pipe(map(() => loanId))
    ),
    catchError(
      this.rxjsOperatorService.handleErrorWithNotification(
        'Oops, noe gikk galt. Lånet ble ikke slettet. Prøv igjen senere',
        5000
      )
    ),

    tap((loanId: number) => {
      this.deleteLoan(loanId);
      this.messageBannerService.setView(
        'Lånet er slettet',
        3000,
        this.animationStyle.DROP_DOWN_UP,
        'success',
        window
      );
    }),
    delay(500)
  );

  public loansObservable$ = this.fetchLoans().pipe(map((res) => res[0]));

  private loans$: Observable<Loans | null> = this.loansService.getLoans();
  private offerBanks$: Observable<OffersBank | null> = this.loansService.getOffersBanks();

  private reloadLoans$: Subject<boolean> = new Subject();
  reloadLoans = (): void => this.reloadLoans$.next(true);

  private loansAndOfferBanks$ = merge(
    merge(this.reloadLoans$, this.loanDeleted$).pipe(
      switchMap(() => forkJoin([this.loans$, this.offerBanks$])),
      share()
    ),
    this.fetchLoans()
  );

  get loansAndOfferBanks(): Observable<any[]> {
    return this.loansAndOfferBanks$;
  }

  public loanOverViewObservable$: Observable<any> = this.loansAndOfferBanks.pipe(
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

  constructor(
    private loansService: LoansService,
    private rxjsOperatorService: RxjsOperatorService,
    private messageBannerService: MessageBannerService
  ) {}

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
    return this.editModeSubject.getValue();
  }

  public loanEditIndexAsObservable(): Observable<number | null> {
    return this.editModeSubject.asObservable();
  }

  public setNewlyCreatedLoanStatus(status: boolean | null): void {
    this.newLoanCreatedStatus.next(status);
  }

  public getNewlyCreatedLoanStatus(): boolean | null {
    return this.newLoanCreatedStatus.getValue();
  }

  public newlyCreatedLoanStatusAsObservable(): Observable<boolean | null> {
    return this.newLoanCreatedStatus.asObservable();
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

  public getLoansdto(): LoanInfo[] {
    return [
      {
        bank: 'SBANKEN',
        bankKey: 'Sbanken',
        effectiveRate: 1.77,
        id: 5520,
        fee: 20,
        isDeleted: false,
        isIncompleteInfoLoan: false,
        loanName: 'Boliglån 75 %',
        loanType: 'Nedbetalingslån',
        nominalRate: 1.79,
        outstandingDebt: 3245000,
        remainingYears: 28,
        totalInterestAndTotalFee: 0,
        totalInterestAndTotalFeeByRemainingYears: 0
      },
      {
        bank: 'SBANKEN',
        bankKey: 'Sbanken',
        effectiveRate: 1.68,
        id: 5522,
        fee: 0,
        isDeleted: false,
        isIncompleteInfoLoan: false,
        loanName: 'Boliglån 60 %',
        loanType: 'Nedbetalingslån',
        nominalRate: 1.81,
        outstandingDebt: 2155000,
        remainingYears: 20,
        totalInterestAndTotalFee: 0,
        totalInterestAndTotalFeeByRemainingYears: 0
      }
    ];
  }
}
