import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { BANKS_DATA } from '@config/banks-config';
import { OFFER_SAVINGS_TYPE } from '@config/loan-state';
import { ROUTES_MAP_NO } from '@config/routes-config';
import { ChangeBankServiceService } from '@services/remote-api/change-bank-service.service';
import { Offers } from '@shared/models/offers';
import { ChangeBankDialogLangGenericComponent } from 'app/local-components/components-output';
import { forkJoin } from 'rxjs';
import { AntiChurnDialogComponent } from '../../anti-churn-dialog/anti-churn-dialog.component';
import { ChangeBankLocationComponent } from '../../change-bank-dialog/change-bank-location/change-bank-location.component';

@Component({
  selector: 'action-boxes',
  templateUrl: './action-boxes.component.html',
  styleUrls: ['./action-boxes.component.scss']
})
export class ActionBoxesComponent implements OnInit {
  @Input() offersInfo: Offers;
  @Input() offerSavingsType = OFFER_SAVINGS_TYPE;
  public isSweden: boolean;
  public changeBankLoading: boolean;
  public antiChurnIsOn = false;
  public banksMap = BANKS_DATA;
  public canBargain: boolean;

  constructor(
    private changeBankServiceService: ChangeBankServiceService,
    public router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  public goToBestOffer(): void {
    const element = document.getElementById('best-offers-text');
    const headerOffset = this.isMobile ? 80 : 180;

    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  public openChangeBankDialog(offer): void {
    if (
      this.changeBankLoading ||
      this.offersInfo.offerSavingsType === this.offerSavingsType.NO_SAVINGS
    ) {
      return;
    }

    if (this.offersInfo.bank === 'SWE_SEB') {
      this.openChangeBankDialogWithLocation(offer);
    } else {
      this.openChangeBankDialogWithOnlyPreview(offer);
    }
  }

  public openChangeBankDialogWithOnlyPreview(offer: any): void {
    this.changeBankLoading = true;
    const offerId = offer.id;
    const currentBank = this.offersInfo.bank;

    this.changeBankServiceService.getBankOfferRequest(offerId).subscribe(
      (preview) => {
        this.changeBankLoading = false;

        const changeBankRef = this.dialog.open(
          ChangeBankDialogLangGenericComponent,
          {
            autoFocus: false,
            data: { preview, offerId, currentBank }
          }
        );
        changeBankRef.afterClosed().subscribe(() => {
          this.handleChangeBankdialogOnClose(
            changeBankRef.componentInstance.closeState
          );
        });
      },
      (err) => {
        this.changeBankLoading = false;
      }
    );
  }

  public openChangeBankDialogWithLocation(offer: any): void {
    this.changeBankLoading = true;
    const offerId = offer.id;
    const currentBank = this.offersInfo.bank;

    forkJoin([
      this.changeBankServiceService.getBankOfferLocations(this.offersInfo.bank),
      this.changeBankServiceService.getBankOfferRequest(offerId)
    ]).subscribe(
      ([locations, preview]) => {
        this.changeBankLoading = false;

        const data = { preview, offerId, currentBank };

        if (locations.error === undefined) {
          data['locations'] = locations;
        }
        const changeBankRef = this.dialog.open(ChangeBankLocationComponent, {
          autoFocus: false,
          data: data
        });
        changeBankRef.afterClosed().subscribe(() => {
          this.handleChangeBankdialogOnClose(
            changeBankRef.componentInstance.closeState
          );
        });
      },
      () => {
        this.changeBankLoading = false;
      }
    );
  }

  public openAntiChurnBankDialog(offer): void {
    if (
      this.antiChurnIsOn === false ||
      this.changeBankLoading ||
      this.offersInfo.offerSavingsType === this.offerSavingsType.NO_SAVINGS
    ) {
      return;
    }
    this.changeBankLoading = true;
    const offerId = offer.id;

    const changeBankRef = this.dialog.open(AntiChurnDialogComponent, {
      autoFocus: false,
      data: offer
    });
    changeBankRef.afterClosed().subscribe(() => {
      this.handleChangeBankdialogOnClose(
        changeBankRef.componentInstance.closeState
      );
    });
  }

  public handleChangeBankdialogOnClose(state: string): void {
    this.changeBankLoading = false;
    switch (state) {
      case 'canceled': {
        break;
      }
      case 'do-nothing': {
        break;
      }
      case 'procced': {
        this.router.navigate(['/dashboard/prute-fullfort'], {
          state: { isError: false, fromChangeBankDialog: true }
        });
        break;
      }
      case 'procced-nordea': {
        this.router.navigate(['/dashboard/' + ROUTES_MAP_NO.bargainNordea], {
          state: { isError: false, fromChangeBankDialog: true }
        });
        break;
      }
      case 'error': {
        this.router.navigate(['/dashboard/prute-fullfort'], {
          state: { isError: false, fromChangeBankDialog: true }
        });
        break;
      }
    }
  }
}
