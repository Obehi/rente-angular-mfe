import {
  LoansService,
  ConfirmationSetDto,
  ConfirmationGetDto,
  MembershipTypeDto,
  AddressCreationDto
} from '@services/remote-api/loans.service';
import { UserService } from '@services/remote-api/user.service';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { LoggingService } from '@services/logging.service';
import {
  Validators,
  AbstractControl,
  FormGroup,
  FormBuilder,
  FormControl
} from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatDialog
} from '@angular/material';
import { Router } from '@angular/router';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { OfferInfo } from '@shared/models/offers';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';

import { Mask } from '@shared/constants/mask';
import { ROUTES_MAP } from '@config/routes-config';
import { CustomLangTextService } from '@services/custom-lang-text.service';
import { MessageBannerService } from '@services/message-banner.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
import { ApiError } from '@shared/constants/api-error';
import { VirdiManualValueDialogComponent } from '@shared/components/ui-components/dialogs/virdi-manual-value-dialog/virdi-manual-value-dialog.component';
import { GlobalStateService } from '@services/global-state.service';

@Component({
  selector: 'rente-init-confirmation-sv',
  templateUrl: './init-confirmation.component.html',
  styleUrls: ['./init-confirmation.component.scss']
})
export class InitConfirmationNoComponent implements OnInit, OnDestroy {
  public propertyForm: FormGroup;
  public isLoading: boolean;
  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public membershipCtrl = new FormControl();
  public filteredMemberships: Observable<MembershipTypeDto[]>;
  public memberships: any = [];
  public allMemberships: MembershipTypeDto[];
  public userData: ConfirmationGetDto;
  public mask = Mask;
  public isAddressNeeded = false;
  public animationType = getAnimationStyles();
  public virdiSuccess = false;
  public estimatedPropertyValueFromVirdi: number;
  public stepFillOutForm: boolean;

  @ViewChild('membershipInput') membershipInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private fb: FormBuilder,
    private loansService: LoansService,
    private router: Router,
    public dialog: MatDialog,
    public customLangTextService: CustomLangTextService,
    private logging: LoggingService,
    private messageBanner: MessageBannerService,
    private globalStateService: GlobalStateService
  ) {
    this.filteredMemberships = this.membershipCtrl.valueChanges.pipe(
      startWith(null),
      map((membership: string | null) =>
        membership ? this.filter(membership) : this.allMemberships.slice()
      )
    );
    this.stepFillOutForm = true;
    this.userData = new ConfirmationGetDto();
  }

  ngOnInit(): void {
    forkJoin([
      this.loansService.getLoansAndRateType(),
      this.loansService.getConfirmationData()
    ]).subscribe(([rateAndLoans, userInfo]) => {
      this.allMemberships = userInfo.availableMemberships;
      this.userData = userInfo;

      const userEmail =
        this.userData.email === null ? null : String(userInfo.email);
      const streetName =
        this.userData.address.street === null
          ? null
          : String(userInfo.address.street);
      const streetZip =
        this.userData.address.zip === null
          ? null
          : String(userInfo.address.zip);
      const income =
        this.userData.income === null ? null : String(userInfo.income);
      const apartmentSize =
        this.userData.address.apartmentSize === null
          ? null
          : String(userInfo.address.apartmentSize);

      const userInfoAndRateAndLoans = { ...userInfo, ...rateAndLoans };
      this.logging.logger(
        this.logging.Level.Info,
        '7:INIT_CONFIRMATION',
        'InitConfirmationNoComponent',
        'ngOnInit',
        this.logging.SubSystem.UserConfirmation,
        '7:INIT_CONFIRMATION',
        userInfoAndRateAndLoans
      );

      this.isAddressNeeded = true;
      this.propertyForm = this.fb.group({
        email: [
          userEmail,
          Validators.compose([
            Validators.required,
            Validators.pattern(VALIDATION_PATTERN.email)
          ])
        ],
        address: [streetName, Validators.required],
        zip: [
          streetZip,
          Validators.compose([
            Validators.required,
            Validators.pattern(VALIDATION_PATTERN.zip)
          ])
        ],
        apartmentSize: [apartmentSize, Validators.required],
        income: [income, Validators.required],
        membership: []
      });
    });

    // Set content background
    this.globalStateService.setContentClassName('content', 'content-blue');
    this.globalStateService.setFooterState(false);
  }

  isErrorState(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public openInfoDialog(offer: OfferInfo | string): void {
    this.dialog.open(DialogInfoComponent, {
      data: offer
    });
  }

  public getConfirmationDtoFromForm(formData): ConfirmationSetDto {
    const data = {
      email: formData.email,
      income:
        typeof formData.income === 'string'
          ? formData.income.replace(/\s/g, '')
          : formData.income,
      memberships: this.memberships.map((membership) => membership.name),
      apartmentSize: formData.apartmentSize,
      propertyType: formData.propertyType
    };

    const confirmationDto: ConfirmationSetDto = new ConfirmationSetDto();
    confirmationDto.address = new AddressCreationDto();
    confirmationDto.email = data.email;
    confirmationDto.income = data.income;
    confirmationDto.memberships = data.memberships;
    confirmationDto.address.apartmentSize = data.apartmentSize;
    confirmationDto.address.propertyType = data.propertyType;
    confirmationDto.address.street = formData.address;
    confirmationDto.address.zip = formData.zip;

    return confirmationDto;
  }

  public getFormValue(): ConfirmationSetDto {
    const form = this.propertyForm.value;

    const aptmSize = Number(form.apartmentSize);

    const address = {
      apartmentSize: aptmSize,
      apartmentValue: this.userData.address.apartmentValue,
      propertyType: null,
      street: form.address,
      zip: form.zip
    };

    const val = this.propertyForm.get('income')?.value;
    const incomeNumber = val.replace(/\s/g, '');

    const sendFormDto = {
      address: address,
      email: form.email,
      income: incomeNumber,
      memberships: this.memberships.map((membership) => membership.name)
    };

    return sendFormDto;
  }

  public convertDto(): ConfirmationSetDto {
    /* 
    Use this function to send api post request with ConfirmationSetDto interface. 
    Is used because the the post api expects a different dto than the get api
    */
    const confDtoWithAprtmentValue: ConfirmationSetDto = new ConfirmationSetDto();
    confDtoWithAprtmentValue.address = this.getFormValue().address;
    confDtoWithAprtmentValue.email = this.getFormValue().email;
    confDtoWithAprtmentValue.income = this.getFormValue().income;
    confDtoWithAprtmentValue.memberships = this.getFormValue().memberships;

    return confDtoWithAprtmentValue;
  }

  public updateProperty(formData): void {
    let data: ConfirmationSetDto;

    if (formData === null || formData === undefined) {
      data = this.convertDto();
    } else {
      data = this.getConfirmationDtoFromForm(formData);
    }

    this.propertyForm.markAllAsTouched();
    this.propertyForm.updateValueAndValidity();

    this.isLoading = true;

    this.loansService.setConfirmationData(data).subscribe(
      () => {
        this.isLoading = false;
        this.stepFillOutForm = false;
        this.virdiSuccess = true;

        // Send get request to fetch the estimated propertyValue
        this.loansService.getAddresses().subscribe((res) => {
          const estimatedValue = res.addresses[0].estimatedPropertyValue;
          if (estimatedValue) {
            this.estimatedPropertyValueFromVirdi = estimatedValue;
          } else {
            this.estimatedPropertyValueFromVirdi = 0;
          }
        });

        // this.router.navigate(['/' + ROUTES_MAP_NO.confirmationProperty]);
        this.logging.logger(
          this.logging.Level.Info,
          '9:USERINFO_SENT_SUCCESSFUL_REDIRECTING_TO_OFFERS',
          'InitConfirmationNoComponent',
          'updateProperty',
          this.logging.SubSystem.UserConfirmation,
          '9:USERINFO_SENT_SUCCESSFUL_REDIRECTING_TO_OFFERS'
        );

        this.messageBanner.setView(
          this.customLangTextService.getSnackBarUpdatedMessage(),
          3000,
          this.animationType.DROP_DOWN_UP,
          'success',
          window
        );
      },
      (err) => {
        this.isLoading = false;
        this.logging.logger(
          this.logging.Level.Info,
          '9:USERINFO_SENT_ERROR_REDIRECTING_TO_PROPERTY',
          'InitConfirmationNoComponent',
          'updateProperty',
          this.logging.SubSystem.UserConfirmation,
          '9:USERINFO_SENT_ERROR_REDIRECTING_TO_PROPERTY',
          err
        );

        console.log(err.errorType);
        if (
          err.errorType === ApiError.virdiSerachNotFound ||
          err.errorType === ApiError.propertyCantFindZip
        ) {
          this.isLoading = false;
          this.dialog.open(VirdiManualValueDialogComponent, {
            data: {
              step: 1,
              address: data.address,
              email: data.email,
              income: data.income,
              memberships: data.memberships,
              confirmText: 'Legg til boligverdi',
              cancelText: 'Gå tilbake',
              finishText: 'Finn beste rente!',
              onConfirm: () => {},
              onClose: () => {},
              onSendForm: (apartmentValue) => {
                // Remove the whitespace
                const value = apartmentValue.replace(/\s/g, '');

                // Send the dataForm with apartment value
                this.userData.address.apartmentValue = Number(value);
                this.updateProperty(undefined);
              }
            }
          });
        }
      }
    );
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      // Reset the input value
      if (input) {
        input.value = '';
      }
      this.membershipCtrl.setValue(null);
    }
  }

  remove(membership, index): void {
    this.allMemberships.push(membership);
    this.allMemberships.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
    this.memberships.splice(index, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.memberships.push(event.option.value);
    this.membershipInput.nativeElement.value = '';
    this.membershipCtrl.setValue(null);
  }

  private filter(value: any): any[] {
    const filterValue = value.label
      ? value.label.toLowerCase()
      : value.toLowerCase();
    this.allMemberships = this.clearDuplicates(
      this.allMemberships,
      this.memberships
    );

    return this.allMemberships.filter((membership) =>
      membership.label.toLowerCase().includes(filterValue)
    );
  }

  private clearDuplicates(array: any[], toRemoveArray: any[]) {
    for (let i = array.length - 1; i >= 0; i--) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < toRemoveArray.length; j++) {
        if (array[i] && array[i].name === toRemoveArray[j].name) {
          array.splice(i, 1);
        }
      }
    }

    return array;
  }

  redirectOffers(): void {
    this.router.navigate(['/dashboard/' + ROUTES_MAP.offers]);
  }

  setManualPropertyValue(): void {
    this.dialog.open(VirdiManualValueDialogComponent, {
      data: {
        step: 2,
        confirmText: 'Legg til boligverdi',
        cancelText: 'Lukk',
        finishText: 'Finn beste rente!',
        onConfirm: () => {},
        onClose: () => {},
        onSendForm: (apartmentValue) => {
          // Remove the whitespace
          const value = apartmentValue.replace(/\s/g, '');

          // Send the dataForm with apartment value
          this.userData.address.apartmentValue = Number(value);
          this.updateProperty(undefined);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.globalStateService.setContentClassName('content-blue', 'content');
    this.globalStateService.setFooterState(true);
  }
}
