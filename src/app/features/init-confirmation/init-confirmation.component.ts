import { LoansService, ConfirmationSetDto, ConfirmationGetDto, MembershipTypeDto } from '@services/remote-api/loans.service';
import { UserService } from '@services/remote-api/user.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { SnackBarService } from '../../shared/services/snackbar.service';
import { OfferInfo } from '@shared/models/offers';
import { DialogInfoComponent } from './dialog-info/dialog-info.component';

@Component({
  selector: 'rente-init-confirmation',
  templateUrl: './init-confirmation.component.html',
  styleUrls: ['./init-confirmation.component.scss']
})
export class InitConfirmationComponent implements OnInit {
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
  public userData:ConfirmationGetDto;
  public threeDigitsMask = { mask: [/\d/, /\d/, /\d/], guide: false };
  public thousandSeparatorMask = {
    mask: createNumberMask({
      prefix: '',
      suffix: '',
      thousandsSeparatorSymbol: ' '
    }),
    guide: false
  };

  @ViewChild('membershipInput', { static: false }) membershipInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private loansService: LoansService,
    private snackBar: SnackBarService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.filteredMemberships = this.membershipCtrl.valueChanges.pipe(
      startWith(null),
      map((membership: string | null) =>
        membership ? this.filter(membership) : this.allMemberships.slice()
      )
    );
  }

  ngOnInit() {
    this.loansService.getConfirmationData().subscribe(res => {
      this.allMemberships = res.availableMemberships;
      this.userData = res;
      this.propertyForm = this.fb.group({
        apartmentSize: [res.apartmentSize, Validators.required],
        membership: [],
        income: [res.income, Validators.required],
        email: [res.email, Validators.compose([
            Validators.required,
            Validators.pattern(VALIDATION_PATTERN.email)
          ])
        ]
      });
    });

    /* this.loansService.getMembershipTypes().subscribe((memberships: any) => {
      this.allMemberships = memberships;
      forkJoin([this.userService.getUserInfo(), this.loansService.getAddresses()])
        .subscribe(([user, loan]) => {
          this.userData = user;
          const apartmentSize = loan.addresses && loan.addresses.length > 0 ? loan.addresses[0].apartmentSize : 0;
          this.propertyForm = this.fb.group({
            apartmentSize: [apartmentSize, Validators.required],
            membership: [],
            income: [this.userData.income, Validators.required],
            email: [this.userData.email, Validators.compose([
              Validators.required,
              Validators.pattern(VALIDATION_PATTERN.email)
            ])
          ]
        });
      });
    }); */
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
    const userData = {
      email: formData.email,
      income:
        typeof formData.income === 'string'
          ? formData.income.replace(/\s/g, '')
          : formData.income
    };

    const confirmationData = {
      memberships: this.memberships.map(membership => membership.name),
      apartmentSize: formData.apartmentSize
    };

    const dto:ConfirmationSetDto = new ConfirmationSetDto();
    dto.email = userData.email;
    dto.income = userData.income;
    dto.memberships = confirmationData.memberships;
    dto.apartmentSize = confirmationData.apartmentSize;

    this.loansService.setConfirmationData(dto).subscribe(res => {
      this.isLoading = false;
      this.router.navigate(['/dashboard/tilbud']);
      this.snackBar.openSuccessSnackBar('Endringene dine er lagret', 1.2);
    },
    err => {
      this.isLoading = false;
      this.router.navigate(['/dashboard/bolig']);
    });
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

    return this.allMemberships.filter(membership =>
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
