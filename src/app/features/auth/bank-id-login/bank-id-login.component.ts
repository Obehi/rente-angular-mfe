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
import {
  Observable,
  of,
  from,
  fromEvent,
  timer,
  EMPTY,
  concat,
  scheduled
} from 'rxjs';
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
  MembershipTypeDto
} from '@shared/models/loans';
import { LoansService } from '@services/remote-api/loans.service';
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
import { ROUTES_MAP } from '@config/routes-config';
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
  manualPropertyValueFormGroup: FormGroup;
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
  public newClient = true;
  public showManualInputForm = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router,
    location: PlatformLocation,
    public dialog: MatDialog,
    private navigationInterceptionService: NavigationInterceptionService,
    private fb: FormBuilder,
    private loanService: LoansService,
    private loginService: LoginService,
    private profileService: ProfileService,
    private globalStateService: GlobalStateService,
    private routeEventsService: RouteEventsService
  ) {}

  ngOnInit(): void {
    console.log(this.routeEventsService.previousRoutePath);
    console.log(this.routeEventsService.previousRoutePath);
    console.log(this.routeEventsService.previousRoutePath.subscribe);

    this.routeEventsService.previousRoutePath.subscribe((previousRoutePath) => {
      if (!previousRoutePath.includes('bankid-login?status=')) {
        this.router.navigate(['/']);
      }
    });
    this.navigationInterceptionService.setBackButtonCallback(() => {
      if (this.currentStepperValue !== 0) {
        this.back();
      } else {
        this.router.navigate(['/' + ROUTES_MAP.bankSelect]);
      }
    });

    this.globalStateService.setFooterState(false);
    this.route.queryParams.subscribe((routeParams) => {
      const status = routeParams['status'];
      const sessionId = routeParams['sessionId'];

      console.log('status');
      console.log(status);
      // status = 'error';
      switch (status) {
        case 'success':
          const bankName = this.localStorageService.getItem('bankIdLoginBank');
          this.bank = BankUtils.getBankByName(bankName);
          this.bank && this.statusSuccess(sessionId);
          break;

        case 'abort':
          this.router.navigate(['/' + ROUTES_MAP.bankSelect]);
          break;

        case 'error':
          const dialogData = {
            header: 'Ops, noe gikk visst galt',
            confirmText: 'Prøv igjen',
            cancelText: 'Avbryt',
            onConfirm: () => {
              console.log('its happenigns bunker ');
              this.router.navigate(['/' + ROUTES_MAP.bankSelect]);
            }
          };
          this.dialog.open(GenericErrorDialogComponent, {
            data: dialogData
          });
          break;

        default: {
          const dialogData = {
            header: 'Ops, noe gikk visst galt',
            confirmText: 'Prøv igjen',
            cancelText: 'Avbryt',
            onConfirm: () => {
              console.log('its happenigns bunker ');
              this.router.navigate(['/' + ROUTES_MAP.bankSelect]);
            }
          };
          this.dialog.open(GenericErrorDialogComponent, {
            data: dialogData
          });
          break;
        }
      }
    });
  }

  public statusSuccess(sessionId: string): void {
    this.bank &&
      sessionId &&
      this.authService
        .loginBankIdStep2(sessionId, this.bank.name)
        .pipe(retry(2))
        .subscribe(
          (response) => {
            this.oneTimeToken = response.token;

            response.newClient = true;
            if (response.newClient === false) {
              this.initLoansForm(response);
            } else {
              this.loanService.getConfirmationData().subscribe((userInfo) => {
                this.initMemberships(userInfo);
                this.initNewUserForms();
                this.handlePublic();
                this.isLoading = false;
                this.showForms = true;
                this.newClient = true;
              });
            }
          },
          (error) => {
            this.showForms = false;
            console.log('error handling');
            console.log(error);
            const dialogData: ErrorDialogData = {
              header: 'Ops, noe gikk visst galt',
              confirmText: 'Prøv igjen',
              cancelText: 'Avbryt',
              onConfirm: () => {
                this.router.navigate(['/' + ROUTES_MAP.bankSelect]);
              },
              onClose: () => {
                this.router.navigate(['/'], { replaceUrl: true });
              }
            };

            this.dialog.open(GenericErrorDialogComponent, {
              data: dialogData
            });
          }
        );
  }

  public isErrorState(control: AbstractControl | null): boolean {
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

  private initLoansForm(loanInfo): void {
    this.isLoading = true;
    if (loanInfo.newLoan === false) {
      forkJoin(
        this.loanService.getClientInfo(),
        this.loanService.getOffersBanks()
      ).subscribe(([clientInfo, offerBanks]) => {
        const outstandingDebt = String(clientInfo.outstandingDebt);
        this.loanFormGroup = this.fb.group({
          outstandingDebt: [outstandingDebt, Validators.required],
          remainingYears: [
            clientInfo.remainingYears,
            [Validators.required, Validators.max(100)]
          ],
          loanType: [clientInfo.loanType, Validators.required]
        });

        this.selectOptions = (offerBanks.offers as any[]).map((offer) => {
          return {
            name: offer.name,
            value: offer.id
          };
        });

        const selectedOption = this.selectOptions.filter((item) => {
          item.id = clientInfo.loanType;
        });
        selectedOption &&
          this.loanFormGroup.get('loanType')?.setValue(selectedOption);

        this.newClient = false;
      });
      this.loanService.getClientInfo().subscribe((response) => {
        const outstandingDebt = String(response.outstandingDebt);
        this.loanFormGroup = this.fb.group({
          outstandingDebt: [outstandingDebt, Validators.required],
          remainingYears: [
            response.remainingYears,
            [Validators.required, Validators.max(100)]
          ],
          loanType: [response.loanType, Validators.required]
        });
        this.newClient = false;
      });
    } else {
      this.loanFormGroup = this.fb.group({
        outstandingDebt: ['', Validators.required],
        remainingYears: ['', [Validators.required, Validators.max(100)]],
        loanType: ['', Validators.required]
      });
      this.newClient = false;
    }

    this.isLoading = true;
    this.loanService.getOffersBanks().subscribe((offerBanks) => {
      this.selectOptions = (offerBanks.offers as any[]).map((offer) => {
        return {
          name: offer.name,
          value: offer.id
        };
      });

      this.isLoading = false;
    });
  }

  get manualPropertyValue(): number {
    const addressDto = new AddressCreationDto();

    const clientDto = new ClientUpdateInfo();
    clientDto.address = new AddressCreationDto();

    const apartmentValue =
      typeof this.manualPropertyValueFormGroup.get('manualPropertyValue')
        ?.value === 'string'
        ? this.manualPropertyValueFormGroup
            .get('manualPropertyValue')
            ?.value.replace(/\s/g, '')
        : this.manualPropertyValueFormGroup.get('manualPropertyValue')?.value;

    return apartmentValue;
  }

  public doneClicked(): void {
    const loanUpdateInfoDto = this.loanUpdateInfoDto;
    const clientDto = this.clientUpdateInfo;

    if (this.showManualInputForm) {
      clientDto.address.apartmentValue = this.manualPropertyValue;
    }

    this.isLoading = true;
    concat(
      this.loanService.updateClientInfo(clientDto),
      this.loanService.updateLoanUserInfo(loanUpdateInfoDto)
    )
      .pipe(toArray())
      .subscribe(
        (results) => {
          console.log('clientInfoResponse & loanInfoResponse');
          if (this.bank !== null && this.oneTimeToken) {
            this.bank &&
              this.loginService.loginWithBankAndToken(
                this.bank,
                this.oneTimeToken
              );
          } else {
            // handle state as error

            const dialogData: ErrorDialogData = {
              header: 'Ops, noe gikk visst galt',
              confirmText: 'Prøv igjen',
              cancelText: 'Avbryt',
              onConfirm: () => {
                this.router.navigate(['/' + ROUTES_MAP.bankSelect]);
              },
              onClose: () => {
                this.router.navigate(['/'], { replaceUrl: true });
              }
            };
            this.dialog.open(GenericErrorDialogComponent, {
              data: dialogData
            });
            this.isLoading = false;
          }
        },
        (error) => {
          console.log(error);

          if (error.errorType === ApiError.virdiSerachNotFound) {
            const dialogData = {
              header: 'Ops, noe gikk visst galt',
              confirmText: 'Prøv igjen',
              cancelText: 'Avbryt',

              onConfirm: () => {
                console.log('ITS HAPPENING BUNKER');
                this.loanFormGroup.reset();
                this.userFormGroup.reset();
                this.membershipFormGroup.reset();
                this.membershipFormGroup.reset();
                this.stepper.selectedIndex = 0;
                this.currentStepperValue = 0;
              }
            };
          }
          const dialogData = {
            header: 'Ops, noe gikk visst galt',
            confirmText: 'Prøv igjen',
            cancelText: 'Avbryt',
            onConfirm: () => {
              console.log('ITS HAPPENING BUNKER');
              this.loanFormGroup.reset();
              this.userFormGroup.reset();
              this.membershipFormGroup.reset();
              this.membershipFormGroup.reset();
              this.stepper.selectedIndex = 0;
              this.currentStepperValue = 0;
            }
          };

          this.dialog.open(GenericErrorDialogComponent, {
            data: dialogData
          });
        }
      );
  }

  get clientUpdateInfo(): ClientUpdateInfo {
    const addressDto = new AddressCreationDto();
    const clientDto = new ClientUpdateInfo();

    addressDto.apartmentSize = this.userFormGroup.get('apartmentSize')?.value;
    addressDto.zip = this.userFormGroup.get('zip')?.value;
    addressDto.street = this.userFormGroup.get('address')?.value;

    clientDto.address = addressDto;
    clientDto.email = this.userFormGroup.get('email')?.value;
    clientDto.income =
      typeof this.userFormGroup.get('income')?.value === 'string'
        ? this.userFormGroup.get('income')?.value.replace(/\s/g, '')
        : this.userFormGroup.get('income')?.value;
    return clientDto;
  }

  get loanUpdateInfoDto(): LoanUpdateInfoDto {
    const loanUpdateInfoDto = new LoanUpdateInfoDto();
    loanUpdateInfoDto.remainingYears = this.loanFormGroup.get(
      'remainingYears'
    )?.value;
    loanUpdateInfoDto.productId = String(
      this.loanFormGroup.get('loanType')?.value
    );

    (loanUpdateInfoDto.outstandingDebt =
      typeof this.loanFormGroup.get('outstandingDebt')?.value === 'string'
        ? this.loanFormGroup.get('outstandingDebt')?.value.replace(/\s/g, '')
        : this.loanFormGroup.get('outstandingDebt')?.value),
      // default value is
      (loanUpdateInfoDto.loanSubType = 'AMORTISING_LOAN');
    return loanUpdateInfoDto;
  }

  updateStepperIndex(index: number): void {
    console.log('updateStepperIndex');
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
    console.log('formGroup.get(valueName)');
    console.log(formGroup.get(valueName));
    console.log('error');

    this.emailFormGroup.get('email')?.updateValueAndValidity();
    console.log(formGroup.get(valueName)?.invalid);
    console.log(formGroup.get(valueName)?.invalid);

    console.log(this.emailFormGroup.get('email')?.invalid);
    return (
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      formGroup.get(valueName)!.hasError('pattern') &&
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      formGroup.get(valueName)!.dirty
    );
  }

  next(): void {
    this.stepper.next();
    this.currentStepperValue = this.stepper.selectedIndex;
  }

  back(): void {
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
      this.currentStepperValue = this.stepper.selectedIndex;
    });
  }

  goToLoansForm(): void {
    this.isLoading = true;
    this.loanService.updateClientInfo(this.clientUpdateInfo).subscribe(
      (result) => {
        this.loanService.getOffersBanks().subscribe((offerBanks) => {
          this.selectOptions = (offerBanks.offers as any[]).map((offer) => {
            return {
              name: offer.name,
              value: offer.id
            };
          });
          this.isLoading = false;
          this.stepper.next();
          this.currentStepperValue = this.stepper.selectedIndex;
        });
      },
      (error) => {
        console.log(error);

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
              onClose: () => {
                this.resetForms();
              }
            }
          });
        } else {
          const dialogData: ErrorDialogData = {
            header: 'Ops, noe gikk visst galt',
            confirmText: 'Prøv igjen',
            cancelText: 'Avbryt'
          };

          this.dialog.open(GenericErrorDialogComponent, {
            data: dialogData
          });
        }
      }
    );
  }

  goToUserForm(): void {
    this.stepper.next();
    this.currentStepperValue = this.stepper.selectedIndex;
    console.log(this.stepper.selectedIndex);
  }

  goToMembershipForm(): void {
    this.stepper.next();
  }

  public oldUserFinished(): void {
    const loanUpdateInfoDto = this.loanUpdateInfoDto;
    this.loanService
      .updateLoanUserInfo(loanUpdateInfoDto)
      .subscribe((result) => {
        if (this.bank !== null && this.oneTimeToken !== null) {
          this.bank &&
            this.loginService.loginWithBankAndToken(
              this.bank,
              this.oneTimeToken
            );
        } else {
          // handle state as error
        }
      });
  }

  public openInfoDialog(message: any): void {
    this.dialog.open(GenericInfoDialogComponent, {
      data: message
    });
  }

  public resetForms(): void {
    this.loanFormGroup.reset();
    this.userFormGroup.reset();
    this.membershipFormGroup.reset();
    this.membershipFormGroup.reset();
    this.stepper.selectedIndex = 0;
    this.currentStepperValue = 0;
  }
}
