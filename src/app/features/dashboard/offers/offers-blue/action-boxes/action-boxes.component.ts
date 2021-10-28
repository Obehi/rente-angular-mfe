import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { BANKS_DATA } from '@config/banks-config';
import { OFFER_SAVINGS_TYPE } from '@config/loan-state';
import { ROUTES_MAP, ROUTES_MAP_NO } from '@config/routes-config';
import { ChangeBankServiceService } from '@services/remote-api/change-bank-service.service';
import { OfferInfo, Offers } from '@shared/models/offers';
import { ChangeBankDialogLangGenericComponent } from 'app/local-components/components-output';
import { forkJoin, Subscription } from 'rxjs';
import { AntiChurnDialogComponent } from '../../anti-churn-dialog/anti-churn-dialog.component';
import { ChangeBankLocationComponent } from '../../change-bank-dialog/change-bank-location/change-bank-location.component';
import { CanNotBargainDialogComponent } from '@features/dashboard/offers/can-not-bargain-dialog/can-not-bargain-dialog.component';
import { LoansService } from '@services/remote-api/loans.service';
import { AntiChurnErrorDialogComponent } from '../../anti-churn-dialog/anti-churn-error-dialog/anti-churn-error-dialog.component';
import { BankUtils, BankVo } from '@models/bank';

@Component({
  selector: 'action-boxes',
  templateUrl: './action-boxes.component.html',
  styleUrls: ['./action-boxes.component.scss']
})
export class ActionBoxesComponent implements OnInit {
  @Input() offersInfo: Offers;
  @Input() offerSavingsType = OFFER_SAVINGS_TYPE;
  @Input() antiChurnIsOn: boolean;
  @Input() isSweden: boolean;
  @Input() canBargain: boolean;
  public changeBankLoading = false;
  public banksMap = BANKS_DATA;
  public routesMap = ROUTES_MAP;
  public offerTypes: string[];
  public currentOfferInfo: Offers;
  public isLoading = true;
  public errorMessage: string;
  public nordeaClickSubscription: Subscription;
  public bankHasFixedLoans: boolean;
  public currentBank: BankVo | null;

  public isNordea = false;
  public isDanskeBank = false;

  constructor(
    private changeBankServiceService: ChangeBankServiceService,
    public router: Router,
    public dialog: MatDialog,
    public loansService: LoansService
  ) {}

  ngOnInit(): void {
    this.currentBank = BankUtils.getBankByName(this.offersInfo.bank);
    this.bankHasFixedLoans = this.currentBank?.hasFixedLoans === true;

    this.isNordea = this.currentBank?.name === 'NORDEA';
    this.isDanskeBank = this.currentBank?.name === 'DANSKE_BANK';
  }

  get bankName(): string | undefined {
    const bank = BankUtils.getBankByName(this.offersInfo.bank);
    return bank?.label;
  }

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  public openAntiChurnBankDialog(offer: OfferInfo): void {
    /*     PUT BACK DISABLED FOR SAVINGSTYPE BEFORE PROD!!!!!
      PUT BACK DISABLED FOR SAVINGSTYPE BEFORE PROD!!!!!
      PUT BACK DISABLED FOR SAVINGSTYPE BEFORE PROD!!!!!
      PUT BACK DISABLED FOR SAVINGSTYPE BEFORE PROD!!!!!
      PUT BACK DISABLED FOR SAVINGSTYPE BEFORE PROD!!!!! */
    console.log(this.antiChurnIsOn);
    console.log(this.changeBankLoading);
    if (this.antiChurnIsOn === false || this.changeBankLoading) {
      return;
    }
    this.changeBankLoading = true;

    const changeBankRef = this.dialog.open(AntiChurnDialogComponent, {
      autoFocus: false,
      data: {
        bestOffer: offer,
        currentBank: this.offersInfo
      }
    });
    changeBankRef.afterClosed().subscribe(() => {
      this.handleChangeBankdialogOnClose(
        changeBankRef.componentInstance.closeState
      );
    });
  }

  public openChangeBankDialog(offer): void {
    if (
      this.changeBankLoading ||
      this.offersInfo.offerSavingsType === this.offerSavingsType.NO_SAVINGS ||
      this.bankHasFixedLoans
    ) {
      return;
    }

    if (
      this.offersInfo.bank === 'SWE_SEB' ||
      this.offersInfo.bank === 'SWE_HANDELSBANKEN'
    ) {
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

  public openBargainMoreInfoDialog(): void {
    if (this.canBargain || !this.isSweden) {
      return;
    }
    const changeBankRef = this.dialog.open(CanNotBargainDialogComponent, {
      autoFocus: false
    });
    changeBankRef.afterClosed().subscribe(() => {
      this.handleChangeBankdialogOnClose(
        changeBankRef.componentInstance.closeState
      );
    });
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
      case 'procced-antichurn': {
        console.log('procced-antichurn');
        this.router.navigate(['/dashboard/' + ROUTES_MAP_NO.bargainNordea], {
          state: {
            isError: false,
            fromChangeBankDialog: true,
            bankName: this.bankName
          }
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

  public goToBestOffer(): void {
    const element = document.getElementById('best-offers-text');
    const headerOffset = this.isMobile ? 80 : 180;

    if (element === null) {
      return;
    }

    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  shouldDisableButton(): boolean {
    if (
      this.changeBankLoading ||
      this.offersInfo.offerSavingsType === this.offerSavingsType.NO_SAVINGS ||
      this.bankHasFixedLoans
    ) {
      return true;
    } else {
      return false;
    }
  }
}
