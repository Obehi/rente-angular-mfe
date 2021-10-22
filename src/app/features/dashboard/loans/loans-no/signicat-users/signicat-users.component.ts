import { Component, Input, OnInit } from '@angular/core';
import { bankOfferDto, LoanInfo, Loans } from '@models/loans';
import { delay } from 'rxjs/operators';
import { MyLoansService } from '../../myloans.service';

@Component({
  selector: 'rente-signicat-users',
  templateUrl: './signicat-users.component.html',
  styleUrls: ['./signicat-users.component.scss']
})
export class SignicatUsersComponent implements OnInit {
  @Input() loanData: Loans;
  @Input() allOffers: bankOfferDto[];

  public loans: LoanInfo[];
  public isSummaryNeeded = false;
  public isEmptyLoans = false;
  public isEditMode: number | null;
  public loansLength: number;

  constructor(public myLoansService: MyLoansService) {}

  ngOnInit(): void {
    this.loans = this.loanData.loans;

    this.loans.forEach((loan) => {
      loan.isDeleted = false;
    });

    this.myLoansService.updateLoans(this.loans);

    this.myLoansService.getLoansAsObservable().subscribe((res) => {
      // console.log(res);
      if (this.loans) {
        this.loans = res.sort((a, b) => a.id - b.id);
        this.loansLength = this.loans.length;
        // console.log('Length:', this.loansLength);
        if (this.loansLength > 1 && !this.loans.some((loan) => loan.id === 0))
          this.isSummaryNeeded = true;
        else if (this.loansLength === 0) this.isEmptyLoans = true;
        else this.isSummaryNeeded = false;
      }
    });

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

    this.myLoansService
      .newlyCreatedLoanStatusAsObservable()
      .subscribe((res) => {
        if (res) {
          this.scrollTo(this.loansLength);
          this.myLoansService.setNewlyCreatedLoanStatus(null);
        }
      });
  }

  public addLoan(): void {
    if (this.isEditMode !== null) return;
    this.myLoansService.addNewLoan();
  }

  scrollTo(divId: number): void {
    setTimeout(() => {
      document.getElementById(`${divId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }, 200);
  }
}
