import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  Input,
  OnChanges
} from '@angular/core';
import { locale } from '../../../../config/locale/locale';
import { CustomLangTextService } from '@shared/services/custom-lang-text.service';
import {
  FormGroup,
  FormBuilder,
  AbstractControl,
  FormControl,
  Validators
} from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import {
  debounce,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap
} from 'rxjs/operators';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { ProfileDialogInfoComponent } from '../dialog-info/dialog-info.component';
import { MatChipInputEvent } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  LoansService,
  MembershipTypeDto,
  PreferencesUpdateDto,
  PreferencesDto
} from '@services/remote-api/loans.service';
import { UserService } from '@services/remote-api/user.service';
import { Mask } from '@shared/constants/mask';
import { VALIDATION_PATTERN } from '../../../../config/validation-patterns.config';
import { SnackBarService } from '../../../../shared/services/snackbar.service';
import { OfferInfo } from '@shared/models/offers';
import { DeactivationGuarded } from '@shared/guards/route.guard';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
  // ...
} from '@angular/animations';
import { PropertySelectDialogComponent } from '@features/first-buyers/components/property-select-dialog/property-select-dialog.component';
import { MembershipService } from '@services/membership.service';

@Component({
  selector: 'rente-blue-profile',
  templateUrl: './blue-profile.component.html',
  styleUrls: ['./blue-profile.component.scss'],
  animations: [
    trigger('loading', [
      // ...
      state('false', style({})),
      transition(':enter', []),
      transition('* => *', [
        animate(
          '1s',
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
export class BlueProfileComponent implements OnInit, DeactivationGuarded {
  public preferencesForm: FormGroup;
  public profileForm: FormGroup;
  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public membershipCtrl = new FormControl();
  public filteredMemberships: Observable<MembershipTypeDto[]>;
  // public memberships: any = [];
  public showMemberships: boolean;
  public showPreferences: boolean;
  public showOfferPreferences: boolean;
  public allMemberships: MembershipTypeDto[];
  public isLoading = true;
  public canLeavePage = true;
  public updateAnimationTrigger: boolean;
  public errorAnimationTrigger: boolean;
  public canNavigateBooolean$: Subject<boolean> = new Subject<boolean>();
  public username: string;
  public mask = Mask;
  public locale = locale;
  changesMade = false;
  public isSweden = false;
  public loadingStates = {
    email: false,
    income: false,
    fetchCreditLinesOnly: false,
    noAdditionalProductsRequired: false,
    interestedInEnvironmentMortgages: false
  };
  // //////////////////////////// NEW /////////////////////////// ///

  public offerOneIsChecked = true;
  public offerTwoIsChecked = true;
  public offerThreeIsChecked = true;
  public markedIsChecked = true;

  @Input() autocompleteOptions: any;
  @Input() memberships: MembershipTypeDto[];
  public previousStateMemberships: MembershipTypeDto[] = [];
  @Output() selectedMemberships = new EventEmitter<MembershipTypeDto[]>();
  public marketOptions = [
    this.textLangService.getProfileMarketOption1(),
    this.textLangService.getProfileMarketOption2(),
    this.textLangService.getProfileMarketOption3(),
    this.textLangService.getProfileMarketOption4(),
    this.textLangService.getProfileMarketOption5()
  ];

  profileIcon = '../../../../../assets/icons/profile-icon-page.svg';
  membershipIcon = '../../../../../assets/icons/bank-card-light-blue.svg';
  marketUpdatesIcon = '../../../../../assets/icons/ic_bank_id.svg';

  @ViewChild('membershipInput') membershipInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private fb: FormBuilder,
    private loansService: LoansService,
    private userService: UserService,
    private snackBar: SnackBarService,
    private membershipService: MembershipService,
    public dialog: MatDialog,
    public textLangService: CustomLangTextService
  ) {
    if (window.innerWidth > 600) {
      this.showMemberships = true;
      this.showPreferences = true;
      this.showOfferPreferences = true;
    } else {
      this.showMemberships = false;
      this.showPreferences = false;
      this.showOfferPreferences = false;
    }
  }

  ngOnInit(): void {
    console.log(this.profileForm);
    console.log();

    this.loansService.getPreferencesDto().subscribe(
      (res) => {
        this.isLoading = false;
        const dto: PreferencesDto = res;
        this.allMemberships = dto.availableMemberships;
        this.memberships = this.allMemberships.filter((membership) => {
          if (dto.memberships.includes(membership.name)) {
            return membership;
          }
        });

        this.membershipService.setSelectedMemberships(dto.memberships);
        // We are getting strings and not objects from the Back-end and therefore we should map them into Objects.
        this.previousStateMemberships = dto.memberships.map((args) => {
          return { name: args, label: '' };
        });

        this.username = dto.name;
        this.profileForm = this.fb.group({
          membership: [dto.memberships],
          income: [String(dto.income), Validators.required],
          email: [
            dto.email,
            Validators.compose([
              Validators.required,
              Validators.pattern(VALIDATION_PATTERN.email)
            ])
          ]
        });
        this.preferencesForm = this.fb.group({
          receiveNewsEmails: [dto.receiveNewsEmails],
          checkRateReminderType: [dto.checkRateReminderType],
          fetchCreditLinesOnly: [dto.fetchCreditLinesOnly],
          noAdditionalProductsRequired: [dto.noAdditionalProductsRequired],
          interestedInEnvironmentMortgages: [
            dto.interestedInEnvironmentMortgages
          ]
        });
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.subscribeToControllers();
        this.onFormChange();
      }
    );

    this.membershipService.getSelectedMemberships().subscribe((args) => {
      this.previousStateMemberships = args;
    });

    if (locale.includes('sv')) {
      this.isSweden = true;
    } else {
      this.isSweden = false;
    }
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

  // Listen to blur updates in forms. Save  changes if the form is valid.
  onFormChange(): void {
    /*  this.profileForm.valueChanges.subscribe(() => {
      console.log('changed');
      this.changesMade = true;
      this.updatePreferances2();
    });
 */
    this.preferencesForm.valueChanges.subscribe((test) => {
      console.log(test);
      if (this.profileForm.valid) {
        this.changesMade = true;
        this.updatePreferances2();
      }
    });
  }

  public openInfoDialog(offer: OfferInfo | string): void {
    this.dialog.open(ProfileDialogInfoComponent, {
      data: offer
    });
  }

  getPreferencesDto(): PreferencesUpdateDto {
    const income = this.profileForm.value.income;
    const userData = {
      email: this.profileForm.value.email,
      income: typeof income === 'string' ? income.replace(/\s/g, '') : income
    };
    const dto = new PreferencesUpdateDto();
    dto.email = userData.email;
    dto.income = userData.income;
    dto.memberships = this.memberships.map((membership) => membership.name);
    dto.checkRateReminderType = this.preferencesForm?.get(
      'checkRateReminderType'
    )?.value;
    dto.fetchCreditLinesOnly = this.preferencesForm?.get(
      'fetchCreditLinesOnly'
    )?.value;
    dto.noAdditionalProductsRequired = this.preferencesForm?.get(
      'noAdditionalProductsRequired'
    )?.value;
    dto.interestedInEnvironmentMortgages = this.preferencesForm?.get(
      'interestedInEnvironmentMortgages'
    )?.value;
    dto.receiveNewsEmails = this.preferencesForm?.get(
      'receiveNewsEmails'
    )?.value;
    return dto;
  }

  public updatePreferances(): void {
    this.isLoading = true;
    const income = this.profileForm.value.income;
    const userData = {
      email: this.profileForm.value.email,
      income: typeof income === 'string' ? income.replace(/\s/g, '') : income
    };
    const dto = new PreferencesUpdateDto();
    dto.email = userData.email;
    dto.income = userData.income;
    dto.memberships = this.memberships.map((membership) => membership.name);
    dto.checkRateReminderType = this.preferencesForm.get(
      'checkRateReminderType'
    );
    dto.fetchCreditLinesOnly = this.preferencesForm.get('fetchCreditLinesOnly');
    dto.noAdditionalProductsRequired = this.preferencesForm.get(
      'noAdditionalProductsRequired'
    );
    dto.interestedInEnvironmentMortgages = this.preferencesForm.get(
      'interestedInEnvironmentMortgages'
    );
    dto.receiveNewsEmails = this.preferencesForm.get('receiveNewsEmails');

    /*   this.canLeavePage = false;

    this.loansService.updateUserPreferences(dto).subscribe(
      () => {
        this.canNavigateBooolean$.next(true);
        this.changesMade = false;
        this.isLoading = false;

        // A hack to trigger "saved" animation
        this.updateAnimationTrigger = !this.updateAnimationTrigger;
        this.canLeavePage = true;
      },
      () => {
        this.canLeavePage = true;
        this.isLoading = false;
        this.errorAnimationTrigger = !this.errorAnimationTrigger;
      }
    ); */
  }

  public updatePreferances2(): void {
    this.isLoading = true;
    const income = this.profileForm.value.income;
    const userData = {
      email: this.profileForm.value.email,
      income: typeof income === 'string' ? income.replace(/\s/g, '') : income
    };

    console.log(income, userData);

    const dto = new PreferencesUpdateDto();
    dto.email = userData.email;
    dto.income = userData.income;
    dto.memberships = this.previousStateMemberships.map((m) => {
      return m.name;
    });
    dto.checkRateReminderType = this.preferencesForm.get(
      'checkRateReminderType'
    )?.value;
    dto.receiveNewsEmails = this.preferencesForm.get(
      'receiveNewsEmails'
    )?.value;
    dto.fetchCreditLinesOnly = this.preferencesForm.get(
      'fetchCreditLinesOnly'
    )?.value;
    dto.noAdditionalProductsRequired = this.preferencesForm.get(
      'noAdditionalProductsRequired'
    )?.value;
    dto.interestedInEnvironmentMortgages = this.preferencesForm.get(
      'interestedInEnvironmentMortgages'
    )?.value;

    console.log(dto.checkRateReminderType);

    // No one leaves the page while updating
    this.canLeavePage = false;

    this.loansService.updateUserPreferences(dto).subscribe(
      () => {
        this.canNavigateBooolean$.next(true);
        this.changesMade = false;
        this.isLoading = false;

        // A hack to trigger "saved" animation
        this.updateAnimationTrigger = !this.updateAnimationTrigger;
        this.canLeavePage = true;
      },
      () => {
        this.canLeavePage = true;
        this.isLoading = false;
        this.errorAnimationTrigger = !this.errorAnimationTrigger;
      }
    );
  }

  // TODO: Move to service
  public isErrorState(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public openPropertySelectDialog(): void {
    const memberships = this.getMembershipNameString(
      this.previousStateMemberships?.map((args) => {
        return args.name;
      })
    );
    const openDialog = this.dialog.open(PropertySelectDialogComponent, {
      autoFocus: false,
      data: {
        previousState: memberships,
        allMemberships: this.allMemberships
      }
    });
    openDialog.afterClosed().subscribe(() => {
      this.handleMembershipDialogOnClose(
        openDialog.componentInstance.closeState
      );
    });
  }

  public handleMembershipDialogOnClose(state: string): void {
    switch (state) {
      case 'cancelled': {
        break;
      }
      case 'saved': {
        this.membershipCtrl.setValue(
          this.previousStateMemberships.map((membership) => {
            return membership.name;
          })
        );
        this.updatePreferances2();

        break;
      }
    }
  }

  getMembershipPlaceholder(): string | undefined {
    if (this.previousStateMemberships?.length === 0) {
      return 'Velg';
    } else if (this.previousStateMemberships?.length === 1) {
      const oneMembershipPlaceholder = this.getMembershipNameString(
        this.previousStateMemberships.map((m) => {
          return m.name;
        })
      )[0].label;
      return oneMembershipPlaceholder;
    } else if (this.previousStateMemberships?.length > 1) {
      return `${this.previousStateMemberships?.length} valgt`;
    }
  }

  getMembershipNameString(membership: string[]): any {
    return this.allMemberships.filter((m) => {
      return membership.includes(m.name);
    });
  }

  getMarketString(option: string): any {
    switch (option) {
      case 'Hver måned': {
        return 'HVER_MANED_1';
      }
      case 'Hver 2. måned': {
        return 'HVER_MANED_2';
      }
      case 'Hver 3. måned': {
        return 'HVER_MANED_3';
      }
      case 'Hver 4. måned': {
        return 'HVER_MANED_4';
      }
      case 'Hver 5. måned': {
        return 'HVER_MANED_5';
      }
    }
  }

  subscribeToControllers(): void {
    combineLatest([
      this.profileForm.get('email')?.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        tap(() => {
          this.loadingStates['email'] = true;
        }),
        switchMap(() => {
          return this.loansService.updateUserPreferences(
            this.getPreferencesDto()
          );
        }),
        tap(() => {
          this.loadingStates['email'] = false;
        })
      ),
      this.profileForm.get('income')?.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        tap(() => {
          this.loadingStates['income'] = true;
        }),
        switchMap(() => {
          return this.loansService.updateUserPreferences(
            this.getPreferencesDto()
          );
        }),
        tap(() => {
          this.loadingStates['income'] = false;
        })
      ),
      this.preferencesForm.get('fetchCreditLinesOnly')?.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        tap(() => {
          this.loadingStates['fetchCreditLinesOnly'] = true;
        }),
        switchMap(() => {
          return this.loansService.updateUserPreferences(
            this.getPreferencesDto()
          );
        }),
        tap(() => {
          this.loadingStates['fetchCreditLinesOnly'] = false;
        })
      ),
      this.preferencesForm
        .get('noAdditionalProductsRequired')
        ?.valueChanges.pipe(
          distinctUntilChanged(),
          debounceTime(500),
          tap(() => {
            this.loadingStates['noAdditionalProductsRequired'] = true;
          }),
          switchMap(() => {
            return this.loansService.updateUserPreferences(
              this.getPreferencesDto()
            );
          }),
          tap(() => {
            this.loadingStates['noAdditionalProductsRequired'] = false;
          })
        ),
      this.preferencesForm
        .get('interestedInEnvironmentMortgages')
        ?.valueChanges.pipe(
          distinctUntilChanged(),
          debounceTime(500),
          tap(() => {
            this.loadingStates['interestedInEnvironmentMortgages'] = true;
          }),
          switchMap(() => {
            return this.loansService.updateUserPreferences(
              this.getPreferencesDto()
            );
          }),
          tap(() => {
            this.loadingStates['interestedInEnvironmentMortgages'] = false;
          })
        ),
      this.preferencesForm
        .get('interestedInEnvironmentMortgages')
        ?.valueChanges.pipe(
          distinctUntilChanged(),
          debounceTime(500),
          tap(() => {
            this.loadingStates['interestedInEnvironmentMortgages'] = true;
          }),
          switchMap(() => {
            return this.loansService.updateUserPreferences(
              this.getPreferencesDto()
            );
          }),
          tap(() => {
            this.loadingStates['interestedInEnvironmentMortgages'] = false;
          })
        )
    ]).subscribe((value) => {
      this.canNavigateBooolean$.next(true);
    });
  }
}
