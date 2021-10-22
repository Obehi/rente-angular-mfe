import { Component, Input, OnInit, Output } from '@angular/core';
import { LoanTypeOption, nonListLoanType } from '@models/loan-type';
import { LoanInfo } from '@models/loans';

@Component({
  selector: 'rente-signicat-loan-validation',
  templateUrl: './signicat-loan-validation.component.html',
  styleUrls: ['./signicat-loan-validation.component.scss']
})
export class SignicatLoanValidationComponent implements OnInit {
  @Input() loans: LoanInfo[];
  @Output() confirm: boolean;
  @Output() redirect: boolean;

  public loanTypeList: LoanTypeOption[] = nonListLoanType;

  public isMobile: boolean;

  constructor() {}

  ngOnInit(): void {
    window.innerWidth > 600 ? (this.isMobile = false) : (this.isMobile = true);
    if (this.loans) {
      this.loans.map((loan) => {
        let convert: string | undefined = '';
        convert = this.loanTypeList.find((val) => val.value === loan.loanType)
          ?.name;

        if (convert) loan.loanType = convert;
        else console.log('Could not find loan type name', convert);
      });
    }
  }
}
