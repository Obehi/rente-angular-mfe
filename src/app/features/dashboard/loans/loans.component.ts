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
  public loans: Loans;
  public errorMessage: string;

  constructor(private loansService: LoansService) { }

  ngOnInit() {
    // this.loansData = this.loans;
    this.loansService.getLoans().subscribe((res: Loans) => {
      console.log('loans', res);
      this.loansData = res;
    }, err => {
      this.errorMessage = err.title;
    });
  }

}
