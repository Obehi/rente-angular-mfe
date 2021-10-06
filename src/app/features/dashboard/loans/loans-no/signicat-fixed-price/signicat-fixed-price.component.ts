import { Component, Input, OnInit } from '@angular/core';
import { bankOfferDto, LoanInfo, Loans } from '@models/loans';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LoanOverView, MyLoansService } from '../../myloans.service';

@Component({
  selector: 'rente-signicat-fixed-price',
  templateUrl: './signicat-fixed-price.component.html',
  styleUrls: ['./signicat-fixed-price.component.scss']
})
export class SignicatFixedPriceComponent implements OnInit {
  @Input() loanData: Loans;
  @Input() allOffers: bankOfferDto[];

  public loans: LoanInfo[];
  public isSummaryNeeded = false;
  public isEmptyLoans = false;
  public isEditMode: number | null;
  public loansLength: number;

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
      console.log(res);
      this.loans = res;
      if (this.loans) {
        this.loansLength = this.loans.length;
        // console.log('Length: ' + length.toString());
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
  }

  public addLoan(): void {
    if (this.isEditMode !== null) return;
    this.myLoansService.addNewLoan();
  }

  scrollTo(divId: number): void {
    setTimeout(() => {
      console.log('Scrolling to view!');
      console.log('Div id', divId);
      document.getElementById(`${divId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }, 100);
  }
}
