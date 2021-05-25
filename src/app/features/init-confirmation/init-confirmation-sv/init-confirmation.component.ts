import {
  Validators,
  AbstractControl,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

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
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
@Component({
  selector: 'rente-init-confirmation-sv',
  templateUrl: './init-confirmation.component.html',
  styleUrls: ['./init-confirmation.component.scss']
})
export class InitConfirmationSVComponent implements OnInit {
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
  constructor(
    private fb: FormBuilder,
    private loansService: LoansService,
    private router: Router,
    public dialog: MatDialog,
    public customLangTextService: CustomLangTextService
  ) {}

  ngOnInit(): void {
    this.initCheckboxes();
    this.loansService.getConfirmationData().subscribe((res) => {
      this.userData = res;
      this.propertyForm = this.fb.group({
        apartmentSize: ['', Validators.required],
        email: [
          res.email,
          Validators.compose([
            Validators.required,
            Validators.pattern(VALIDATION_PATTERN.email)
          ])
        ],
        zip: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.pattern(VALIDATION_PATTERN.zipSWE)
          ])
        ],
        propertyType: ['', Validators.required]
      });
    });
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

  public updateProperty(formData: any): void {
    this.propertyForm.markAllAsTouched();
    this.propertyForm.updateValueAndValidity();

    this.isLoading = true;

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

    this.loansService.setConfirmationData(confirmationDto).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['/' + ROUTES_MAP_SV.confirmationProperty]);
      },
      () => {
        this.isLoading = false;
        this.router.navigate(['/' + ROUTES_MAP_SV.confirmationProperty]);
      }
    );
  }
}
