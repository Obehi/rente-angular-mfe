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
import { COMMA, ENTER, S } from '@angular/cdk/keycodes';
import { combineLatest, Observable, of, Subject, throwError } from 'rxjs';
import {
  catchError,
  debounce,
  debounceTime,
  distinctUntilChanged,
  filter,
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

export enum FormControlId {
  email = 'email',
  income = 'income',
  memberships = 'memberships',
  checkRateReminderType = 'checkRateReminderType',
  receiveNewsEmails = 'receiveNewsEmails',
  fetchCreditLinesOnly = 'fetchCreditLinesOnly',
  noAdditionalProductsRequired = 'noAdditionalProductsRequired',
  interestedInEnvironmentMortgages = 'interestedInEnvironmentMortgages'
}

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
    email: { normal: true, loading: false, success: false },
    income: { normal: true, loading: false, success: false },
    memberships: { normal: true, loading: false, success: false },
    checkRateReminderType: { normal: true, loading: false, success: false },
    receiveNewsEmails: { normal: true, loading: false, success: false },
    fetchCreditLinesOnly: { normal: true, loading: false, success: false },
    noAdditionalProductsRequired: {
      normal: true,
      loading: false,
      success: false
    },
    interestedInEnvironmentMortgages: {
      normal: true,
      loading: false,
      success: false
    }
  };

  public formControlId = FormControlId;
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
          noAdditionalProductsRequired: [dto.noAdditionalProductsRequired],
          interestedInEnvironmentMortgages: [
            dto.interestedInEnvironmentMortgages
          ]
        });

        !this.isSweden &&
          this.preferencesForm.addControl(
            'fetchCreditLinesOnly',
            this.fb.control('', [])
          );
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.subscribeToControllers();
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
    return this.canNavigateBooolean$;
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
    dto.memberships = this.previousStateMemberships.map((m) => {
      return m.name;
    });
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

        break;
      }
    }
  }

  getMembershipPlaceholder(): string {
    if (this.previousStateMemberships?.length === 0) {
      return this.textLangService.getChooseText();
    } else if (this.previousStateMemberships?.length === 1) {
      const oneMembershipPlaceholder = this.getMembershipNameString(
        this.previousStateMemberships.map((m) => {
          return m.name;
        })
      )[0].label;
      return oneMembershipPlaceholder;
    } else if (this.previousStateMemberships?.length > 1) {
      return `${
        this.previousStateMemberships?.length
      } ${this.textLangService.getChoosenText()}`;
    }
    return `${
      this.previousStateMemberships?.length
    } ${this.textLangService.getChoosenText()}`;
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
      case 'Aldri': {
        return 'NONE';
      }
    }
  }

  beforeUpdate(formControlId: FormControlId): void {
    this.canLeavePage = false;
    this.loadingStates[formControlId].normal = false;
    this.loadingStates[formControlId].loading = true;
  }

  afterUpdate(formControlId: FormControlId): void {
    this.loadingStates[formControlId].loading = false;
    this.loadingStates[formControlId].success = true;
    this.canNavigateBooolean$.next(true);
    this.canLeavePage = true;

    setTimeout(() => {
      this.loadingStates[formControlId].success = false;
      this.loadingStates[formControlId].normal = true;
    }, 2000);
  }

  onError(formControlId: FormControlId): void {
    this.canNavigateBooolean$.next(true);
    this.canLeavePage = true;
    this.loadingStates[formControlId].loading = false;
  }

  subscribeToControllers(): void {
    combineLatest([
      this.profileForm.get(FormControlId.email)?.valueChanges.pipe(
        distinctUntilChanged(),
        filter(() => this.profileForm.get(FormControlId.email)?.valid || false),
        debounceTime(2000),
        filter(() => this.profileForm.get('email')?.valid || false),
        tap(() => {
          this.beforeUpdate(FormControlId.email);
        }),
        switchMap(() => {
          return this.loansService
            .updateUserPreferences(this.getPreferencesDto())
            .pipe(
              catchError(() => {
                this.onError(FormControlId.email);
                return of(FormControlId.email);
              })
            );
        }),
        tap(() => {
          this.afterUpdate(FormControlId.email);
        })
      ),
      this.profileForm.get(FormControlId.income)?.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(2000),
        filter(
          () => this.profileForm.get(FormControlId.income)?.valid || false
        ),
        tap(() => {
          this.beforeUpdate(FormControlId.income);
        }),
        switchMap(() => {
          return this.loansService
            .updateUserPreferences(this.getPreferencesDto())
            .pipe(
              catchError((e) => {
                this.onError(FormControlId.income);
                return of(null);
              })
            );
        }),
        tap((value) => {
          value && this.afterUpdate(FormControlId.income);
        })
      ),
      this.membershipCtrl.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(100),
        tap(() => {
          this.beforeUpdate(FormControlId.memberships);
        }),
        switchMap(() => {
          return this.loansService
            .updateUserPreferences(this.getPreferencesDto())
            .pipe(
              catchError(() => {
                this.onError(FormControlId.memberships);
                return of(FormControlId.memberships);
              })
            );
        }),
        tap(() => {
          this.afterUpdate(FormControlId.memberships);
        })
      ),
      this.preferencesForm
        .get(FormControlId.checkRateReminderType)
        ?.valueChanges.pipe(
          distinctUntilChanged(),
          debounceTime(100),
          tap(() => {
            this.beforeUpdate(FormControlId.checkRateReminderType);
          }),
          switchMap(() => {
            return this.loansService
              .updateUserPreferences(this.getPreferencesDto())
              .pipe(
                catchError(() => {
                  this.onError(FormControlId.checkRateReminderType);
                  return of(FormControlId.checkRateReminderType);
                })
              );
          }),
          tap(() => {
            this.afterUpdate(FormControlId.checkRateReminderType);
          })
        ),
      this.preferencesForm
        .get(FormControlId.receiveNewsEmails)
        ?.valueChanges.pipe(
          distinctUntilChanged(),
          debounceTime(100),
          tap(() => {
            this.beforeUpdate(FormControlId.receiveNewsEmails);
          }),
          switchMap(() => {
            return this.loansService
              .updateUserPreferences(this.getPreferencesDto())
              .pipe(
                catchError(() => {
                  this.onError(FormControlId.receiveNewsEmails);
                  return of(FormControlId.receiveNewsEmails);
                })
              );
          }),
          tap(() => {
            this.afterUpdate(FormControlId.receiveNewsEmails);
          })
        ),
      this.preferencesForm
        .get(FormControlId.noAdditionalProductsRequired)
        ?.valueChanges.pipe(
          distinctUntilChanged(),
          debounceTime(500),
          tap(() => {
            this.beforeUpdate(FormControlId.noAdditionalProductsRequired);
          }),
          switchMap(() => {
            return this.loansService
              .updateUserPreferences(this.getPreferencesDto())
              .pipe(
                catchError(() => {
                  this.onError(FormControlId.noAdditionalProductsRequired);
                  return of(FormControlId.noAdditionalProductsRequired);
                })
              );
          }),
          tap(() => {
            this.afterUpdate(FormControlId.noAdditionalProductsRequired);
          })
        ),
      this.preferencesForm
        .get(FormControlId.interestedInEnvironmentMortgages)
        ?.valueChanges.pipe(
          distinctUntilChanged(),
          debounceTime(500),
          tap(() => {
            this.beforeUpdate(FormControlId.interestedInEnvironmentMortgages);
          }),
          switchMap(() => {
            return this.loansService
              .updateUserPreferences(this.getPreferencesDto())
              .pipe(
                catchError(() => {
                  this.onError(FormControlId.interestedInEnvironmentMortgages);
                  return of(FormControlId.interestedInEnvironmentMortgages);
                })
              );
          }),
          tap(() => {
            this.afterUpdate(FormControlId.interestedInEnvironmentMortgages);
          })
        ),
      this.preferencesForm
        .get(FormControlId.fetchCreditLinesOnly)
        ?.valueChanges.pipe(
          distinctUntilChanged(),
          debounceTime(500),
          tap(() => {
            this.beforeUpdate(FormControlId.fetchCreditLinesOnly);
          }),
          switchMap(() => {
            return this.loansService
              .updateUserPreferences(this.getPreferencesDto())
              .pipe(
                catchError(() => {
                  this.onError(FormControlId.fetchCreditLinesOnly);
                  return of(FormControlId.fetchCreditLinesOnly);
                })
              );
          }),
          tap(() => {
            this.afterUpdate(FormControlId.fetchCreditLinesOnly);
          })
        )
    ]).subscribe(() => {});
  }
}
