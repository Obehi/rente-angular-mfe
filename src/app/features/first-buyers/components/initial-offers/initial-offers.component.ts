import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  AbstractControl,
  NgForm,
  ValidatorFn,
  ValidationErrors
} from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatDialog,
  MatStepper
} from '@angular/material';
import { Router } from '@angular/router';
import {
  FirstBuyersService,
  FirstBuyersState
} from '@features/first-buyers/first-buyers.service';
import { FirstBuyersAPIService } from '@services/remote-api/first-buyers.service';
import {
  LoansService,
  MembershipTypeDto
} from '@services/remote-api/loans.service';
import { BankList, MissingBankList } from '@shared/models/bank';
import { combineLatest, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  flatMap,
  map,
  startWith,
  switchMap,
  take
} from 'rxjs/operators';
import { SeoService } from '@services/seo.service';
import { PropertySelectDialogComponent } from '../property-select-dialog/property-select-dialog.component';
import { MembershipService } from '@services/membership.service';

@Component({
  selector: 'rente-initial-offers',
  templateUrl: './initial-offers.component.html',
  styleUrls: ['./initial-offers.component.scss']
})
export class InitialOffersComponent implements OnInit {
  loanToValueRatioValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const outstandingDebt = control.get('outstandingDebt')?.value;
    const savings = control.get('savings')?.value;
    const isValid = outstandingDebt / (outstandingDebt + savings) > 0.85;
    this.isAboveLoanToValueRatioTreshold = isValid;
    return isValid ? { loanToValueRatio: isValid } : null;
  };

  loantoRatioMinimumAmount() {
    const outstandingDebt = Number(
      this.formGroup.get('outstandingDebt')?.value
    );
    const minimumAmount = Math.ceil(outstandingDebt * 0.176470588);
    return Math.round(minimumAmount / 1000) * 1000;
  }
  isAboveLoanToValueRatioTreshold = true;
  editMode = false;
  banksData = [...BankList, ...MissingBankList];
  bank;
  offers;
  formGroup: FormGroup = new FormGroup(
    {
      savings: new FormControl(),
      outstandingDebt: new FormControl(),
      income: new FormControl(),
      otherDebt: new FormControl(),
      memberships: new FormControl(),
      age: new FormControl(),
      firstLoan: new FormControl(),
      localBanks: new FormControl()
    },
    { validators: this.loanToValueRatioValidator, updateOn: 'blur' }
  );
  public allMemberships: any[] = [];
  selectedIndex: number | null = 1;
  public filteredMemberships: Observable<MembershipTypeDto[]>;
  public memberships: MembershipTypeDto[] = [];
  public changeBankLoading: boolean;
  public exampleArray = [
    { id: 1, label: 'DNB' },
    { id: 1, label: 'asd' },
    { id: 1, label: 'sad' },
    { id: 1, label: 'DaNB' },
    { id: 1, label: 'DdNB' },
    { id: 1, label: 'DNB' },
    { id: 1, label: 'DzNB' },
    { id: 1, label: 'D3NB' },

    { id: 1, label: 'DNB' },
    { id: 1, label: 'DN1B' },
    { id: 1, label: 'D23NB' },
    { id: 1, label: 'DNB' },
    { id: 1, label: 'D3NB' },
    { id: 1, label: 'DN3B' },
    { id: 1, label: 'DNB' },
    { id: 1, label: 'D2NB' }
  ];
  properties = [
    {
      icon: 'monetization_on',
      iconPath: '../../../../assets/icons/wallet-light-blue.svg',
      label: 'Egenkapital',
      inputType: 'tel',
      placeholder: 'Fyll inn',
      controlName: 'savings',
      shouldDisplay: () => {
        return true;
      }
    },
    {
      icon: 'account_balance',
      label: 'Lånebeløp',
      inputType: 'tel',
      controlName: 'outstandingDebt',
      shouldDisplay: () => {
        return (
          this.outstandingDebtControl.value || this.outstandingDebtControl.dirty
        );
      }
    },
    {
      icon: 'toll',
      label: 'Annen gjeld',
      inputType: 'tel',
      controlName: 'otherDebt',
      shouldDisplay: () => {
        return this.otherDebtControl.value;
      }
    },
    {
      icon: 'accessibility',
      iconPath: '../../../../assets/icons/person-light-blue.svg',
      label: 'Alder',
      inputType: 'dropdown',
      controlName: 'age',
      shouldDisplay: () => {
        return true;
      },
      options: [
        {
          value: true,
          label: '35 eller eldre'
        },
        {
          value: false,
          label: '34 eller yngre'
        }
      ]
    }
  ];

  extraProperties = [
    {
      icon: 'card_membership',
      iconPath: '../../../../assets/icons/bank-card-light-blue.svg',
      label: 'Medlemskap',
      inputType: 'autocomplete',
      controlName: 'memberships',
      shouldDisplay: () => {
        return true;
      },
      options: this.allMemberships
    },
    {
      icon: 'apartment',
      iconPath: '../../../../assets/icons/house-light-blue.svg',
      label: 'Første bolig?',
      inputType: 'dropdown',
      controlName: 'firstLoan',
      shouldDisplay: () => {
        return true;
      },
      options: [
        {
          value: true,
          label: 'Ja'
        },
        {
          value: false,
          label: 'Nei'
        }
      ]
    },
    {
      icon: 'apartment',
      iconPath: '../../../../assets/icons/local-bank.png',
      label: 'Vis lokale tilbud',
      inputType: 'dropdown',
      controlName: 'localBanks',
      shouldDisplay: () => {
        return true;
      },
      options: [
        {
          value: true,
          label: 'Ja'
        },
        {
          value: false,
          label: 'Nei'
        }
      ]
    }
  ];

  // Removed from property json for now
  /*  {
    icon: 'point_of_sale',
    iconPath: '../../../../assets/icons/money-light-blue.svg',
    label: 'Inntekt',
    inputType: 'tel',
    controlName: 'income',
    shouldDisplay: () => {
      return this.incomeControl.value;
    }
  } */
  @ViewChild('stepper') stepper: MatStepper;
  incomeStepShown = false;
  incomeChips = [
    300000,
    400000,
    500000,
    600000,
    700000,
    800000,
    900000,
    1000000
  ];
  otherDebtChips = [
    100000,
    200000,
    300000,
    400000,
    500000,
    600000,
    700000,
    800000,
    900000,
    0
  ];
  aged: boolean;
  offersLoading: boolean;
  selectedFeaturedMemberships: MembershipTypeDto[] = [];
  featuredMemberships: MembershipTypeDto[] = [];
  hasUpdatedOffers = false;

  constructor(
    private loansService: LoansService,
    private firstBuyersService: FirstBuyersService,
    private firstBuyersAPIService: FirstBuyersAPIService,
    private membershipService: MembershipService,
    private router: Router,
    private seoService: SeoService,
    public dialog: MatDialog
  ) {}

  get outstandingDebtControl(): AbstractControl {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.formGroup.get('outstandingDebt')!;
  }

  get savingsControl(): AbstractControl {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.formGroup.get('savings')!;
  }

  get incomeControl(): AbstractControl {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.formGroup.get('income')!;
  }

  get otherDebtControl(): AbstractControl {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.formGroup.get('otherDebt')!;
  }

  get membershipsControl(): AbstractControl {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.formGroup.get('memberships')!;
  }

  get ageControl(): AbstractControl {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.formGroup.get('age')!;
  }
  get localBanks(): AbstractControl {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.formGroup.get('localBanks')!;
  }

  get firstLoanControl(): AbstractControl {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.formGroup.get('firstLoan')!;
  }

  subscribeToControllers(): void {
    combineLatest([
      this.outstandingDebtControl.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((val) => {
          return this.firstBuyersAPIService.updateOutstandingDebt(val);
        })
      ),
      this.incomeControl.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((val) => {
          return this.firstBuyersAPIService.updateIncome(val);
        })
      ),
      this.savingsControl.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((val) => {
          return this.firstBuyersAPIService.updateSavings(val);
        })
      ),
      this.otherDebtControl.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((val) => {
          return this.firstBuyersAPIService.updateOtherDebt(val);
        })
      ),
      this.ageControl.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((val) => {
          return this.firstBuyersAPIService.updateBirthdate(val);
        })
      ),
      this.localBanks.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((val) => {
          return this.firstBuyersAPIService.updatelocalOffers(val);
        })
      ),
      this.firstLoanControl.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((val) => {
          return this.firstBuyersAPIService.updateQualify4Blu(val);
        })
      )
    ]).subscribe(() => {
      this.formGroup.markAsDirty();
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.memberships.indexOf(event.option.value) === -1) {
      this.memberships.push(event.option.value);
      this.updateMemberships();
    }
    this.membershipsControl.reset();
  }

  updateMemberships() {
    this.membershipService.selectedMemberships = [
      ...this.memberships,
      ...this.selectedFeaturedMemberships
    ];
    this.firstBuyersAPIService
      .updateMembership(
        this.membershipService.selectedMemberships.map((item) => item.name)
      )
      .subscribe((_) => {
        this.formGroup.markAsDirty();
      });
  }

  updateMemberships2(memberships) {
    this.membershipService.selectedMemberships = [
      ...this.memberships,
      ...this.selectedFeaturedMemberships
    ];
    this.firstBuyersAPIService.updateMembership(memberships).subscribe((_) => {
      this.formGroup.markAsDirty();
    });
  }

  isAllDataFilled() {
    return !!(
      this.outstandingDebtControl.value &&
      this.savingsControl.value &&
      this.incomeControl.value &&
      this.otherDebtControl.value &&
      this.ageFilled() &&
      this.firstLoanFilled() &&
      this.memberships.length
    );
  }

  isErrorState(
    control: AbstractControl | null,
    form: FormGroup | NgForm | null
  ): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = nameRe.test(control.value);
      return { forbiddenName: true };
    };
  }

  selectAge(aged: boolean): void {
    this.ageControl.patchValue(aged);
  }

  selectFirstLoan(firstLoan: boolean): void {
    this.firstLoanControl.patchValue(firstLoan);
  }

  toggleFeaturedMemberships(membership: MembershipTypeDto): void {
    if (this.selectedFeaturedMemberships.indexOf(membership) === -1) {
      this.selectedFeaturedMemberships.push(membership);
    } else {
      this.selectedFeaturedMemberships.splice(
        this.selectedFeaturedMemberships.indexOf(membership),
        1
      );
    }
    this.updateMemberships();
  }

  deleteMembership(membership): void {
    this.memberships.splice(this.memberships.indexOf(membership), 1);
    this.updateMemberships();
  }

  applyMemberships(memberships: MembershipTypeDto[]): void {
    // causing ExpressionChangedAfterItHasBeenCheckedError since commit 9aaa47db or the one before
    this.memberships = memberships;
    this.updateMemberships();
    this.formGroup.markAsDirty();
  }

  ngOnInit(): void {
    this.seoService.createLinkForCanonicalURL();
    if (!this.firstBuyersService.offerValue?.outstandingDebt) {
      this.router.navigate(['boliglanskalkulator']);
      return;
    } else {
      this.outstandingDebtControl.patchValue(
        this.firstBuyersService.offerValue.outstandingDebt
      );
    }

    this.subscribeToControllers();

    this.membershipService.messages().subscribe(() => {
      this.formGroup.markAsDirty();
    });

    if (!this.firstBuyersService.offerValue?.income) {
      this.incomeStepShown = true;
    } else {
      this.incomeControl.patchValue(this.firstBuyersService.offerValue.income);
    }

    this.loansService.getConfirmationData().subscribe((dto) => {
      this.allMemberships = dto.availableMemberships;
      // this.extraProperties[0].options = dto.availableMemberships;
      // console.log(this.allMemberships);
      this.extraProperties[0].options = this.allMemberships;
      this.featuredMemberships = this.allMemberships.filter((membership) => {
        return (
          membership.name === 'AKADEMIKERNE' ||
          membership.name === 'LO_LOFAVOR' ||
          membership.name === 'UNIO'
        );
      });
    });

    this.filteredMemberships = this.membershipsControl.valueChanges.pipe(
      startWith(null),
      map((membership: string | null) =>
        membership ? this.filter(membership) : this.allMemberships.slice()
      )
    );

    this.formGroup.valueChanges.subscribe(() => {
      if (this.isAllDataFilled()) {
        this.stepper._steps.forEach((step) => {
          step.state = 'done';
        });
      }
    });

    this.updateNewOffers();
    console.log(this.allMemberships);
  }

  updateNewOffers() {
    if (
      (!this.formGroup.dirty || this.isAboveLoanToValueRatioTreshold) &&
      this.hasUpdatedOffers === true
    ) {
      return;
    }

    this.hasUpdatedOffers = true;
    this.offersLoading = true;
    this.formGroup.markAsPristine();
    this.loansService
      .updateNewOffers()
      .pipe(
        flatMap(() => {
          return this.loansService.getOffers();
        }),
        take(1)
      )
      .subscribe(
        (dto) => {
          this.offers = [
            ...dto.offers.top5,
            ...dto.offers.additionalPartnersOffers
          ];
          this.offersLoading = false;
        },
        () => {
          this.offersLoading = false;
        }
      );
  }

  nextStep(): void {
    this.stepper.next();
  }

  isBoolean(val: any): boolean {
    return val !== null;
  }

  firstLoanFilled() {
    return (
      (this.isBoolean(this.firstLoanControl.value) &&
        !this.firstLoanControl.value) ||
      (this.isBoolean(this.firstLoanControl.value) &&
        this.firstLoanControl.value)
    );
  }

  ageFilled(): boolean {
    return (
      (this.isBoolean(this.ageControl.value) && !this.ageControl.value) ||
      (this.isBoolean(this.ageControl.value) && this.ageControl.value)
    );
  }

  toggleEditMode(): void {
    this.editMode = false;
    this.selectedIndex = null;
    this.updateNewOffers();
  }

  private filter(value: any): any[] {
    const filterValue = value.label
      ? value.label.toLowerCase()
      : value.toLowerCase();

    return this.allMemberships.filter((membership) =>
      membership.label.toLowerCase().includes(filterValue)
    );
  }
}
