import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { environment } from '@environments/environment';
import { MetaService } from '@services/meta.service';
import { UserService } from '@services/remote-api/user.service';
import { TitleService } from '@services/title.service';
import { Mask } from '@shared/constants/mask';
import { BankUtils, BankVo } from '@shared/models/bank';
import { EMPTY, of, Subscription, timer } from 'rxjs';
import { debounce } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { customMeta } from '../../../config/routes-config';
import { ContactService } from '../../../shared/services/remote-api/contact.service';
import { DialogInfoServiceComponent } from './dialog-info-service/dialog-info-service.component';
import { SnackBarService } from '@services/snackbar.service';

@Component({
  selector: 'rente-bank-id-login',
  templateUrl: './bank-id-login.component.html',
  styleUrls: ['./bank-id-login.component.scss']
})
export class BankIdLoginComponent implements OnInit, OnDestroy {
  public bankIdForm: FormGroup;
  public isSsnBankLogin: boolean;
  public isConfirmed: boolean;
  public isLoginStarted = false;
  public userData: any = {};
  private routeParamsSub: Subscription;
  public metaTitle: string;
  public metaDescription: string;
  public mask = Mask;
  public missingBankForm: FormGroup;
  public emailError = false;
  public isLoading: boolean;

  bank: BankVo;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private metaService: MetaService,
    private titleService: TitleService,
    private userService: UserService,
    private contactService: ContactService,
    private snackBar: SnackBarService
  ) {}

  ngOnInit() {
    this.routeParamsSub = this.route.params.subscribe((params: any) => {
      if (params && params.bankName) {
        const bank = BankUtils.getBankByName(params.bankName);
        this.bank = bank;
        this.isSsnBankLogin = bank.loginWithSsn;

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
      }
    });
  }

  setupDnbEmailForm() {
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
      .valueChanges.pipe(
        debounce((data) => {
          this.emailError = false;
          return this.inValid() ? timer(2000) : EMPTY;
        })
      )
      .subscribe((data) => (this.emailError = this.inValid()));
  }

  ngOnDestroy() {
    this.routeParamsSub.unsubscribe();
  }

  get bankLogo(): string {
    return BankUtils.getBankLogoUrl(this.bank.name);
  }

  inValid() {
    return (
      this.missingBankForm.get('email').hasError('pattern') &&
      this.missingBankForm.get('email').dirty
    );
  }

  public request() {
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

  public startLogin(formData) {
    this.userData = formData;
    for (const key in this.userData) {
      // remove everything except numbers
      if (typeof this.userData[key] === 'string') {
        this.userData[key] = this.userData[key].replace(/\s/g, '');
      }
    }
    this.isLoginStarted = true;
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
        environment.production ? [this.ssnAsyncValidator()] : []
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
    return this.bank && this.bank.name === 'DNB';
  }

  get isNordeaBank(): boolean {
    return this.bank && this.bank.name === 'NORDEA';
  }

  get isSB1Bank(): boolean {
    return (
      this.bank && this.bank.name && this.bank.name.indexOf('SPAREBANK_1') > -1
    );
  }

  get isEikaBank(): boolean {
    return this.bank && this.bank.isEikaBank;
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
        of({});
      }
    };
  }
}
