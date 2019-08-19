import { LoansService } from '@services/remote-api/loans.service';
import { OffersService } from './offers.service';
import { OfferInfo, Offers } from './../../../shared/models/offers';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from './dialog-info/dialog-info.component';
import { Loans } from '@shared/models/loans';
import { BANKS_DATA } from '@config/banks-config';
import { Router } from '@angular/router';
import { OFFER_SAVINGS_TYPE, AGGREGATED_RATE_TYPE } from '../../../config/loan-state';
import { LocalStorageService } from '@services/local-storage.service';

@Component({
  selector: 'rente-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
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


  constructor(
    public dialog: MatDialog,
    public offersService: OffersService,
    public loansService: LoansService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  public ngOnInit(): void {
    if (this.localStorageService.getItem('noLoansPresent')) {
      this.router.navigate(['/dashboard/ingenlaan']);
    }
    if (this.localStorageService.getItem('isAggregatedRateTypeFixed')) {
      this.router.navigate(['/dashboard/fastrente']);
    }
    this.loansService.getOffers().subscribe((res: Offers) => {
      console.log('offers', res);
      this.offersInfo = res;
      this.isLoading = false;

      if (!this.offersInfo.offersPresent) {
        this.noOffers = true;
      }

    }, err => {
      if (err.errorType === 'PROPERTY_VALUE_MISSING') {
        this.errorMessage = err.title;
        this.router.navigate(['/dashboard/bolig']);
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

}
