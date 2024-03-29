import { UserService } from '@services/remote-api/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Validators,
  AbstractControl,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { LoansService } from '@services/remote-api/loans.service';
import {
  ConfirmationSetDto,
  ConfirmationGetDto,
  AddressCreationDto
} from '@shared/models/loans';
import { CustomLangTextService } from '@services/custom-lang-text.service';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { ROUTES_MAP_SV } from '@config/routes-config';
import { OfferInfo } from '@shared/models/offers';
import { Mask } from '@shared/constants/mask';
import { CheckBoxItem } from '@shared/components/ui-components/checkbox-container/checkbox-container.component';
import { GlobalStateService } from '@services/global-state.service';
import { VirdiManualValueDialogComponent } from '@shared/components/ui-components/dialogs/virdi-manual-value-dialog/virdi-manual-value-dialog.component';
import { ROUTES_MAP } from '@config/routes-config';
import { ApiError } from '@shared/constants/api-error';
import { concat } from 'rxjs';
import { toArray } from 'rxjs/operators';

@Component({
  selector: 'rente-init-confirmation-sv',
  templateUrl: './init-confirmation.component.html',
  styleUrls: ['./init-confirmation.component.scss']
})
export class InitConfirmationSVComponent implements OnInit, OnDestroy {
  public propertyForm: FormGroup;
  public isLoading: boolean;
  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public userData: ConfirmationGetDto;
  public mask = Mask;
  public checkBoxItems: CheckBoxItem[];

  // Virdi check
  public virdiSuccess = false;
  public estimatedPropertyValueFromVirdi: number;
  public stepFillOutForm: boolean;

  constructor(
    private fb: FormBuilder,
    private loansService: LoansService,
    private router: Router,
    public dialog: MatDialog,
    public customLangTextService: CustomLangTextService,
    private globalStateService: GlobalStateService
  ) {
    this.stepFillOutForm = true;
  }

  ngOnInit(): void {
    this.initCheckboxes();
    this.loansService.getConfirmationData().subscribe((res) => {
      this.userData = res;
      this.propertyForm = this.fb.group({
        apartmentSize: [String(res.address.apartmentSize), Validators.required],
        email: [
          res.email,
          Validators.compose([
            Validators.required,
            Validators.pattern(VALIDATION_PATTERN.email)
          ])
        ],
        zip: [
          res.address.zip,
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.pattern(VALIDATION_PATTERN.zipSWE)
          ])
        ],
        propertyType: [res.address.propertyType, Validators.required]
      });
    });

    // Set content background
    this.globalStateService.setContentClassName('content', 'content-blue');
  }

  initCheckboxes(): void {
    const house = new CheckBoxItem();
    const apartment = new CheckBoxItem();

    house.name = 'Villa';
    apartment.name = 'Bostadsrätter/</br>lägenhet';

    house.value = 'HOUSE';
    apartment.value = 'APARTMENT';

    house.iconActive = 'round-house-green.svg';
    house.iconDeactivated = 'round-house-grey.svg';

    apartment.iconActive = 'round-apartment-green.svg';
    apartment.iconDeactivated = 'round-apartment-grey.svg';
    this.checkBoxItems = [house, apartment];
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
    const confirmationData = {
      email: formData.email,
      zip:
        typeof formData.zip === 'string'
          ? formData.zip.replace(/\s/g, '')
          : formData.zip,
      apartmentSize:
        typeof formData.apartmentSize === 'string'
          ? Number(formData.apartmentSize.replace(/\s/g, ''))
          : Number(formData.apartmentSize),
      propertyType: formData.propertyType
    };

    const confirmationDto: ConfirmationSetDto = new ConfirmationSetDto();
    confirmationDto.address = new AddressCreationDto();
    confirmationDto.email = confirmationData.email;
    confirmationDto.address.apartmentSize = confirmationData.apartmentSize;
    confirmationDto.address.zip = confirmationData.zip;
    confirmationDto.address.propertyType = confirmationData.propertyType;

    return confirmationDto;
  }

  public getFormValue(): any {
    const form = this.propertyForm.value;

    const aptmSize = Number(form.apartmentSize);

    const address = {
      apartmentSize: aptmSize,
      apartmentValue: this.userData.address.apartmentValue,
      propertyType: form.propertyType,
      zip: typeof form.zip === 'string' ? form.zip.replace(/\s/g, '') : form.zip
    };

    const sendFormDto = {
      address: address,
      email: form.email
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

    return confDtoWithAprtmentValue;
  }

  public updateProperty(formData: any): void {
    let data: ConfirmationSetDto;

    if (formData === null || formData === undefined) {
      data = this.convertDto();
    } else {
      data = this.getConfirmationDtoFromForm(formData);
    }

    this.propertyForm.markAllAsTouched();
    this.propertyForm.updateValueAndValidity();

    this.isLoading = true;

    concat(
      this.loansService.setConfirmationData(data),
      this.loansService.getAddresses()
    )
      .pipe(toArray())
      .subscribe(
        (res: any) => {
          const clientAddressDto = res[1];
          const estimatedValue =
            clientAddressDto.addresses[0].estimatedPropertyValue;

          if (estimatedValue && estimatedValue > 0 && formData !== undefined) {
            this.virdiSuccess = true;
            this.stepFillOutForm = false;
            this.estimatedPropertyValueFromVirdi = estimatedValue;
          }
          if (formData === undefined) {
            this.router.navigate(['/dashboard/' + ROUTES_MAP.offers]);
          }
          this.isLoading = false;
        },
        (err) => {
          this.stepFillOutForm = true;
          this.isLoading = false;
          this.virdiSuccess = false;

          if (err.errorType === ApiError.propertyCantFindZip) {
            this.dialog.open(VirdiManualValueDialogComponent, {
              data: {
                step: 1,
                address: data.address,
                email: data.email,
                income: data.income,
                memberships: data.memberships,
                finishText: 'Hitta bästa räntan!',
                confirmText: 'Lägg till bostadsvärde',
                cancelText: 'Lägg in ny adress',
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

  redirectOffers(): void {
    this.router.navigate(['/dashboard/' + ROUTES_MAP.offers]);
  }

  setManualPropertyValue(): void {
    this.dialog.open(VirdiManualValueDialogComponent, {
      data: {
        step: 2,
        finishText: 'Hitta bästa räntan!',
        confirmText: 'Lägg till bostadsvärde',
        cancelText: 'Stäng',
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
  }
}
