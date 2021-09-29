import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DialogInfoServiceComponent } from './dialog-info-service/dialog-info-service.component';
import { MetaService } from '@services/meta.service';
import { TitleService } from '@services/title.service';
import {
  customMeta,
  ROUTES_MAP,
  ROUTES_MAP_NO
} from '../../../config/routes-config';
import { BankVo, BankUtils } from '@shared/models/bank';
import { ActivatedRoute, Router } from '@angular/router';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { UserService } from '@services/remote-api/user.service';
import { Mask } from '@shared/constants/mask';
import { EMPTY, of, Subscription, timer } from 'rxjs';
import { debounce } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Environment, EnvService } from '@services/env.service';
import { ContactService } from '../../../shared/services/remote-api/contact.service';
import { MatStepper } from '@angular/material';
import { MessageBannerService } from '@services/message-banner.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
import { CrawlerLoginService } from '@services/crawler-login.service';

@Component({
  selector: 'crawler-login',
  templateUrl: './crawler-login.component.html',
  styleUrls: ['./crawler-login.component.scss'],
  providers: [CrawlerLoginService]
})
export class CrawlerLoginComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper: MatStepper;

  public bankIdForm: FormGroup;
  public isSsnBankLogin: boolean;
  public isConfirmed: boolean;
  public isLoginStarted = false;
  public isTinkBank = false;
  public userData: any = {};
  private routeParamsSub: Subscription;
  public metaTitle: string;
  public metaDescription: string;
  public mask = Mask;
  public environment: Environment;
  public missingBankForm: FormGroup;
  public emailError = false;
  public isLoading: boolean;
  public isSb1App = false;
  public isSb1BankId = false;
  public isSB1Bank = false;
  bank: BankVo | null;
  animationType = getAnimationStyles();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private metaService: MetaService,
    private titleService: TitleService,
    private userService: UserService,
    private envService: EnvService,
    private contactService: ContactService,
    private messageService: MessageBannerService,
    private crawlerLoginService: CrawlerLoginService
  ) {}

  ngOnInit(): void {
    this.environment = this.envService.environment;
    this.routeParamsSub = this.route.params.subscribe((params: any) => {
      if (params && params.bankName) {
        const bank = BankUtils.getBankByName(params.bankName);

        this.bank = bank;
        if (!this.bank) {
          this.router.navigate(['/' + ROUTES_MAP.bankSelect]);
          return;
        }
        this.isSsnBankLogin = bank?.loginWithSsn || false;
        this.isSB1Bank = bank?.isSb1Bank || false;

        // Redirect if anyone tries to access crawler login when not available to the public
        if (
          bank?.name === 'DNB' &&
          this.environment.dnbSignicatIsOn === true &&
          this.router.url.includes('autentisering/bank/dnb')
        ) {
          this.router.navigate(
            ['/autentisering/' + ROUTES_MAP_NO.bankIdLogin],
            {
              state: { data: { bank: bank, redirect: true } }
            }
          );
        }

        if (
          bank?.name === 'NORDEA_DIRECT' &&
          this.environment.nordeaDirectSignicatIsOn === true &&
          this.router.url.includes('autentisering/bank/nordea_direct')
        ) {
          this.router.navigate(
            ['/autentisering/' + ROUTES_MAP_NO.bankIdLogin],
            {
              state: { data: { bank: bank } }
            }
          );
        }
        for (const iterator in customMeta) {
          if (customMeta[iterator].title) {
            if (params.bankName === customMeta[iterator].bankName) {
              this.metaTitle = customMeta[iterator].title;
              this.metaDescription = customMeta[iterator].description;
            }
          }
        }

        this.isDnbBank && this.setupDnbEmailForm();
        this.changeTitles();
        this.setBankIdForm();

        if (bank !== null) {
          this.isTinkBank = bank.isTinkBank;
        }
        if (this.isTinkBank) {
          this.isLoginStarted = true;
        }

        // this.setSb1AppForm();
      }
    });

    this.setLoginListeners();
  }

  setLoginListeners(): void {
    this.crawlerLoginService.firstRetry$.subscribe(() => {
      this.isLoginStarted = false;

      this.messageService.setView(
        'Noe gikk feil, vennligst prøv igjen',
        4000,
        this.animationType.DROP_DOWN_UP,
        'success',
        window
      );
    });

    this.crawlerLoginService.secondRetry$.subscribe(() => {
      // Drop subbank membership, redirects directly to signicat flow
      this.router.navigate(['/autentisering/' + ROUTES_MAP_NO.bankIdLogin], {
        state: { data: { bank: this.bank, redirect: true } }
      });

      // Drop subbank membership for DNB for now
      /* 
      if (this.bank?.name === 'DNB') {
        this.router.navigate(
          [
            '/autentisering/' +
              this.bank.name.toLocaleLowerCase() +
              '/' +
              'medlemskap/'
          ],
          {
            state: { data: { bank: this.bank } }
          }
        );
      } else {
        this.router.navigate(['/autentisering/' + ROUTES_MAP_NO.bankIdLogin], {
          state: { data: { bank: this.bank, redirect: true } }
        });
      } */
    });
  }

  goToSignicatLogin(): void {
    this.router.navigate(['/autentisering/' + ROUTES_MAP_NO.bankIdLogin], {
      state: {
        data: {
          bank: this.bank,
          redirect: false,
          userHasNoBankIDForPhone: true
        }
      }
    });
  }

  setupDnbEmailForm(): void {
    this.missingBankForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.email)
        ])
      ]
    });

    this.missingBankForm
      .get('email')
      ?.valueChanges.pipe(
        debounce(() => {
          this.emailError = false;
          return this.inValid() ? timer(2000) : EMPTY;
        })
      )
      .subscribe(() => (this.emailError = this.inValid()));
  }

  ngOnDestroy(): void {
    this.routeParamsSub.unsubscribe();
  }

  get bankLogo(): string {
    return BankUtils.getBankLogoUrl(this.bank?.name || null);
  }

  inValid(): boolean {
    return (
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.missingBankForm.get('email')!.hasError('pattern') &&
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.missingBankForm.get('email')!.dirty
    );
  }

  public request(): void {
    this.isLoading = true;

    const missingBankData = {
      email: this.missingBankForm.value.email,
      bank: 'DNB'
    };

    if (!missingBankData.bank) {
      missingBankData.bank = this.missingBankForm.value.bank;
    }

    this.contactService.sendMissingBank(missingBankData).subscribe(
      (_) => {
        this.isLoading = false;
        this.router.navigate(['/']);

        this.messageService.setView(
          'Du får beskjed når din bank er tilgjengelig',
          6000,
          this.animationType.DROP_DOWN_UP,
          'success',
          window
        );
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  public startLogin(formData): void {
    if (this.isSb1App) {
      formData.loginType = '1';
    }
    this.userData = formData;
    for (const key in this.userData) {
      // remove everything except numbers
      if (typeof this.userData[key] === 'string') {
        this.userData[key] = this.userData[key].replace(/\s/g, '');
      }
    }
    this.isLoginStarted = true;
  }

  public setSb1AppForm(): void {
    this.bankIdForm = this.fb.group({
      ssn: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.ssnMasked)
        ]),
        // Async Validators
        this.environment.production ? [this.ssnAsyncValidator()] : []
      ],
      confirmation: ['', Validators.required]
    });
    this.isSb1App = true;
    this.isSb1BankId = false;
    this.stepper.selectedIndex = 0;
  }

  public setSb1bankIdForm(): void {
    this.bankIdForm = this.fb.group({
      birthdate: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.dob)
        ]),
        // Async Validators
        this.environment.production ? [this.ssnAsyncValidator()] : []
      ],
      phone: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.phoneShort)
        ])
      ],
      confirmation: ['', Validators.required]
    });

    this.isSb1BankId = true;
    this.isSb1App = false;
    this.stepper.selectedIndex = 1;
  }

  private initForm() {
    return this.fb.group({
      ssn: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.ssnMasked)
        ]),
        // Async Validators
        this.environment.production ? [this.ssnAsyncValidator()] : []
      ],
      phone: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.phoneShort)
        ])
      ],
      confirmation: ['', Validators.required]
    });
  }

  public openServiceDialog(): void {
    this.dialog.open(DialogInfoServiceComponent, {});
  }

  private changeTitles(): void {
    if (this.metaTitle && this.metaDescription) {
      this.titleService.setTitle(this.metaTitle);
      this.metaService.updateMetaTags('description', this.metaDescription);
    }
  }

  private setBankIdForm() {
    this.bankIdForm = this.initForm();
    if (!this.isSsnBankLogin) {
      this.bankIdForm.addControl(
        'birthdate',
        new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(VALIDATION_PATTERN.dob)
          ])
        )
      );
      this.bankIdForm.removeControl('ssn');
    }
  }

  returnFromLoginAttempt(): void {
    if (this.isSb1BankId) {
      // Wait for stepper to initiated
      setTimeout(() => {
        this.stepper.selectedIndex = 1;
      }, 10);
    }
    this.isLoginStarted = false;
  }

  isErrorState(
    control: AbstractControl | null,
    form: FormGroup | NgForm | null
  ): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get isDnbBank(): boolean {
    return (this.bank && this.bank.name === 'DNB') || false;
  }

  get isNordeaBank(): boolean {
    return (this.bank && this.bank.name === 'NORDEA') || false;
  }
  /* 
  get isSB1Bank(): boolean {
    return (
      (this.bank &&
        this.bank.name &&
        this.bank.name.indexOf('SPAREBANK_1') > -1) ||
      false
    );
  } */

  get isEikaBank(): boolean {
    return (this.bank && this.bank.isEikaBank) || false;
  }

  get isHandelsbanken(): boolean {
    return (this.bank && this.bank.name === 'HANDELSBANKEN') || false;
  }

  get isDanskebank(): boolean {
    return (this.bank && this.bank.name === 'DANSKE_BANK') || false;
  }

  ssnAsyncValidator(): ValidatorFn {
    return (input: FormControl): ValidationErrors => {
      let ssnToValidate: string = input.value;
      if (ssnToValidate && ssnToValidate.length >= 11) {
        ssnToValidate = ssnToValidate.replace(' ', '');
        return this.userService
          .validateSsn(ssnToValidate)
          .pipe(
            map((res) =>
              res && res.ssn === ssnToValidate && res.valid
                ? {}
                : { ssnNotValid: true }
            )
          );
      } else {
        return of({});
      }
    };
  }

  scrollToBankIDMobile(): void {
    const ref = document.getElementsByClassName('BankIDMobile')[0];

    setTimeout(() => {
      ref.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start'
      });
    }, 100);
  }
}
