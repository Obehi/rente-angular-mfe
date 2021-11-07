import { Component, OnInit } from '@angular/core';
import { LoansService } from '@services/remote-api/loans.service';
import { Loans, bankOfferDto } from '@shared/models/loans';
import {
  trigger,
  transition,
  animate,
  keyframes,
  style
} from '@angular/animations';
import { locale } from '@config/locale/locale';
import { MessageBannerService } from '@services/message-banner.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
import { MyLoansService } from '../myloans.service';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

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
  ],
  providers: [MyLoansService]
})
export class LoansNoComponent implements OnInit {
  public loansData: Loans;
  public errorMessage: string;
  public unableToCalculateTotalInterest: boolean;
  public unableToCalculateTotalInterestByRemainingYears: boolean;
  public locale: string;
  public isSignicatUser: boolean;
  public isFixedPriceBank: boolean;
  public offers: bankOfferDto[];
  public animationType = getAnimationStyles();
  public loansAndOffers$: Observable<any>;

  constructor(
    private loansService: LoansService,
    private myLoansService: MyLoansService,
    private messageBannerService: MessageBannerService
  ) {}

  ngOnInit(): void {
    this.locale = locale;

    this.loansAndOffers$ = this.myLoansService.loansAndOfferBanks.pipe(
      catchError((err) => {
        console.log('Error', err);
        this.messageBannerService.setView(
          'Noe gikk feil, vennligst prøv igjen senere. Hvis dette vedvarer, ta kontakt!',
          4000,
          this.animationType.DROP_DOWN_UP,
          'error',
          window
        );
        return of(err);
      }),
      tap((res) => {
        this.loansData = res[0];
        this.offers = res[1].offers;

        const newList = this.loansData.loans.map((loan) => {
          return {
            bank: loan.bank,
            bankKey: loan.bankKey,
            effectiveRate: loan.effectiveRate,
            id: loan.id,
            fee: loan.fee,
            isDeleted: false,
            isIncompleteInfoLoan: loan.isIncompleteInfoLoan,
            loanName: loan.loanName,
            loanType: loan.loanType,
            nominalRate: loan.nominalRate,
            outstandingDebt: loan.outstandingDebt,
            remainingYears: loan.remainingYears,
            totalInterestAndTotalFee: loan.totalInterestAndTotalFee,
            totalInterestAndTotalFeeByRemainingYears:
              loan.totalInterestAndTotalFeeByRemainingYears
          };
        });

        this.myLoansService.updateLoans(newList);

        /*
         Backend returns origin which contains either 1 or 2
        1 is crawler banks, 2 is signicat user
        isFixedPriceBank of type boolean is also included in the returned object to check
       */

        /*
         * Fixed price is currently not used, will keep it here for future use
         * To be discussed and reviewed
         * Do not remove!
         */

        if (this.loansData.origin === 1) this.isSignicatUser = false;
        if (this.loansData.origin === 2) this.isSignicatUser = true;
        if (this.isSignicatUser && this.loansData.isFixedPriceBank)
          this.isFixedPriceBank = true;

        /*  this.isSignicatUser = true;
        this.isFixedPriceBank = false; */
      })
    );
  }
}
