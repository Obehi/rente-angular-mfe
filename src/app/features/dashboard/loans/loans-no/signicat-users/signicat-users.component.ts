import { trigger, transition, style, animate } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { bankOfferDto, LoanInfo, Loans } from '@models/loans';
import { delay } from 'rxjs/operators';
import { MyLoansService } from '../../myloans.service';

@Component({
  selector: 'rente-signicat-users',
  templateUrl: './signicat-users.component.html',
  styleUrls: ['./signicat-users.component.scss']
  // ,
  // animations: [
  //   trigger('removeLoan', [
  //     transition(':leave', [
  //       style({ transform: 'scale(1)', opacity: 1, height: '*' }),
  //       animate(
  //         '1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
  //         style({
  //           transform: 'scale(0.5)',
  //           opacity: 0,
  //           height: '0px',
  //           margin: '0px'
  //         })
  //       )
  //     ])
  //   ])
  // ]
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
      this.loans = res.sort((a, b) => a.id - b.id);
      if (this.loans) {
        this.loansLength = this.loans.length;
        if (this.loansLength > 1) this.isSummaryNeeded = true;

        if (this.loansLength === 0) this.isEmptyLoans = true;
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

    // Animate out the deleted loan
    // const loanDiv = document.getElementById(`1`);

    // console.log('Loan div', loanDiv);s

    // loanDiv?.animate([{ opacity: 1 }, { opacity: 0 }], {
    //   duration: 1000
    // });
  }

  public addLoan(): void {
    if (this.isEditMode !== null) return;
    this.myLoansService.addNewLoan();

    // if (window.innerWidth < 600) {
    //   this.scrollTo(this.loansLength);
    // }
  }

  scrollTo(divId: number): void {
    setTimeout(() => {
      document.getElementById(`${divId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }, 100);
  }
}
