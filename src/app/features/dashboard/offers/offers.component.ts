import { OffersService } from './offers.service';
import { Offers, OfferInfo } from './../../../shared/models/offers';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from './dialog-info/dialog-info.component';
import { LoansService } from '@services/remote-api/loans.service';
import { Loans } from '@shared/models/loans';
import { BANKS_DATA } from '@config/banks-config';
import { LOAN_STATE_MAP } from '@config/loan-state';

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

  constructor(
    public dialog: MatDialog,
    public offersService: OffersService,
    private loansService: LoansService
  ) { }

  public ngOnInit(): void {
    this.loansService.getLoans().subscribe((res: Loans) => {
      console.log('loans', res);
      this.loans = res;
    });

    this.loansService.getOffers().subscribe((res: Offers) => {
      console.log('offers', res);
      this.offersInfo = res;
    });
  }

  public openOfferDialog(offer: OfferInfo): void {
    this.dialog.open(DialogInfoComponent, {
      width: '600px',
      data: offer
    });
  }

}
