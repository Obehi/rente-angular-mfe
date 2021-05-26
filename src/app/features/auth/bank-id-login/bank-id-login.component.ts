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
  debounceTime
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
import { GenericInfoDialogComponent } from '@shared/components/ui-components/dialogs/generic-info-dialog/generic-info-dialog.component';
import { VirdiErrorChoiceDialogComponent } from '@shared/components/ui-components/dialogs/virdi-error-choice-dialog/virdi-error-choice-dialog.component';
import { ROUTES_MAP, ROUTES_MAP_NO } from '@config/routes-config';
import {
  ErrorDialogData,
  GenericErrorDialogComponent
} from '@shared/components/ui-components/dialogs/generic-error-dialog/generic-error-dialog.component';
import { ApiError } from '@shared/constants/api-error';
import { ProfileService } from '@services/remote-api/profile.service';
import { GlobalStateService } from '@services/global-state.service';
import { RouteEventsService } from '@services/route-events.service';
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
  public mask = Mask;
  public isLoading = true;
  public selectOptions: any;
  public selectedOffer: string;
  private bank: string | null;
  public currentStepperValue = 0;
  public newClient = true;
  public showManualInputForm = false;
  private routeSubscription: Subscription;
  signicatIframeUrl?: SafeResourceUrl | null;
  public oldUserNewLoan = false;

  constructor(
    private route: ActivatedRoute,
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this.globalStateService.setFooterState(false);
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  private setRoutingListeners() {
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

    this.navigationInterceptionService.setBackButtonCallback(() => {
      if (this.currentStepperValue !== 0) {
        this.back();
      } else {
        this.router.navigate(['/' + ROUTES_MAP.bankSelect]);
      }
    });

    const bankParam = this.router?.getCurrentNavigation()?.extras?.state?.data;

    if (bankParam == null) {
      this.router.navigate(['/' + ROUTES_MAP.bankSelect]);
      return;
    } else {
      this.bank = bankParam;
      this.loginBankIdStep1(bankParam);
    }
  }

  getSanatizeIframUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  setBankIdInfo(response, bank): void {
    this.localStorageService.setItem('bankIdLoginBank', bank.name);
    this.localStorageService.setItem('bankIdLoginBankCode', response.code);
  }

  private loginBankIdStep1(bankName: string): void {
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

  @HostListener('window:message', ['$event'])
  onMessage(event) {
    if (event.origin === 'https://id.idfy.io') {
      const data = JSON.parse(event.data);
      if (data.status === 'success') {
        this.statusSuccess(data.sessionId);
      }
    }
  }

  private statusSuccess(sessionId: string): void {
    this.localStorageService;
    this.bank &&
      sessionId &&
      this.authService
        .loginBankIdStep2(sessionId, this.bank)
        .pipe(retry(2))
        .subscribe(
          (response) => {
            this.signicatIframeUrl = null;

            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });

            if (response.newClient === true) {
              this.loanService.getAllMemberships().subscribe(
                (onlyMemberships) => {
                  this.initMemberships(onlyMemberships.memberships);
                  this.initNewUserForms();
                  // this.handlePublic();
                  this.isLoading = false;
                  this.showForms = true;
                  this.newClient = true;
                },
                (error) => {
                  this.showForms = false;
                  this.showGenericDialog(error);
                }
              );
            } else {
              this.initLoansForm(response);
            }
          },
          (error) => {
            this.showGenericDialog(error);
          }
        );
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

  initMemberships(memberships): void {
    this.allMemberships = memberships;
    this.filteredMemberships = this.membershipCtrl.valueChanges.pipe(
      startWith(null),
      map((membership: string | null) =>
        membership ? this.filter(membership) : this.allMemberships.slice()
      )
    );
  }

  public offerSelected(event: any): void {
    this.selectedOffer = event;
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

    this.loanFormGroup = this.fb.group({
      outstandingDebt: ['', Validators.required],
      remainingYears: ['', [Validators.required, Validators.max(100)]],
      loanType: ['', Validators.required]
    });

    this.membershipFormGroup = this.fb.group({
      membership: []
    });
  }

  matSelectLoanTypeCompare(o1: any, o2: any): boolean {
    if (o1.name === o2.name && o1.value === o2.value) return true;
    else return false;
  }

  private initLoansForm(loanInfo): void {
    this.isLoading = true;
    if (loanInfo.newLoan === false) {
      forkJoin([
        this.loanService.getClientInfo(),
        this.loanService.getOffersBanks()
      ]).subscribe(([clientInfo, offerBanks]) => {
        this.selectOptions = (offerBanks.offers as any[]).map((offer) => {
          return {
            name: offer.name,
            value: offer.id
          };
        });

        const selectedOption = this.selectOptions.filter((item) => {
          return item.value === clientInfo.productId;
        })[0];
        const outstandingDebt = String(clientInfo.outstandingDebt);
        this.loanFormGroup = this.fb.group({
          outstandingDebt: [outstandingDebt, Validators.required],
          remainingYears: [
            clientInfo.remainingYears,
            [Validators.required, Validators.max(100)]
          ],
          loanType: [selectedOption ?? null, Validators.required]
        });

        this.newClient = false;
        this.isLoading = false;
      });
    } else {
      this.loanService.getOffersBanks().subscribe(
        (offerBanks) => {
          this.selectOptions = (offerBanks.offers as any[]).map((offer) => {
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
          this.newClient = false;
          this.isLoading = false;
        },
        (error) => {
          this.showGenericDialog();
        }
      );
    }
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

  public doneClicked(): void {
    const loanUpdateInfoDto = this.loanUpdateInfoDto;
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
      this.loanService.updateLoanUserInfo(loanUpdateInfoDto),
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

  get loanUpdateInfoDto(): LoanUpdateInfoDto {
    const loanUpdateInfoDto = new LoanUpdateInfoDto();
    loanUpdateInfoDto.remainingYears = this.loanFormGroup?.get(
      'remainingYears'
    )?.value;

    loanUpdateInfoDto.productId = String(
      this.loanFormGroup?.get('loanType')?.value.value
    );

    (loanUpdateInfoDto.outstandingDebt =
      typeof this.loanFormGroup?.get('outstandingDebt')?.value === 'string'
        ? this.loanFormGroup?.get('outstandingDebt')?.value.replace(/\s/g, '')
        : this.loanFormGroup?.get('outstandingDebt')?.value),
      // default value is
      (loanUpdateInfoDto.loanSubType = 'AMORTISING_LOAN');
    return loanUpdateInfoDto;
  }

  updateStepperIndex(index: number): void {
    if (index !== this.stepper.selectedIndex) {
      this.stepper.selectedIndex = index;
      this.currentStepperValue = index;
    }
  }

  private handlePublic() {
    /* this.emailFormGroup
      .get('email')
      ?.valueChanges.pipe(
        tap(() => {
          this.emailFormGroup.get('email')?.setErrors(null);
        }),
        debounceTime(1000),
        switchMap((value) => {
          return of(this.isInvalid(this.emailFormGroup, 'email'));
        }),
        tap(() => {
          console.log('tapped');
          this.emailFormGroup.get('email')?.updateValueAndValidity();
        })
      )
      .subscribe((state) => {
        console.log('loggs');
        console.log(state);

         state
          ? this.emailFormGroup.get('email')?.setErrors(null)
          : this.emailFormGroup.get('email')?.setErrors({ incorrect: true });
      }); */
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
      this.selectOptions = (offerBanks.offers as any[]).map((offer) => {
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
          this.selectOptions = (offerBanks.offers as any[]).map((offer) => {
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

  public oldUserFinished(): void {
    const loanUpdateInfoDto = this.loanUpdateInfoDto;
    this.isLoading = true;
    this.loanService.updateLoanUserInfo(loanUpdateInfoDto).subscribe(
      (result) => {
        this.isLoading = false;
        this.bank && this.loginService.loginWithBankAndToken();
      },
      (error) => {
        this.showGenericDialog();
      }
    );
  }

  public resetLoginState(): void {
    this.localStorageService.removeItem('bankIdLoginBank');
    this.localStorageService.removeItem('bankIdLoginBankCode');
    this.localStorageService.removeItem('NewUserInLoginProccess');
    this.localStorageService.removeItem('loginState');
    this.localStorageService.removeItem('LoggingSessionId');
  }

  public openInfoDialog(message: any): void {
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
    console.log('showGenericDialog');
    console.log(error);
    const dialogData: ErrorDialogData = {
      header: 'Ops, noe gikk visst galt',
      confirmText: 'Prøv igjen',
      cancelText: 'Avbryt',
      error: error,
      onConfirm: () => {
        this.resetLoginState();
        this.router.navigate(['/' + ROUTES_MAP.bankSelect]);
      },
      onClose: () => {
        this.resetLoginState();

        this.router.navigate(['/']);
      }
    };
    this.dialog.open(GenericErrorDialogComponent, {
      data: dialogData
    });
  }

  private scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
