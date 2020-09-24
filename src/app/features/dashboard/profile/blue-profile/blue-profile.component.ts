import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  AbstractControl,
  NgForm,
  FormControl,
  Validators
} from '@angular/forms';
import { CurrencyPipe} from '@angular/common'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, Subject } from 'rxjs';
import { map, startWith, mergeMap } from 'rxjs/operators';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { ProfileDialogInfoComponent } from '../dialog-info/dialog-info.component';
import { MatChipInputEvent } from '@angular/material';
import { LoansService, MembershipTypeDto, PreferencesUpdateDto, PreferencesDto } from '@services/remote-api/loans.service';
import { UserService } from '@services/remote-api/user.service';
import { Mask } from '@shared/constants/mask'
import { VALIDATION_PATTERN } from '../../../../config/validation-patterns.config';
import { ThousandsSeprator} from '@shared/pipes/thousands.pipe'
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

@Component({
  selector: 'rente-blue-profile',
  templateUrl: './blue-profile.component.html',
  styleUrls: ['./blue-profile.component.scss'],
  animations: [
    trigger('loading', [
      // ...
      state('false', style({
        
      })),
      transition(':enter', []),
      transition('* => *', [
        animate('1s', keyframes([
          style({ opacity: 1, offset: 0.1}),
          style({ opacity: 1, offset: 0.8}),
          style({ opacity: 0, offset: 1}),
        ]
        ))
      ]),
    ]),
  ],
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
  public memberships: any = [];
  public showMemberships: boolean;
  public showPreferences: boolean;
  public showOfferPreferences: boolean;
  public allMemberships: MembershipTypeDto[];
  public isLoading = true;
  public canLeavePage = true;
  public updateAnimationTrigger :boolean;
  public errorAnimationTrigger :boolean;
  public canNavigateBooolean$: Subject<boolean> = new Subject<boolean>();
  public username: string;
  public mask = Mask;
  changesMade = false;

  @ViewChild('membershipInput') membershipInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private fb: FormBuilder,
    private loansService: LoansService,
    private userService: UserService,
    private snackBar: SnackBarService,
    public dialog: MatDialog
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

  ngOnInit() {
    
    this.loansService.getPreferencesDto().subscribe(res => {
      this.isLoading = false;
      let dto:PreferencesDto = res;
      this.allMemberships = dto.availableMemberships;
      this.memberships = this.allMemberships.filter(membership => {
        if (dto.memberships.includes(membership.name)) {
          return membership;
        }
      });

      let income = String(dto.income)
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
        noAdditionalProductsRequired: [
          dto.noAdditionalProductsRequired
        ],
        interestedInEnvironmentMortgages: [
          dto.interestedInEnvironmentMortgages
        ]
      });
    },
    err => {
      console.log(err);
    },
    () => {
      this.onFormChange();
    });
  }

  
  // DeactivationGuarded Interface method. 
  // Gets called every time user navigates from this page.
  // Determines if you can leave this page or if you have to wait. 
  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    if(this.canLeavePage)
    return true;
    
    // Wait for upload info before navigating to another page
    this.isLoading = true
    return this.canNavigateBooolean$
  }

  // Listen to blur updates in forms. Save  changes if the form is valid.
  onFormChange(): void {
    this.profileForm.valueChanges.subscribe(val => {
      if (this.profileForm.valid) {
        this.changesMade = true;
        this.updatePreferances()
      } 
    });

    this.preferencesForm.valueChanges.subscribe(val => {
      if(this.profileForm.valid) {
        this.changesMade = true;
        this.updatePreferances()
      } 
    });
  }


  public openInfoDialog(offer: OfferInfo): void {
    this.dialog.open(ProfileDialogInfoComponent, {
      data: offer
    });
  }

  public updatePreferances() {
    this.isLoading = true;
    const income = this.profileForm.value.income;
    const userData = {
      email: this.profileForm.value.email,
      income: typeof income === 'string' ? income.replace(/\s/g, '') : income
    };

    const dto = new PreferencesUpdateDto();
    dto.email = userData.email;
    dto.income = userData.income;
    dto.memberships = this.memberships.map(membership => membership.name);
    dto.checkRateReminderType = this.preferencesForm.get('checkRateReminderType').value;
    dto.fetchCreditLinesOnly = this.preferencesForm.get('fetchCreditLinesOnly').value;
    dto.noAdditionalProductsRequired = this.preferencesForm.get('noAdditionalProductsRequired').value;
    dto.interestedInEnvironmentMortgages = this.preferencesForm.get('interestedInEnvironmentMortgages').value;
    dto.receiveNewsEmails = this.preferencesForm.get('receiveNewsEmails').value;

    // No one leaves the page while updating
    this.canLeavePage = false;
   
    this.loansService.updateUserPreferences(dto).subscribe(res => {
      this.canNavigateBooolean$.next(true);
      this.changesMade = false;
      this.isLoading = false;

      // A hack to trigger "saved" animation
      this.updateAnimationTrigger  = !this.updateAnimationTrigger 
      this.canLeavePage = true
    },
    err => {
      this.canLeavePage = true
      this.isLoading = false;
      this.errorAnimationTrigger  = !this.errorAnimationTrigger 
    });
  }

  // TODO: Move to service
  public isErrorState(
    control: AbstractControl | null,
    form: FormGroup | NgForm | null
  ): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
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
    this.changesMade = true;
    this.updatePreferances()
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.memberships.push(event.option.value);
    this.membershipInput.nativeElement.value = '';
    this.membershipCtrl.setValue(null);
    this.changesMade = true;
    this.updatePreferances()
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
