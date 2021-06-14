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
import { customMeta, ROUTES_MAP } from '../../../config/routes-config';
import { BankVo, BankUtils } from '@shared/models/bank';
import { ActivatedRoute, Router } from '@angular/router';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { UserService } from '@services/remote-api/user.service';
import { Mask } from '@shared/constants/mask';
import { EMPTY, of, Subscription, timer } from 'rxjs';
import { debounce } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { EnvService } from '@services/env.service';
import { ContactService } from '../../../shared/services/remote-api/contact.service';
import { SnackBarService } from '@services/snackbar.service';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'crawler-login',
  templateUrl: './crawler-login.component.html',
  styleUrls: ['./crawler-login.component.scss']
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
  public environment: any;
  public missingBankForm: FormGroup;
  public emailError = false;
  public isLoading: boolean;
  public sb1LoginIsAppSolution: boolean;
  public isSB1Bank = false;
  bank: BankVo | null;

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
    private snackBar: SnackBarService
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
        this.snackBar.openSuccessSnackBar(
          'Du får beskjed når din bank er tilgjengelig',
          1.2
        );
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  public startLogin(formData): void {
    if (this.sb1LoginIsAppSolution) {
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
    this.sb1LoginIsAppSolution = true;
    this.stepper.selectedIndex = 1;

    this.bankIdForm = this.fb.group({
      ssn: [
        '',
        Validators.compose([Validators.required]),
        // Async Validators
        this.environment.production ? [this.ssnAsyncValidator()] : []
      ],
      confirmation: ['', Validators.required]
    });
  }

  public setSb1bankIdForm(): void {
    console.log('this.isConfirmed');
    console.log(this.isConfirmed);
    console.log('this.bankIdForm.valid');
    console.log(this.bankIdForm.valid);
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

    // this.bankIdForm = this.initForm();
    // this.isSsnBankLogin = false;
    this.sb1LoginIsAppSolution = false;
    this.stepper.selectedIndex = 2;
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
}
