import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  AbstractControl,
  NgForm,
  ValidatorFn,
  ValidationErrors
} from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatStepper } from '@angular/material';
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

@Component({
  selector: 'rente-initial-offers',
  templateUrl: './initial-offers.component.html',
  styleUrls: ['./initial-offers.component.scss']
})
export class InitialOffersComponent implements OnInit {
  loanToValueRatioValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const outstandingDebt = control.get('outstandingDebt').value;
    const savings = control.get('savings').value;
    console.log(outstandingDebt / (outstandingDebt + savings));
    const isValid = outstandingDebt / (outstandingDebt + savings) > 0.85;
    this.aboveLoanToValueRatioTreshold = isValid;
    return isValid ? { loanToValueRatio: isValid } : null;
  };
  aboveLoanToValueRatioTreshold = true;
  editMode = false;
  banksData = [...BankList, ...MissingBankList];
  bank;
  offers;
  formGroup: FormGroup = new FormGroup(
    {
      savings: new FormControl('', this.forbiddenNameValidator(/bob/i)),
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
  public allMemberships: MembershipTypeDto[] = [];
  selectedIndex = 1;
  public filteredMemberships: Observable<MembershipTypeDto[]>;
  public memberships: MembershipTypeDto[] = [];
  properties = [
    {
      icon: 'monetization_on',
      iconPath: '../../../../assets/icons/wallet-light-blue.svg',
      label: 'Egenkapital',
      inputType: 'tel',
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
      icon: 'point_of_sale',
      iconPath: '../../../../assets/icons/money-light-blue.svg',
      label: 'Inntekt',
      inputType: 'tel',
      controlName: 'income',
      shouldDisplay: () => {
        return this.incomeControl.value;
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

  constructor(
    private loansService: LoansService,
    private firstBuyersService: FirstBuyersService,
    private firstBuyersAPIService: FirstBuyersAPIService,
    private router: Router,
    private seoService: SeoService
  ) {}

  get outstandingDebtControl() {
    return this.formGroup.get('outstandingDebt');
  }

  get savingsControl() {
    return this.formGroup.get('savings');
  }

  get incomeControl() {
    return this.formGroup.get('income');
  }

  get otherDebtControl() {
    return this.formGroup.get('otherDebt');
  }

  get membershipsControl() {
    return this.formGroup.get('memberships');
  }

  get ageControl() {
    return this.formGroup.get('age');
  }
  get localBanks() {
    return this.formGroup.get('localBanks');
  }

  get firstLoanControl() {
    return this.formGroup.get('firstLoan');
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
    this.firstBuyersService.selectedMemberships = [
      ...this.memberships,
      ...this.selectedFeaturedMemberships
    ];
    this.firstBuyersAPIService
      .updateMembership(
        this.firstBuyersService.selectedMemberships.map((item) => item.name)
      )
      .subscribe((_) => {
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

  selectAge(aged: boolean) {
    this.ageControl.patchValue(aged);
  }

  selectFirstLoan(firstLoan: boolean) {
    this.firstLoanControl.patchValue(firstLoan);
  }

  toggleFeaturedMemberships(membership) {
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

  deleteMembership(membership) {
    this.memberships.splice(this.memberships.indexOf(membership), 1);
    this.updateMemberships();
  }

  applyMemberships(memberships: MembershipTypeDto[]) {
    this.memberships = memberships;
    if (this.memberships.length) {
      this.updateMemberships();
      this.formGroup.markAsDirty();
    }
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

    if (!this.firstBuyersService.offerValue?.income) {
      this.incomeStepShown = true;
    } else {
      this.incomeControl.patchValue(this.firstBuyersService.offerValue.income);
    }

    this.loansService.getConfirmationData().subscribe((dto) => {
      this.allMemberships = dto.availableMemberships;
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

    this.formGroup.valueChanges.subscribe((val) => {
      if (this.isAllDataFilled()) {
        this.stepper._steps.forEach((step) => {
          step.state = 'done';
        });
      }
    });

    this.updateNewOffers();
  }

  updateNewOffers() {
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

  nextStep() {
    this.stepper.next();
  }

  isBoolean(val) {
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

  ageFilled() {
    return (
      (this.isBoolean(this.ageControl.value) && !this.ageControl.value) ||
      (this.isBoolean(this.ageControl.value) && this.ageControl.value)
    );
  }

  toggleEditMode() {
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
