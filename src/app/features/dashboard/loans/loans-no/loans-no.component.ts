import { Component, OnInit } from '@angular/core';
import { LoansService } from '@services/remote-api/loans.service';
import { Loans } from '@shared/models/loans';
import { BankUtils } from '@shared/models/bank';
import {
  trigger,
  transition,
  animate,
  keyframes,
  style
} from '@angular/animations';
import { locale } from '@config/locale/locale';

interface offerDto {
  offers: [
    {
      id: string;
      name: string;
      rate: number;
    }
  ];
}
@Component({
  selector: 'rente-loans',
  templateUrl: './loans-no.component.html',
  styleUrls: ['./loans-no.component.scss'],
  animations: [
    trigger('shakeAnimation', [
      transition(
        ':enter',
        animate(
          '200ms ease-in',
          keyframes([
            style({ transform: 'translate3d(-15px, 0, 0)' }),
            style({ transform: 'translate3d(0, 0, 0)' }),
            style({ transform: 'translate3d(7px, 0, 0)' }),
            style({ transform: 'translate3d(0, 0, 0)' })
          ])
        )
      )
    ])
  ]
})
export class LoansNoComponent implements OnInit {
  public loansData: Loans;
  public errorMessage: string;
  public unableToCalculateTotalInterest: boolean;
  public unableToCalculateTotalInterestByRemainingYears: boolean;
  public locale: string;
  public isSignicatUser: boolean;
  public isFixedPriceBank: boolean;
  public offer: offerDto;

  constructor(private loansService: LoansService) {}

  ngOnInit(): void {
    this.locale = locale;

    this.loansService.getLoanAndOffersBanks().subscribe(
      ([loans, offerBank]) => {
        this.loansData = loans;
        // this.loansData.loans[0].loanName = ''
        this.offer = offerBank as offerDto;

        console.log(this.offer);

        // this.isSignicatUser = BankUtils.getSignicatUserByBankLabel(
        //   this.loansData.loans[0].bank
        // );
        this.isSignicatUser = false;

        console.log('Is signicatuser?');
        console.log(this.isSignicatUser);
      },
      (err) => {
        this.errorMessage = err.title;
      }
    );
  }
}
