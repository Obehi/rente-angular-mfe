import { Component, Input, OnInit } from '@angular/core';
import { bankOfferDto, LoanInfo, Loans } from '@models/loans';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LoanOverView, MyLoansService } from '../../myloans.service';

@Component({
  selector: 'rente-signicat-users',
  templateUrl: './signicat-users.component.html',
  styleUrls: ['./signicat-users.component.scss']
})
export class SignicatUsersComponent implements OnInit {
  @Input() loanData: Loans;
  @Input() allOffers: bankOfferDto[];

  public loans: LoanInfo[] | null;
  public isSummaryNeeded = false;
  public isEmptyLoans = false;
  public isEditMode: number | null;

  public loanOverViewObservable$: Observable<LoanOverView>;

  constructor(public myLoansService: MyLoansService) {}

  ngOnInit(): void {
    this.loanOverViewObservable$ = this.myLoansService.loanOverViewObservable$;

    this.loans = this.loanData.loans;

    this.loans.forEach((loan) => {
      loan.isDeleted = false;
    });

    const loan = {
      bank: 'Sbanken ASA',
      bankKey: 'SBANKEN',
      effectiveRate: 2,
      id: 4780,
      isIncompleteInfoLoan: false,
      loanName: 'Lån',
      loanType: 'DOWNPAYMENT_REGULAR_LOAN',
      nominalRate: 1.99,
      outstandingDebt: 4500000,
      remainingYears: 29,
      totalInterestAndTotalFee: 3232323,
      isDeleted: false,
      totalInterestAndTotalFeeByRemainingYears: 32323333
    };

    this.loans.push(loan);
    this.myLoansService.updateLoans(this.loans);

    this.myLoansService.getLoansAsObservable().subscribe((res) => {
      // console.log('Signicat parent response');
      console.log(res);
      this.loans = res;
      if (this.loans) {
        const length = this.loans.length;
        // console.log('Length: ' + length.toString());
        if (length > 1) this.isSummaryNeeded = true;

        if (length === 0) this.isEmptyLoans = true;
      }
    });

    const length = this.loanData.loans.length;
    if (length > 1) this.isSummaryNeeded = true;

    this.myLoansService
      .loanEditIndexAsObservable()
      .pipe(delay(0))
      .subscribe(
        (res) => {
          this.isEditMode = res;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  public addLoan(): void {
    // this.isEditMode = this.myLoansService.getEditMode();

    if (this.isEditMode !== null) return;
    this.myLoansService.addNewLoan();
  }
}
