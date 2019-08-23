import { Component, OnInit } from '@angular/core';
import { LoansService } from '@services/remote-api/loans.service';
import { Loans } from '@shared/models/loans';

@Component({
  selector: 'rente-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit {
  public loansData: Loans;
  public errorMessage: string;
  public unableToCalculateTotalInterest: boolean;
  public unableToCalculateTotalInterestByRemainingYears: boolean;

  constructor(private loansService: LoansService) { }

  ngOnInit() {
    // this.loansData = this.loans;
    this.loansService.getLoans().subscribe((res: Loans) => {
      this.loansData = res;
    }, err => {
      this.errorMessage = err.title;
    });
  }


}
