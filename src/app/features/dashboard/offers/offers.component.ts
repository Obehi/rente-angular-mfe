import { LoansService } from '@services/remote-api/loans.service';
import { OffersService } from './offers.service';
import { OfferInfo, Offers } from './../../../shared/models/offers';
import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from './dialog-info/dialog-info.component';
import { Loans } from '@shared/models/loans';
import { BANKS_DATA } from '@config/banks-config';
import { Router } from '@angular/router';
import { OFFER_SAVINGS_TYPE, AGGREGATED_RATE_TYPE } from '../../../config/loan-state';
import { LocalStorageService } from '@services/local-storage.service';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { ChangeBankDialogComponent } from './change-bank-dialog/change-bank-dialog.component';

@Component({
  selector: 'rente-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('0.5s ease-out',
              style({ height: 200, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: 200, opacity: 1 }),
            animate('0.5s ease-in',
              style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    ),
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
    ),
  ]
})
export class OffersComponent implements OnInit {
  public offersInfo: Offers;
  public loansInfo: any;
  public loans: Loans;
  public banksMap = BANKS_DATA;
  public offerSavingsType = OFFER_SAVINGS_TYPE;
  public aggregatedRateType = AGGREGATED_RATE_TYPE;
  public isLoading = true;
  public errorMessage: string;
  public noOffers: boolean;
  public isSmallScreen: boolean;
  public isShowTips: boolean;


  constructor(
    public dialog: MatDialog,
    public offersService: OffersService,
    public loansService: LoansService,
    private router: Router
  ) {
    this.onResize();
    this.isShowTips = true;
  }

  public ngOnInit(): void {
    this.loansService.getOffers().subscribe((res: Offers) => {
      this.offersInfo = res;
      this.isLoading = false;

      if (!this.offersInfo.offersPresent) {
        this.noOffers = true;
      }

    }, err => {
      if (err.errorType === 'PROPERTY_VALUE_MISSING') {
        this.errorMessage = err.title;
        this.router.navigate(['/bekreft']);
      }
      console.log(err);
    });
  }

  public openOfferDialog(offer: OfferInfo): void {
    this.dialog.open(DialogInfoComponent, {
      width: '600px',
      data: offer
    });
  }

  public openChangeBankDialog(): void {
    this.dialog.open(ChangeBankDialogComponent, {
      width: '800px',
      maxHeight: '90vh'
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    window.innerWidth <= 1024 ? this.isSmallScreen = true : this.isSmallScreen = false;
  }

}
