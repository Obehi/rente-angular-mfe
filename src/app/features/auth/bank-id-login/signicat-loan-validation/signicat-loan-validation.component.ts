import { Component, Input, OnInit, Output } from '@angular/core';
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

  public isMobile: boolean;

  constructor() {}

  ngOnInit(): void {
    window.innerWidth > 600 ? (this.isMobile = false) : (this.isMobile = true);
  }
}
