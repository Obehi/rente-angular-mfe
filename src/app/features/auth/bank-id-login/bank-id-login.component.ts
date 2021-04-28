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
  AddressCreationDto,
  ClientUpdateInfo,
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
import { LoginService } from '@services/login.service';
import { BankUtils, BankVo } from '@shared/models/bank';
import { FlowHeaderNode } from '@shared/components/ui-components/flow-header/flow-header.component';
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
  emailFormGroup: FormGroup;
  userFormGroup: FormGroup;
  loanFormGroup: FormGroup;
  membershipFormGroup: FormGroup;
  public removable = true;
  public membershipCtrl = new FormControl();
  public filteredMemberships: Observable<void | MembershipTypeDto[]>;
  public memberships: any = [];
  public allMemberships: MembershipTypeDto[];
  public showForms = false;
  public mask = Mask;
  public isLoading = true;
  public selectOptions: any;
  public selectedOffer: string;
  private sessionId: string | null;
  private oneTimeToken: string | null;
  private bank: BankVo | null;
  public currentStepperValue = 0;

  public flowHeaderNodes: FlowHeaderNode[] = [
    { index: 0, state: 'active', value: null },
    { index: 1, state: 'waiting', value: null },
    { index: 2, state: 'waiting', value: null },
    { index: 3, state: 'waiting', value: null }
  ];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router,
    location: PlatformLocation,
    private navigationInterceptionService: NavigationInterceptionService,
    private fb: FormBuilder,
    private loanService: LoansService,
    private loginService: LoginService
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
    this.route.queryParams.subscribe((routeParams) => {
      const status = routeParams['status'];
      const sessionId = routeParams['sessionId'];

      console.log(status);
      console.log(sessionId);
      const bankName = this.localStorageService.getItem('bankIdLoginBank');
      this.bank = BankUtils.getBankByName(bankName);
      this.bank &&
        sessionId &&
        this.authService
          .loginBankIdStep2(sessionId, this.bank.name)
          .subscribe((response) => {
            this.oneTimeToken = response.token;

            forkJoin([
              this.loanService.getConfirmationData(),
              this.loanService.getOffersBanks()
            ]).subscribe(([userInfo, offerBanks]) => {
              this.initMemberships(userInfo);
              this.initForms();
              this.showForms = true;
              this.isLoading = false;

              this.selectOptions = (offerBanks.offers as any[]).map((offer) => {
                const test = {
                  name: offer.name,
                  value: offer.id
                };
                return test;
              });
              console.log(this.selectOptions);
            });
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
  }

  public offerSelected(event: any): void {
    this.selectedOffer = event;
    console.log(this.selectedOffer);
  }

  initForms(): void {
    this.emailFormGroup = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.email)
        ])
      ]
    });
    this.userFormGroup = this.fb.group({
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
      income: ['', Validators.required]
    });

    this.loanFormGroup = this.fb.group({
      outstandingDebt: ['', Validators.required],
      remainingYears: ['', [Validators.required, Validators.max(100)]]
    });

    this.membershipFormGroup = this.fb.group({
      membership: []
    });
  }

  public doneClicked(): void {
    console.log(this.bank);
    console.log(this.oneTimeToken);
    if (this.bank !== null && this.oneTimeToken) {
      this.bank &&
        this.loginService.loginWithBankAndToken(this.bank, this.oneTimeToken);
    }
    const addressDto = new AddressCreationDto();
    const clientDto = new ClientUpdateInfo();

    addressDto.apartmentSize = this.userFormGroup.get('apartmentSize')?.value;
    addressDto.zip = this.userFormGroup.get('zip')?.value;
    addressDto.zip = this.userFormGroup.get('zip')?.value;
    addressDto.street = this.userFormGroup.get('address')?.value;

    clientDto.address = addressDto;
    clientDto.email = this.userFormGroup.get('email')?.value;
    (clientDto.income =
      typeof this.userFormGroup.get('income')?.value === 'string'
        ? this.userFormGroup.get('income')?.value.replace(/\s/g, '')
        : this.userFormGroup.get('income')?.value),
      (clientDto.memberships = this.memberships.map(
        (membership) => membership.name
      ));

    const loanUpdateInfoDto = new LoanUpdateInfoDto();
    loanUpdateInfoDto.outstandingDebt = this.loanFormGroup.get(
      'outstandingDebt'
    )?.value;
    loanUpdateInfoDto.remainingYears = this.loanFormGroup.get(
      'remainingYears'
    )?.value;
    loanUpdateInfoDto.productId = this.selectedOffer;

    /* forkJoin([
      this.loanService.updateClientInfo(clientDto),
      this.loanService.updateLoanUserInfo(loanUpdateInfoDto)
    ]).subscribe(([clientInfoResponse, loanInfoResponse]) => {
      console.log(clientInfoResponse);
      console.log(loanInfoResponse);

      if (this.bank !== null && this.oneTimeToken) {
        this.bank &&
          this.loginService.loginWithBankAndToken(this.bank, this.oneTimeToken);
      }
    }); */
  }

  updateStepperIndex(index: number): void {
    console.log('updateStepperIndex');
    if (index !== this.stepper.selectedIndex) {
      this.stepper.selectedIndex = index;
    }
  }

  next(): void {
    this.stepper.next();
    this.currentStepperValue = this.stepper.selectedIndex;
    console.log(this.stepper.selectedIndex);
  }

  goToLoansForm(): void {
    this.stepper.next();
  }

  goToUserForm(): void {
    this.stepper.next();
    this.currentStepperValue = this.stepper.selectedIndex;
    console.log(this.stepper.selectedIndex);
  }

  goToMembershipForm(): void {
    this.stepper.next();
  }
}
