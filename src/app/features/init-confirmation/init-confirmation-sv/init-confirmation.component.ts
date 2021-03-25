import {
  LoansService,
  ConfirmationSetDto,
  ConfirmationGetDto,
  AddressCreationDto
} from '@services/remote-api/loans.service';
import { UserService } from '@services/remote-api/user.service';
import { Component, OnInit } from '@angular/core';
import {
  Validators,
  AbstractControl,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { SnackBarService } from '../../../shared/services/snackbar.service';
import { OfferInfo } from '@shared/models/offers';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { CustomLangTextService } from '@services/custom-lang-text.service';

import { Mask } from '@shared/constants/mask';
import { ROUTES_MAP, ROUTES_MAP_SV } from '@config/routes-config';

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
            Validators.pattern(VALIDATION_PATTERN.zipSWE)
          ])
        ]
      });
    });
  }

  isErrorState(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public openInfoDialog(offer: OfferInfo | string): void {
    this.dialog.open(DialogInfoComponent, {
      data: offer
    });
  }

  public updateProperty(formData): void {
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
          : Number(formData.apartmentSize)
    };

    const confirmationDto: ConfirmationSetDto = new ConfirmationSetDto();
    confirmationDto.address = new AddressCreationDto();
    confirmationDto.email = confirmationData.email;
    confirmationDto.address.apartmentSize = confirmationData.apartmentSize;
    confirmationDto.address.zip = confirmationData.zip;

    this.loansService.setConfirmationData(confirmationDto).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['/' + ROUTES_MAP_SV.confirmationProperty]);
        this.snackBar.openSuccessSnackBar(
          this.customLangTextService.getSnackBarUpdatedMessage(),
          1.2
        );
      },
      () => {
        this.isLoading = false;
        this.router.navigate(['/' + ROUTES_MAP_SV.confirmationProperty]);
      }
    );
  }
}
