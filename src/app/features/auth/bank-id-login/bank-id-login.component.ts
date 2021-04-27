import { PlatformLocation } from '@angular/common';
import {
  Component,
  ViewChild,
  OnInit,
  HostListener,
  ElementRef
} from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { LocalStorageService } from '@services/local-storage.service';
import { AuthService } from '@services/remote-api/auth.service';
import { Observable, of, from, fromEvent } from 'rxjs';
import { startWith, map, tap } from 'rxjs/operators';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent
} from '@angular/material';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { Mask } from '@shared/constants/mask';
import {
  ConfirmationGetDto,
  LoansService,
  MembershipTypeDto
} from '@services/remote-api/loans.service';
import { NavigationInterceptionService } from '@services/navigation-interception.service';
import { MatStepper } from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormControl
} from '@angular/forms';
import { forkJoin } from 'rxjs';
import { LoanUpdateInfoDto } from '@shared/models/loans';

@Component({
  selector: 'rente-bank-id-login',
  templateUrl: './bank-id-login.component.html',
  styleUrls: ['./bank-id-login.component.scss']
})
export class BankIdLoginComponent implements OnInit {
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('Back button pressed');
  }
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('membershipInput') membershipInput: ElementRef<HTMLInputElement>;
  eventSubscription;
  userFormGroup: FormGroup;
  loanFormGroup: FormGroup;

  public removable = true;
  public membershipCtrl = new FormControl();
  public filteredMemberships: Observable<void | MembershipTypeDto[]>;
  public memberships: any = [];
  public allMemberships: MembershipTypeDto[];
  public showForms = false;
  public mask = Mask;
  public isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router,
    location: PlatformLocation,
    private navigationInterceptionService: NavigationInterceptionService,
    private fb: FormBuilder,
    private loanService: LoansService
  ) {
    window.onpopstate = function (event) {
      event.preventDefault();
      alert(
        `location: ${document.location}, state: ${JSON.stringify(event.state)}`
      );
    };

    // history.back(); // alerts "location: http://example.com/example.html?page=1, state: {"page":1}"
    location.onPopState(() => {
      alert(window.location);
    });
    router.events.subscribe((event: NavigationStart) => {
      console.log('any state');

      console.log(event);

      if (event.navigationTrigger === 'popstate') {
        console.log('popstate');
        alert('popstate');
        // Perform actions
      }
    });
  }

  ngOnInit(): void {
    forkJoin([
      this.loanService.getConfirmationData(),
      this.loanService.getOffersBanks()
    ]).subscribe(([userInfo, offerBanks]) => {
      this.initMemberships(userInfo);
      this.initForms();
      this.showForms = true;
      this.isLoading = false;
      console.log('offerBanks');
      console.log(offerBanks);
    });

    this.route.queryParams.subscribe((routeParams) => {
      const status = routeParams['status'];
      const sessionId = routeParams['sessionId'];

      const bank = this.localStorageService.getItem('bankIdLoginBank');

      this.authService
        .loginBankIdStep2('1e85f172698745a99148ad1600bd5e03', bank)
        .subscribe((response) => {
          console.log(response);
        });
    });

    /*  window.history.pushState({}, '', '/newpage'); */
    /*    history.pushState('{ page: 1 }', 'title 1', '?page=1');
    history.pushState('{ page: 2 }', 'title 2', '?page=2');
    window.history.pushState({}, '', '/oldpage'); */
    // history.back(); // alerts "location: http://example.com/example.html?page=1, state: {"page":1}"
    /* 
    

    this.eventSubscription = fromEvent(window, 'popstate').subscribe((e) => {
      console.log(e, 'back button');
      alert('eventSubscription');
    }); */
  }

  public isErrorState(control: AbstractControl | null): boolean {
    /*     console.log('control start: ');
    console.log('control?.invalid');
    console.log(control?.invalid);
    console.log('control?.dirty');
    console.log(control?.dirty);
    console.log('control?.touched');
    console.log(control?.touched); */

    console.log(
      !!(control && control.invalid && (control.dirty || control.touched))
    );
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  private filter(value: any): void {
    const filterValue = value.label
      ? value.label.toLowerCase()
      : value.toLowerCase();
    this.allMemberships = this.clearDuplicates(
      this.allMemberships,
      this.memberships
    );
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

  private clearDuplicates(
    array: MembershipTypeDto[],
    toRemoveArray: MembershipTypeDto[]
  ): MembershipTypeDto[] {
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
  /* @HostListener('window:popstate', ['$event'])
  onBrowserBackBtnClose(event: Event) {
    console.log('back button pressed');
    event.preventDefault();
    this.router.navigate(['/home'], { replaceUrl: true });
  } */

  initMemberships(userInfo: ConfirmationGetDto): void {
    this.allMemberships = userInfo.availableMemberships;

    this.filteredMemberships = this.membershipCtrl.valueChanges.pipe(
      startWith(null),
      map((membership: string | null) =>
        membership ? this.filter(membership) : this.allMemberships.slice()
      )
    );
    this.allMemberships = userInfo.availableMemberships;

    this.filteredMemberships = this.membershipCtrl.valueChanges.pipe(
      startWith(null),
      map((membership: string | null) =>
        membership ? this.filter(membership) : this.allMemberships.slice()
      )
    );
  }

  initForms(): void {
    this.userFormGroup = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.email)
        ])
      ],
      address: ['', Validators.required],
      zip: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.zip)
        ])
      ],
      apartmentSize: [
        '',
        [Validators.required, Validators.min(5), Validators.max(999)]
      ],
      membership: [],
      income: ['', Validators.required]
    });

    this.loanFormGroup = this.fb.group({
      outstandingDebt: ['', Validators.required],
      remainingYears: ['', Validators.required, Validators.max(100)]
    });
  }

  update() {}
}
