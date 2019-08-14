import { LoansService } from '@services/remote-api/loans.service';
import { OffersService } from './offers.service';
import { OfferInfo, Offers } from './../../../shared/models/offers';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from './dialog-info/dialog-info.component';
import { Loans } from '@shared/models/loans';
import { BANKS_DATA } from '@config/banks-config';
import { LOAN_STATE_MAP } from '@config/loan-state';
import { Router } from '@angular/router';

@Component({
  selector: 'rente-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  public offersInfo: any;
  public loansInfo: any;
  public loans: Loans;
  public banksMap = BANKS_DATA;
  public loanStateMap = LOAN_STATE_MAP;
  public isLoading = true;
  public errorMessage: string;
  public noOffers: boolean;
  public fixedAggRateType: boolean;


  constructor(
    public dialog: MatDialog,
    public offersService: OffersService,
    public loansService: LoansService,
    private router: Router
  ) { }

  public ngOnInit(): void {

    this.loansService.getOffers().subscribe((res: Offers) => {
      console.log('offers', res);
      this.offersInfo = res;
      this.isLoading = false;

      if (res.currentLoanState === this.loanStateMap.NO_OFFERS) {
        this.noOffers = true;
      }
      if (res.currentLoanState === this.loanStateMap.FIXED_AGG_RATE_TYPE) {
        this.fixedAggRateType = true;
      }

    }, err => {
      if (err.errorType === 'PROPERTY_VALUE_MISSING') {
        this.errorMessage = err.title;
        this.router.navigate(['/init-confirmation']);
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
