import {
  LoansService,
  ConfirmationSetDto,
  ConfirmationGetDto,
  MembershipTypeDto,
  AddressCreationDto
} from '@services/remote-api/loans.service';
import { UserService } from '@services/remote-api/user.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { BankUtils } from '../../../shared/models/bank';

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

import { Mask } from '@shared/constants/mask';
import { OptimizeService } from '@services/optimize.service';
import { ROUTES_MAP } from '@config/routes-config';
import { CustomLangTextService } from '@services/custom-lang-text.service';

@Component({
  selector: 'rente-init-confirmation-sv',
  templateUrl: './init-confirmation.component.html',
  styleUrls: ['./init-confirmation.component.scss']
})
export class InitConfirmationNoComponent implements OnInit {
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
  public optimizeService: OptimizeService;
  public isTinkBank = false;

  @ViewChild('membershipInput') membershipInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private loansService: LoansService,
    private snackBar: SnackBarService,
    private router: Router,
    public dialog: MatDialog,
    public optimize: OptimizeService,
    public customLangTextService: CustomLangTextService
  ) {
    this.optimizeService = optimize;
    this.filteredMemberships = this.membershipCtrl.valueChanges.pipe(
      startWith(null),
      map((membership: string | null) =>
        membership ? this.filter(membership) : this.allMemberships.slice()
      )
    );
  }

  ngOnInit() {
    this.loansService;

    forkJoin([
      this.loansService.getLoansAndRateType(),
      this.loansService.getConfirmationData()
    ]).subscribe(([rateAndLoans, userInfo]) => {
      this.allMemberships = userInfo.availableMemberships;
      this.userData = userInfo;
      console.log('userInfo');
      console.log(userInfo);
      console.log('rateAndLoans');
      console.log(rateAndLoans);
      const income = String(userInfo.income) || null;
      const apartmentSize = String(userInfo.apartmentSize) || null;
      const apartmentValue = String(userInfo.apartmentValue) || null;

      // this.userData.bank = 'HANDELSBANKEN';
      const bank = BankUtils.getBankByName(this.userData.bank);
      const isTinkBank = BankUtils.isTinkBank(bank.name);
      this.isTinkBank = true;

      const name = this.userData.name || '';

      console.log('name');
      console.log(name);
      if (this.isTinkBank) {
        this.isTinkBank = true;
        this.propertyForm = this.fb.group({
          name: [name, Validators.required],
          address: ['', Validators.required],
          zip: [
            '',
            Validators.compose([
              Validators.required,
              Validators.pattern(VALIDATION_PATTERN.zip)
            ])
          ],
          apartmentValue: [apartmentValue, Validators.required],
          apartmentSize: [apartmentSize, Validators.required],
          membership: [],
          income: [income, Validators.required],
          email: [
            userInfo.email,
            Validators.compose([
              Validators.required,
              Validators.pattern(VALIDATION_PATTERN.email)
            ])
          ]
        });
      } else {
        this.propertyForm = this.fb.group({
          apartmentSize: [apartmentSize, Validators.required],
          membership: [],
          income: [income, Validators.required],
          email: [
            userInfo.email,
            Validators.compose([
              Validators.required,
              Validators.pattern(VALIDATION_PATTERN.email)
            ])
          ]
        });
      }
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

    const data = {
      email: formData.email,
      income:
        typeof formData.income === 'string'
          ? formData.income.replace(/\s/g, '')
          : formData.income,
      memberships: this.memberships.map((membership) => membership.name),
      apartmentSize: formData.apartmentSize,
      name: this.isTinkBank ? formData.name : this.userData.name
    };

    const confirmationDto: ConfirmationSetDto = new ConfirmationSetDto();
    confirmationDto.addressCreationDto = new AddressCreationDto();
    confirmationDto.name = data.name;
    confirmationDto.email = data.email;
    confirmationDto.income = data.income;
    confirmationDto.memberships = data.memberships;
    confirmationDto.addressCreationDto.apartmentSize = data.apartmentSize;

    if (this.isTinkBank) {
      confirmationDto.addressCreationDto.apartmentValue =
        typeof formData.apartmentValue === 'string'
          ? formData.income.replace(/\s/g, '')
          : formData.income;
      confirmationDto.addressCreationDto.street = formData.address;
      confirmationDto.addressCreationDto.zip = formData.zip;
      confirmationDto.bank = this.userData.bank;
    }
    this.loansService.setConfirmationData(confirmationDto).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/' + ROUTES_MAP.offers]);
        this.snackBar.openSuccessSnackBar(
          this.customLangTextService.getSnackBarUpdatedMessage(),
          1.2
        );
      },
      (err) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/' + ROUTES_MAP.property]);
      }
    );
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

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
}
