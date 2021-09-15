import { LoansService } from '@services/remote-api/loans.service';
import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AddressDto } from '@shared/models/loans';
import { DeactivationGuarded } from '@shared/guards/route.guard';
import { locale } from '../../../config/locale/locale';
import { HouseFormErrorDialogComponent } from './error-dialog/error-dialog.component';
import { ManualInputDialogComponent } from './manual-input-dialog/manual-input-dialog.component';
import { MatDialog } from '@angular/material';
import { EventService, Events } from '@services/event-service';
import { EnvService } from '@services/env.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
  // ...
} from '@angular/animations';
import { MessageBannerService } from '@services/message-banner.service';
import { CustomLangTextService } from '@services/custom-lang-text.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
import { NotificationService } from '@services/notification.service';
import { HouseErrorDialogSv } from './error-dialog-sv/house-error-dialog-sv.component';

@Component({
  selector: 'rente-houses',
  templateUrl: './houses.component.html',
  styleUrls: ['./houses.component.scss'],
  animations: [
    trigger('loading', [
      // ...
      state('false', style({})),
      transition(':enter', []),
      transition('* => *', [
        animate(
          '6s',
          keyframes([
            style({ opacity: 1, offset: 0.1 }),
            style({ opacity: 1, offset: 0.8 }),
            style({ opacity: 0, offset: 1 })
          ])
        )
      ])
    ])
  ]
})
export class HousesComponent implements OnInit, DeactivationGuarded {
  isLoading: boolean;
  addresses: AddressDto[];
  showAddresses: boolean;
  changesMade = false;
  public canNavigateBooolean$: Subject<boolean> = new Subject<boolean>();
  public canLeavePage = true;
  public updateAnimationTrigger: boolean;
  public errorAnimationTrigger: boolean;
  public locale: string;
  public errorMessage: string;
  public isError = false;
  public dialog: MatDialog;
  public showExplainText: boolean;
  public propertyIconPath: string | null;
  public animationType = getAnimationStyles();
  public addressId: number;

  constructor(
    private loansService: LoansService,
    eventService: EventService,
    dialog: MatDialog,
    public envService: EnvService,
    private messageBanner: MessageBannerService,
    private customLangTextService: CustomLangTextService,
    private notificationService: NotificationService
  ) {
    this.dialog = dialog;

    eventService.on(Events.INPUT_CHANGE, () => {
      this.saveAddresses();
    });
  }

  ngOnInit(): void {
    this.locale = locale;
    this.isLoading = true;
    this.loansService.getAddresses().subscribe((r) => {
      this.isLoading = false;
      this.addresses = r.addresses;
      this.addressId = r.addresses.length;
      this.showAddresses = true;

      if (
        history.state.data !== undefined &&
        history.state.data.fromConfirmProperty === true
      ) {
        this.showExplainText = true;

        const propertyType = r.addresses[0].propertyType;
        this.propertyIconPath =
          propertyType === 'HOUSE'
            ? '../../../../assets/icons/round-house-primary-blue.svg'
            : propertyType === 'APARTMENT'
            ? '../../../../assets/icons/round-apartment-primary-blue.svg'
            : null;
      }
    });
  }

  // DeactivationGuarded Interface method.
  // Gets called every time user navigates from this page.
  // Determines if you can leave this page or if you have to wait.
  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    if (this.canLeavePage) return true;

    // Wait for upload info before navigating to another page
    this.isLoading = true;
    return this.canNavigateBooolean$;
  }

  addAddress(): void {
    if (this.addresses.length < 4) {
      const addr = new AddressDto();
      if (locale.includes('nb')) {
        addr.useManualPropertyValue = false;
      }
      this.addresses.push(addr);
      this.addressId++;
    }
  }

  deleteAddress(address: AddressDto): void {
    this.changesMade = true;
    const i: number = this.addresses.indexOf(address);
    if (i > -1) {
      this.addresses.splice(i, 1);
      this.saveAddresses();
    }
  }

  scrollTo(divId: number): void {
    setTimeout(() => {
      document.getElementById(`${divId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start'
      });
    }, 100);
  }

  get ableToAddAddress(): boolean {
    return this.addresses.length < 4;
  }

  get totalPropertyValue(): number {
    let res = 0;
    if (this.addresses) {
      this.addresses.forEach((a) => {
        if (a.useManualPropertyValue && a.manualPropertyValue) {
          res += a.manualPropertyValue;
        } else if (a.estimatedPropertyValue) {
          res += a.estimatedPropertyValue;
        }
      });
    }
    return res;
  }
  countChange(): void {
    this.changesMade = true;
  }
  saveAddresses(): void {
    this.isLoading = true;
    this.canLeavePage = false;

    this.loansService.updateAddress(this.addresses).subscribe(
      (res) => {
        this.addresses = res.addresses;

        for (const address of res.addresses) {
          if (this.envService.isNorway() === true) {
            if (
              address.error === true ||
              (address.useManualPropertyValue === false &&
                address.estimatedPropertyValue === null)
            ) {
              this.handleErrorState();
              this.dialog.open(HouseFormErrorDialogComponent);
              return;
            }
          }

          if (this.envService.isSweden() === true) {
            if (address.error === true) {
              this.handleErrorState();
              this.dialog.open(HouseErrorDialogSv);
              return;
            } else if (
              address.useManualPropertyValue === false &&
              address.estimatedPropertyValue === 0
            ) {
              this.openManualInputDialog(address);
              return;
            }
          }
        }

        this.notificationService.setOfferNotification();
        this.messageBanner.setSavedViewBolig(
          this.customLangTextService.getSnackBarUpdatedMessage(),
          2000,
          this.animationType.DROP_DOWN_UP,
          'success',
          window
        );

        this.canNavigateBooolean$.next(true);
      },
      () => {
        this.errorMessage = 'Oops, noe gikk galt';
        this.isLoading = false;
        this.changesMade = false;
        this.errorAnimationTrigger = !this.errorAnimationTrigger;
        this.canLeavePage = true;
      },
      () => {
        if (this.isError) {
          this.isError = false;
          this.errorMessage = '';
          return;
        }

        this.changesMade = false;
        this.isLoading = false;
        this.updateAnimationTrigger = !this.updateAnimationTrigger;
        this.canLeavePage = true;
      }
    );
  }

  private openManualInputDialog(address: AddressDto) {
    this.handleErrorState();

    const changeBankRef = this.dialog.open(ManualInputDialogComponent, {});

    changeBankRef.afterClosed().subscribe(() => {
      const state = changeBankRef.componentInstance.closeState;
      switch (state?.state) {
        case '': {
          break;
        }
        case 'resend-request': {
          address.useManualPropertyValue = true;
          address.manualPropertyValue = state?.value;
          this.saveAddresses();
          this.canLeavePage = true;
          break;
        }
      }
    });
  }

  handleErrorState(): void {
    this.isLoading = false;
    this.changesMade = false;
    this.canLeavePage = true;
    this.isError = true;
  }
  get ableToSave(): boolean {
    let res = true;
    if (this.isLoading) {
      res = false;
    } else if (this.addresses !== null) {
      let isCorrect = true;
      for (const a of this.addresses) {
        if (!this.isCorrectAddress(a)) {
          isCorrect = false;
          break;
        }
      }
      res = isCorrect;
    } else {
      res = false;
    }
    return res;
  }

  isCorrectAddress(a: AddressDto): boolean {
    if (
      a.useManualPropertyValue &&
      a.manualPropertyValue !== null &&
      a.manualPropertyValue !== undefined
    ) {
      return a.manualPropertyValue > 0;
    } else {
      return (
        this.notEmpty(a.street) && this.notEmpty(a.zip) && a.apartmentSize > 0
      );
    }
  }

  notEmpty(s: string | null): boolean {
    return s !== null && String(s).length > 0;
  }
}
