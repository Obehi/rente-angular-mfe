import { Component, Input, OnInit } from '@angular/core';
import { bankOfferDto, LoanInfo, Loans } from '@models/loans';
import { Observable } from 'rxjs';
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

  public loanOverViewObservable$: Observable<LoanOverView>;

  constructor(public myLoansService: MyLoansService) {}

  ngOnInit(): void {
    this.loanOverViewObservable$ = this.myLoansService.loanOverViewObservable$;

    this.loans = this.loanData.loans;

    this.loans.forEach((loan) => {
      loan.isDeleted = false;
    });

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
  }

  public addLoan(): void {
    this.myLoansService.addNewLoan();
  }
}
