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
import { MessageBannerService } from '@services/message-banner.service.ts';
import { getAnimationStyles } from '@shared/animations/animationEnums';
import { MyLoansService } from '../myloans.service';

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

  constructor(
    private loansService: LoansService,
    private messageBannerService: MessageBannerService
  ) {}

  ngOnInit(): void {
    this.locale = locale;

    this.loansService.getLoanAndOffersBanks().subscribe(
      ([loans, offerBank]) => {
        this.loansData = loans;
        this.offers = offerBank.offers;

        if (!this.loansData) {
          this.messageBannerService.setView(
            'Noe gikk feil, vennligst prøv igjen senere. Hvis dette vedvarer, ta kontakt!',
            4000,
            this.animationType.DROP_DOWN_UP,
            'error',
            window
          );
        }

        /*
           Backend returns origin which contains either 1 or 2
          1 is crawler banks, 2 is signicat user
          isFixedPriceBank of type boolean is also included in the returned object to check
         */

        if (this.loansData.origin === 1) this.isSignicatUser = false;
        if (this.loansData.origin === 2) this.isSignicatUser = true;
        if (this.isSignicatUser && this.loansData.isFixedPriceBank)
          this.isFixedPriceBank = true;

        // this.isSignicatUser = false;
        // this.isFixedPriceBank = false;
      },
      (err) => {
        this.errorMessage = err.title;
        this.messageBannerService.setView(
          'Noe gikk feil, vennligst prøv igjen senere',
          4000,
          this.animationType.DROP_DOWN_UP,
          'error',
          window
        );
      }
    );
  }
}
