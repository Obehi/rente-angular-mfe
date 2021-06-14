import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef
} from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { LocalStorageService } from '@services/local-storage.service';
import { AuthService } from '@services/remote-api/auth.service';
import { Observable, concat, Subscription } from 'rxjs';
import {
  startWith,
  map,
  tap,
  retry,
  debounce,
  toArray,
  switchMap,
  debounceTime,
  first
} from 'rxjs/operators';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatDialog
} from '@angular/material';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { Mask } from '@shared/constants/mask';
import {
  AddressCreationDto,
  ClientUpdateInfo,
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
import { SignicatLoanInfoDto } from '@shared/models/loans';
import { LoginService } from '@services/login.service';
import { BankVo } from '@shared/models/bank';
import { GenericInfoDialogComponent } from '@shared/components/ui-components/dialogs/generic-info-dialog/generic-info-dialog.component';
import { VirdiErrorChoiceDialogComponent } from '@shared/components/ui-components/dialogs/virdi-error-choice-dialog/virdi-error-choice-dialog.component';
import { ROUTES_MAP } from '@config/routes-config';
import {
  ErrorDialogData,
  GenericErrorDialogComponent
} from '@shared/components/ui-components/dialogs/generic-error-dialog/generic-error-dialog.component';
import { ApiError } from '@shared/constants/api-error';
import { GlobalStateService } from '@services/global-state.service';
import { RouteEventsService } from '@services/route-events.service';

import { LoginTermsDialogV2Component } from '@shared/components/ui-components/dialogs/login-terms-dialog-v2/login-terms-dialog-v2.component';
@Component({
  selector: 'rente-bank-id-login',
  templateUrl: './bank-id-login.component.html',
  styleUrls: ['./bank-id-login.component.scss']
})
export class BankIdLoginComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('membershipInput') membershipInput: ElementRef<HTMLInputElement>;
  eventSubscription;
  emailFormGroup?: FormGroup;
  userFormGroup?: FormGroup;
  loanFormGroup?: FormGroup;
  membershipFormGroup?: FormGroup;
  manualPropertyValueFormGroup?: FormGroup;
  public membershipCtrl = new FormControl();
  public filteredMemberships: Observable<void | MembershipTypeDto[]>;
  public memberships: any = [];
  public allMemberships: MembershipTypeDto[];
  public showForms = false;
  private responseStatus: any;
  public mask = Mask;
  public isLoading = true;
  public productIdOptions: any[];
  public loanTypeOptions = [
    {
      name: 'Nedbetalingslån',
      value: 'DOWNPAYMENT_REGULAR_LOAN'
    },
    {
      name: 'Rammelån/boligkreditt',
      value: 'CREDIT_LINE'
    }
  ];
  public selectedOffer: string;
  public bank: BankVo | null;
  private loanId: number | null;
  public currentStepperValue = 0;
  public newClient: boolean | null;
  public showManualInputForm = false;
  private routeSubscription: Subscription;
  public signicatIframeUrl?: SafeResourceUrl | null;
  public oldUserNewLoan = false;

  get isMobile(): boolean {
    return window.innerWidth < 600;
  }

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router,
    public dialog: MatDialog,
    private navigationInterceptionService: NavigationInterceptionService,
    private fb: FormBuilder,
    private loanService: LoansService,
    private loginService: LoginService,
    private globalStateService: GlobalStateService,
    private routeEventsService: RouteEventsService,
    private sanitizer: DomSanitizer
  ) {
    this.setRoutingListeners();
  }

  ngOnInit(): void {
    this.scrollToTop();
    this.globalStateService.setFooterState(false);
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  private setRoutingListeners() {
    // Prevent user from going back to this form from the dashboard
    this.routeSubscription = this.routeEventsService.previousRoutePath.subscribe(
      (previousRoutePath) => {
        if (
          !previousRoutePath.includes('bankid-login?status=') &&
          !previousRoutePath.includes('velgbank') &&
          !previousRoutePath.includes('bankid-login')
        ) {
          this.router.navigate(['/']);
        }
      }
    );

    // Make back button synch with form
    this.navigationInterceptionService.setBackButtonCallback(() => {
      if (this.currentStepperValue !== 0) {
        this.back();
      } else {
        this.router.navigate(['/' + ROUTES_MAP.bankSelect]);
      }
    });

    // Getting bank name from the bank-select component
    const stateData = this.router?.getCurrentNavigation()?.extras?.state?.data;
    // Checking for null or undefined
    if (stateData == null) {
      this.router.navigate(['/' + ROUTES_MAP.bankSelect]);
      return;
    } else {
      this.bank = stateData.bank;
      this.loginBankIdStep1();
    }
  }

  getSanatizeIframUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // initialize signicat iframe
  private loginBankIdStep1(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this.authService.loginBankIdStep1().subscribe(
      (response) => {
        this.signicatIframeUrl = this.getSanatizeIframUrl(response.url);
        this.isLoading = false;
      },
      (error) => {
        this.showGenericDialog(error);
      }
    );
  }

  // Wait for signicat successfull login with iframe repsonse
  @HostListener('window:message', ['$event'])
  onMessage(event) {
    if (event.origin === 'https://id.idfy.io') {
      const data = JSON.parse(event.data);
      if (data.status === 'success') {
        this.statusSuccess(data.sessionId);
      }
    }
  }

  // Send sessionId to backend and initialize the correct form based on client info
  private statusSuccess(sessionId: string): void {
    this.localStorageService;
    this.bank &&
      sessionId &&
      this.authService
        .loginBankIdStep2(sessionId, this.bank.name)
        .pipe(retry(2))
        .subscribe(
          (response) => {
            this.signicatIframeUrl = null;
            this.responseStatus = response;
            this.scrollToTop();

            if (response.newClient === true) {
              this.loanService.getAllMemberships().subscribe(
                (onlyMemberships) => {
                  this.initMemberships(onlyMemberships.memberships);
                  this.initNewUserForms();
                  this.isLoading = false;
                },
                (error) => {
                  this.newClient = null;
                  this.showGenericDialog(error);
                }
              );
            } else {
              if (this.bank?.hasFixedLoans === true) {
                this.initLoansForm(response);
              } else {
                if (response.newLoan === true) {
                  this.initNonFixedLoanBankNewLoanForm();
                } else {
                  this.initNonFixedLoanBankOldLoanForm();
                }
              }
            }
          },
          (error) => {
            this.showGenericDialog(error);
          }
        );
  }

  public newUserFinished(): void {
    const signicatLoanInfoDto =
      this.bank?.hasFixedLoans === true
        ? this.fixedBankLoanInfo
        : this.nonFixedBankLoanInfo;

    if (signicatLoanInfoDto === null) {
      this.showGenericDialog();
      return;
    }
    const clientDto = this.clientUpdateInfo;

    if (this.showManualInputForm) {
      clientDto.address.apartmentValue = this.manualPropertyValue;
    }
    this.isLoading = true;

    const userMemberships = {
      memberships: clientDto.memberships
    };
    clientDto.memberships = [];
    concat(
      this.loanService.updateClientInfo(clientDto),
      this.loanService.CreateSignicatLoansInfo([signicatLoanInfoDto]),
      this.loanService.setUsersMemberships(userMemberships)
    )
      .pipe(toArray())
      .subscribe(
        (_) => {
          this.isLoading = false;

          if (this.bank !== null) {
            this.bank && this.loginService.loginWithBankAndToken();
          } else {
            // handle state as error

            this.showGenericDialog();
            this.isLoading = false;
          }
        },
        (error) => {
          if (error.errorType === ApiError.virdiSerachNotFound) {
            const dialogData = {
              header: 'Ops, noe gikk visst galt',
              confirmText: 'Prøv igjen',
              cancelText: 'Avbryt',

              onConfirm: () => {
                this.loanFormGroup?.reset();
                this.userFormGroup?.reset();
                this.membershipFormGroup?.reset();
                this.membershipFormGroup?.reset();
                this.stepper.selectedIndex = 0;
                this.currentStepperValue = 0;
              }
            };
          } else {
            this.showGenericDialog();
          }
        }
      );
  }

  public oldUserFinished(): void {
    const SignicatLoanInfoDto = this.bank?.hasFixedLoans
      ? this.fixedBankLoanInfo
      : this.nonFixedBankLoanInfo;
    if (SignicatLoanInfoDto === null) {
      this.showGenericDialog();
      return;
    }
    this.isLoading = true;

    const request =
      this.responseStatus.newLoan === true
        ? this.loanService.CreateSignicatLoansInfo([SignicatLoanInfoDto])
        : this.loanService.UpdateSignicatLoansInfo([SignicatLoanInfoDto]);

    request.subscribe(
      (result) => {
        this.isLoading = false;
        this.bank && this.loginService.loginWithBankAndToken();
      },
      (error) => {
        this.showGenericDialog();
      }
    );
  }

  initMemberships(memberships): void {
    this.allMemberships = memberships;
    this.filteredMemberships = this.membershipCtrl.valueChanges.pipe(
      startWith(null),
      map((membership: string | null) =>
        membership ? this.filter(membership) : this.allMemberships.slice()
      )
    );
  }

  initNewUserForms(): void {
    this.manualPropertyValueFormGroup = this.fb.group({
      manualPropertyValue: ['', Validators.compose([Validators.required])]
    });
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

    if (this.bank?.hasFixedLoans === true) {
      this.loanFormGroup = this.fb.group({
        outstandingDebt: ['', Validators.required],
        remainingYears: ['', [Validators.max(100)]],
        loanType: ['', Validators.required]
      });
      this.newClient = this.responseStatus.newClient;
    } else {
      this.initNonFixedLoanBankNewLoanForm();
    }

    this.membershipFormGroup = this.fb.group({
      membership: []
    });
  }

  private initLoansForm(loanInfo): void {
    this.isLoading = true;
    if (loanInfo.newLoan === false) {
      forkJoin([
        this.loanService.getOffersBanks(),
        this.loanService.getSignicatLoansInfo()
      ]).subscribe(([offerBanks, signicatLoansInfo]) => {
        const firstLoan = signicatLoansInfo[0];
        this.loanId = firstLoan.id;
        this.productIdOptions = (offerBanks.offers as any[]).map((offer) => {
          return {
            name: offer.name,
            value: offer.id
          };
        });

        const selectedOption = this.productIdOptions.filter((item) => {
          return item.value === firstLoan.productId;
        })[0];
        const outstandingDebt = String(firstLoan.outstandingDebt);
        this.loanFormGroup = this.fb.group({
          outstandingDebt: [outstandingDebt, Validators.required],
          remainingYears: [firstLoan.remainingYears, [Validators.max(100)]],
          loanType: [selectedOption ?? null, Validators.required]
        });

        this.newClient = this.responseStatus.newClient;
        this.isLoading = false;
      });
    } else {
      forkJoin([
        this.loanService.getSignicatLoansInfo(),
        this.loanService.getOffersBanks()
      ]).subscribe(
        ([loanInfo, offerBanks]) => {
          this.productIdOptions = (offerBanks.offers as any[]).map((offer) => {
            return {
              name: offer.name,
              value: offer.id
            };
          });

          if (loanInfo.length !== 0) {
            this.loanId = loanInfo[0].id;
          }

          this.loanFormGroup = this.fb.group({
            outstandingDebt: ['', Validators.required],
            remainingYears: ['', [Validators.required, Validators.max(100)]],
            loanType: ['', Validators.required]
          });

          this.newClient = this.responseStatus.newClient;

          this.isLoading = false;
          this.oldUserNewLoan = true;
        },
        (error) => {
          this.showGenericDialog();
        }
      );
    }
  }

  private initNonFixedLoanBankOldLoanForm(): void {
    this.isLoading = true;
    forkJoin([
      this.loanService.getOffersBanks(),
      this.loanService.getSignicatLoansInfo()
    ]).subscribe(([offerBanks, signicatLoansInfo]) => {
      if (signicatLoansInfo?.length === 0) {
        this.initNonFixedLoanBankNewLoanForm();
        return;
      }

      const firstLoan = signicatLoansInfo[0];

      this.loanId = firstLoan.id;
      this.productIdOptions = (offerBanks.offers as any[]).map((offer) => {
        return {
          name: offer.name,
          value: offer.id
        };
      });

      const selectedloanTypeOption = this.loanTypeOptions.filter((item) => {
        return item.value === firstLoan.loanType;
      })[0];
      const outstandingDebt = String(firstLoan.outstandingDebt);
      this.loanFormGroup = this.fb.group({
        outstandingDebt: [outstandingDebt, Validators.required],
        remainingYears: [
          firstLoan.remainingYears as number,
          [Validators.max(100)]
        ],
        loanTypeOption: [selectedloanTypeOption ?? null, Validators.required]
      });

      this.loanFormGroup?.addControl(
        'interestRate',
        new FormControl(
          firstLoan.nominalInterestRate,
          Validators.compose([
            Validators.required,
            Validators.pattern(VALIDATION_PATTERN.rate)
          ])
        )
      );

      this.loanFormGroup?.addControl(
        'fee',
        new FormControl(firstLoan.fee ?? '50', Validators.required)
      );

      this.newClient = this.responseStatus.newClient;
      this.isLoading = false;
    });
  }

  private initNonFixedLoanBankNewLoanForm(): void {
    this.isLoading = true;

    forkJoin([
      this.loanService.getOffersBanks(),
      this.loanService.getSignicatLoansInfo()
    ]).subscribe(([offerBanks, signicatLoansInfo]) => {
      this.productIdOptions = (offerBanks.offers as any[]).map((offer) => {
        return {
          name: offer.name,
          value: offer.id
        };
      });

      if (signicatLoansInfo.length !== 0) {
        this.loanId = signicatLoansInfo[0].id;
      }

      this.loanFormGroup = this.fb.group({
        outstandingDebt: ['', Validators.required],
        remainingYears: ['', [Validators.max(100)]],
        loanTypeOption: [null, Validators.required]
      });
      this.loanFormGroup?.addControl(
        'interestRate',
        new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(VALIDATION_PATTERN.rate)
          ])
        )
      );

      this.loanFormGroup?.addControl(
        'fee',
        new FormControl('50', Validators.required)
      );

      this.newClient = this.responseStatus.newClient;
      this.isLoading = false;
    });
  }

  private initFixedLoanBankLoansForm(loanInfo): void {
    this.isLoading = true;
    if (loanInfo.newLoan === false) {
      forkJoin([
        this.loanService.getClientInfo(),
        this.loanService.getOffersBanks(),
        this.loanService.getSignicatLoansInfo()
      ]).subscribe(([clientInfo, offerBanks, signicatLoansInfo]) => {
        if (signicatLoansInfo?.length === 0) {
          this.initNewLoanLoanForm();
          return;
        }

        const firstLoan = signicatLoansInfo[0];

        this.productIdOptions = (offerBanks.offers as any[]).map((offer) => {
          return {
            name: offer.name,
            value: offer.id
          };
        });

        const selectedLoanTypeOption = this.loanTypeOptions.filter((item) => {
          return item.value === firstLoan.loanType;
        })[0];
        const outstandingDebt = String(firstLoan.outstandingDebt);
        this.loanFormGroup = this.fb.group({
          outstandingDebt: [outstandingDebt, Validators.required],
          remainingYears: [
            Math.round(firstLoan.remainingYears),
            [Validators.max(100)]
          ],
          loanTypeOptions: [selectedLoanTypeOption ?? null, Validators.required]
        });

        this.newClient = false;
        this.isLoading = false;
      });
    } else {
      this.initNewLoanLoanForm();
    }
  }

  initNewLoanLoanForm(): void {
    this.loanService.getOffersBanks().subscribe(
      (offerBanks) => {
        this.productIdOptions = (offerBanks.offers as any[]).map((offer) => {
          return {
            name: offer.name,
            value: offer.id
          };
        });

        this.oldUserNewLoan = true;
        this.loanFormGroup = this.fb.group({
          outstandingDebt: ['', Validators.required],
          remainingYears: ['', [Validators.required, Validators.max(100)]],
          loanType: ['', Validators.required]
        });
        this.newClient = this.responseStatus.newClient;
        this.isLoading = false;
      },
      (error) => {
        this.showGenericDialog();
      }
    );
  }

  get manualPropertyValue(): number {
    const apartmentValue =
      typeof this.manualPropertyValueFormGroup?.get('manualPropertyValue')
        ?.value === 'string'
        ? this.manualPropertyValueFormGroup
            .get('manualPropertyValue')
            ?.value.replace(/\s/g, '')
        : this.manualPropertyValueFormGroup?.get('manualPropertyValue')?.value;

    return apartmentValue;
  }

  get clientUpdateInfo(): ClientUpdateInfo {
    const addressDto = new AddressCreationDto();
    const clientDto = new ClientUpdateInfo();

    addressDto.apartmentSize = this.userFormGroup?.get('apartmentSize')?.value;
    addressDto.zip = this.userFormGroup?.get('zip')?.value;
    addressDto.street = this.userFormGroup?.get('address')?.value;
    clientDto.address = addressDto;
    clientDto.email = this.emailFormGroup?.get('email')?.value;
    clientDto.income =
      typeof this.userFormGroup?.get('income')?.value === 'string'
        ? this.userFormGroup.get('income')?.value.replace(/\s/g, '')
        : this.userFormGroup?.get('income')?.value;

    clientDto.memberships = this.memberships.map((membership) => {
      return membership.name;
    });

    return clientDto;
  }

  get fixedBankLoanInfo(): SignicatLoanInfoDto | null {
    const signicatLoanInfoDto = new SignicatLoanInfoDto();
    if (this.loanId === null) {
      this.showGenericDialog();
      return null;
    }
    signicatLoanInfoDto.id = this.loanId;
    signicatLoanInfoDto.remainingYears =
      this.loanFormGroup?.get('remainingYears')?.value || 20;

    signicatLoanInfoDto.productId = String(
      this.loanFormGroup?.get('loanType')?.value.value
    );

    signicatLoanInfoDto.outstandingDebt =
      typeof this.loanFormGroup?.get('outstandingDebt')?.value === 'string'
        ? this.loanFormGroup?.get('outstandingDebt')?.value.replace(/\s/g, '')
        : this.loanFormGroup?.get('outstandingDebt')?.value;
    // default value is
    signicatLoanInfoDto.loanSubType = 'AMORTISING_LOAN';
    signicatLoanInfoDto.loanType = 'DOWNPAYMENT_REGULAR_LOAN';
    return signicatLoanInfoDto;
  }

  get nonFixedBankLoanInfo(): SignicatLoanInfoDto | null {
    if (this.loanId === null && this.newClient === false) {
      this.showGenericDialog();
      return null;
    }
    const signicatLoanInfoDto = new SignicatLoanInfoDto();
    if (this.loanId) {
      signicatLoanInfoDto.id = this.loanId;
    }
    signicatLoanInfoDto.remainingYears =
      this.loanFormGroup?.get('remainingYears')?.value || 20;

    signicatLoanInfoDto.loanType = String(
      this.loanFormGroup?.get('loanTypeOption')?.value.value
    );

    if (signicatLoanInfoDto.loanType === 'DOWNPAYMENT_REGULAR_LOAN') {
      signicatLoanInfoDto.loanSubType = 'AMORTISING_LOAN';
    }

    if (signicatLoanInfoDto.loanType === 'CREDIT_LINE') {
      signicatLoanInfoDto.loanSubType = 'SERIES_LOAN';
    }

    signicatLoanInfoDto.fee = this.loanFormGroup
      ?.get('fee')
      ?.value.replace(/\s/g, '');

    let rateString = this.loanFormGroup?.get('interestRate')?.value as string;

    if (rateString === null || rateString === undefined) {
      this.showGenericDialog();
      return null;
    }

    if (typeof rateString === 'string') {
      rateString = rateString.replace(',', '.');
    }

    signicatLoanInfoDto.nominalInterestRate = Number(
      parseFloat(rateString).toFixed(3)
    );

    signicatLoanInfoDto.outstandingDebt =
      typeof this.loanFormGroup?.get('outstandingDebt')?.value === 'string'
        ? this.loanFormGroup?.get('outstandingDebt')?.value.replace(/\s/g, '')
        : this.loanFormGroup?.get('outstandingDebt')?.value;
    // default value is
    signicatLoanInfoDto.loanSubType = 'AMORTISING_LOAN';
    return signicatLoanInfoDto;
  }

  updateStepperIndex(index: number): void {
    if (index !== this.stepper.selectedIndex) {
      this.stepper.selectedIndex = index;
      this.currentStepperValue = index;
    }
  }

  public isInvalid(formGroup: FormGroup, valueName: string): boolean {
    this.emailFormGroup?.get('email')?.updateValueAndValidity();

    return (
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      formGroup.get(valueName)!.hasError('pattern') &&
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      formGroup.get(valueName)!.dirty
    );
  }

  public openInfoDialog(message: any): void {
    this.dialog.open(GenericInfoDialogComponent, {
      data: message
    });
  }

  public openTermsDialog(): void {
    this.dialog.open(LoginTermsDialogV2Component);
  }

  public openTermsInfoDialog(): void {
    const message = '';
    this.dialog.open(GenericInfoDialogComponent, {
      data: message
    });
  }

  public resetForms(): void {
    this.loanFormGroup?.reset();
    this.userFormGroup?.reset();
    this.membershipFormGroup?.reset();
    this.stepper.selectedIndex = 0;
    this.currentStepperValue = 0;
  }

  public showGenericDialog(error?: any): void {
    const dialogData: ErrorDialogData = {
      header: 'Ops, noe gikk visst galt',
      confirmText: 'Prøv igjen',
      cancelText: 'Avbryt',
      error: error,
      onConfirm: () => {
        this.router.navigate(['/' + ROUTES_MAP.bankSelect]);
      },
      onClose: () => {
        this.router.navigate(['/']);
      }
    };
    this.dialog.open(GenericErrorDialogComponent, {
      data: dialogData
    });
  }

  matSelectLoanTypeCompare(o1: any, o2: any): boolean {
    if (o1.name === o2.name && o1.value === o2.value) return true;
    else return false;
  }

  public isErrorState(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  private filter(value: any): void {
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

  private scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  next(): void {
    this.scrollToTop();
    this.stepper.next();
    this.currentStepperValue = this.stepper.selectedIndex;
  }

  back(): void {
    this.scrollToTop();
    this.stepper.previous();
    this.currentStepperValue = this.stepper.selectedIndex;
  }

  public goToLoansFormFromManulPropertyValue(): void {
    this.isLoading = true;
    this.loanService.getOffersBanks().subscribe((offerBanks) => {
      this.productIdOptions = (offerBanks.offers as any[]).map((offer) => {
        return {
          name: offer.name,
          value: offer.id
        };
      });
      this.isLoading = false;
      this.stepper.next();
      this.scrollToTop();
      this.currentStepperValue = this.stepper.selectedIndex;
    });
  }

  goToLoansForm(): void {
    this.isLoading = true;
    this.loanService.updateClientInfo(this.clientUpdateInfo).subscribe(
      (_) => {
        this.loanService.getOffersBanks().subscribe((offerBanks) => {
          this.productIdOptions = (offerBanks.offers as any[]).map((offer) => {
            return {
              name: offer.name,
              value: offer.id
            };
          });
          this.isLoading = false;
          this.stepper.next();
          this.scrollToTop();
          this.currentStepperValue = this.stepper.selectedIndex;
        });
      },
      (error) => {
        if (
          error.errorType === ApiError.virdiSerachNotFound ||
          error.errorType === ApiError.propertyCantFindZip
        ) {
          this.isLoading = false;
          this.dialog.open(VirdiErrorChoiceDialogComponent, {
            data: {
              address: this.clientUpdateInfo.address,
              confirmText: 'Legg til boligverdi',
              cancelText: 'Prøv ny adresse',
              onConfirm: () => {
                this.showManualInputForm = true;
              },
              onClose: () => {}
            }
          });
        } else {
          this.showGenericDialog();
        }
      }
    );
  }

  goToUserForm(): void {
    this.scrollToTop();
    this.stepper.next();
    this.currentStepperValue = this.stepper.selectedIndex;
  }

  goToMembershipForm(): void {
    this.scrollToTop();
    this.stepper.next();
  }
}
