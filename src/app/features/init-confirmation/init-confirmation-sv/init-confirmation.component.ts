import {
  LoansService,
  ConfirmationSetDto,
  ConfirmationGetDto,
  AddressCreationDto
} from '@services/remote-api/loans.service';
import { UserService } from '@services/remote-api/user.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import {
  Validators,
  AbstractControl,
  FormGroup,
  NgForm,
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
import { SnackBarService } from '../../../shared/services/snackbar.service';
import { OfferInfo } from '@shared/models/offers';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { CustomLangTextService } from '@services/custom-lang-text.service';

import { Mask } from '@shared/constants/mask';
import { ROUTES_MAP } from '@config/routes-config';

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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private loansService: LoansService,
    private snackBar: SnackBarService,
    private router: Router,
    public dialog: MatDialog,
    public customLangTextService: CustomLangTextService
  ) {}

  ngOnInit(): void {
    this.loansService.getConfirmationData().subscribe((res) => {
      this.userData = res;

      const income = String(res.income) && null;
      const apartmentSize = String(res.apartmentSize) && null;

      this.propertyForm = this.fb.group({
        apartmentValue: ['', Validators.required],
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
            Validators.pattern(VALIDATION_PATTERN.zipSWE)
          ])
        ]
      });
    });
  }

  isErrorState(
    control: AbstractControl | null,
    form: FormGroup | NgForm | null
  ): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public openInfoDialog(offer: OfferInfo): void {
    this.dialog.open(DialogInfoComponent, {
      data: offer
    });
  }

  public updateProperty(formData) {
    this.propertyForm.markAllAsTouched();
    this.propertyForm.updateValueAndValidity();

    this.isLoading = true;

    const confirmationData = {
      email: formData.email,
      zip:
        typeof formData.zip === 'string'
          ? formData.zip.replace(/\s/g, '')
          : formData.zip,
      apartmentValue:
        typeof formData.apartmentValue === 'string'
          ? Number(formData.apartmentValue.replace(/\s/g, ''))
          : Number(formData.apartmentValue)
    };

    const confirmationDto: ConfirmationSetDto = new ConfirmationSetDto();
    confirmationDto.address = new AddressCreationDto();
    confirmationDto.email = confirmationData.email;
    confirmationDto.address.apartmentValue = confirmationData.apartmentValue;
    confirmationDto.address.zip = confirmationData.zip;

    this.loansService.setConfirmationData(confirmationDto).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/' + ROUTES_MAP.offers]);
        this.snackBar.openSuccessSnackBar(
          this.customLangTextService.getSnackBarUpdatedMessage(),
          1.2
        );
      },
      () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/' + ROUTES_MAP.property]);
      }
    );
  }
}
