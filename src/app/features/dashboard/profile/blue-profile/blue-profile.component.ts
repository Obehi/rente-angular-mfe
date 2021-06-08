import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  Input
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
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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

  // //////////////////////////// NEW /////////////////////////// ///
  public isChecked = false;
  @Input() autocompleteOptions: any;
  @Input() memberships: MembershipTypeDto[];
  public previousStateMemberships: string[] = [];
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
    this.filteredMemberships = this.membershipCtrl.valueChanges.pipe(
      startWith(null),
      map((membership: string | null) =>
        membership ? this.filter(membership) : this.allMemberships.slice()
      )
    );
  }

  ngOnInit(): void {
    this.membershipService.getSelectedMemberships().subscribe((args) => {
      this.previousStateMemberships = args;
    });
    console.log(this.previousStateMemberships);

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
        console.log(dto.checkRateReminderType);
        console.log(dto.checkRateReminderType);
        console.log(dto.memberships);

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
        this.onFormChange();
      }
    );

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
    this.profileForm.valueChanges.subscribe(() => {
      if (this.profileForm.valid) {
        this.changesMade = true;
        this.updatePreferances();
      }
    });

    this.preferencesForm.valueChanges.subscribe(() => {
      if (this.profileForm.valid) {
        this.changesMade = true;
        this.updatePreferances();
      }
    });
  }

  public openInfoDialog(offer: OfferInfo | string): void {
    this.dialog.open(ProfileDialogInfoComponent, {
      data: offer
    });
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

  public updatePreferances2(): void {
    const dto = new PreferencesUpdateDto();
    dto.memberships = this.previousStateMemberships;
    dto.checkRateReminderType = this.preferencesForm.get(
      'checkRateReminderType'
    )?.value;
    dto.receiveNewsEmails = this.preferencesForm.get(
      'receiveNewsEmails'
    )?.value;

    console.log(this.preferencesForm.get('receiveNewsEmails')?.value);

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
    const openDialog = this.dialog.open(PropertySelectDialogComponent, {
      autoFocus: false,
      data: {
        previousState: [...this.previousStateMemberships],
        allMemberships: this.allMemberships
      }
    });
    openDialog.afterClosed().subscribe(() => {
      this.membershipCtrl.setValue(this.previousStateMemberships);
      this.updatePreferances2();
    });
  }

  getMembershipPlaceholder(): string | undefined {
    if (this.previousStateMemberships?.length === 0) {
      return 'Velg';
    } else if (this.previousStateMemberships?.length === 1) {
      return `${this.previousStateMemberships}`;
    } else if (this.previousStateMemberships?.length > 1) {
      return `${this.previousStateMemberships?.length} valgt`;
    }
  }

  getToggleValue(): void {
    this.isChecked === false ? true : false;
  }
}
