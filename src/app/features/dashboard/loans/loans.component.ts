import { Component, OnInit } from '@angular/core';
import { LoansService } from '@services/remote-api/loans.service';
import { Loans } from '@shared/models/loans';
import { trigger, transition, animate, keyframes, style } from '@angular/animations';

@Component({
  selector: 'rente-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss'],
  animations: [
    trigger(
      'shakeAnimation',
      [
        transition(':enter', animate('200ms ease-in', keyframes([
          style({ transform: 'translate3d(-15px, 0, 0)' }),
          style({ transform: 'translate3d(0, 0, 0)' }),
          style({ transform: 'translate3d(7px, 0, 0)' }),
          style({ transform: 'translate3d(0, 0, 0)' })
        ]))),
      ]
    )
  ]
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
