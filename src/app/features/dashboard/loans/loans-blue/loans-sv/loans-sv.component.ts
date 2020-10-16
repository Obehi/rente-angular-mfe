
import { Component, OnInit } from '@angular/core';
import { LoansService } from '@services/remote-api/loans.service';
import { Loans } from '@shared/models/loans';
import { trigger, transition, animate, keyframes, style } from '@angular/animations';

@Component({
  selector: 'rente-loans',
  templateUrl: './loans-sv.component.html',
  styleUrls: ['./loans-sv.component.scss'],
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
export class LoansSvComponent implements OnInit {
  public loansData: Loans;
  public errorMessage: string;
  public unableToCalculateTotalInterest: boolean;
  public unableToCalculateTotalInterestByRemainingYears: boolean;

  constructor(private loansService: LoansService) { }

  ngOnInit() {
    this.loansService.getLoans().subscribe((res: Loans) => {
      this.loansData = res;
    }, err => {
      this.errorMessage = err.title;
    });
  }
}
