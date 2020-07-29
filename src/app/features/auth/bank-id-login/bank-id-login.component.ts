import { Subscription, timer, of, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
  NgForm,
  ValidatorFn,
  ValidationErrors
} from '@angular/forms';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { ActivatedRoute} from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogInfoServiceComponent } from './dialog-info-service/dialog-info-service.component';
import { MetaService } from '@services/meta.service';
import { TitleService } from '@services/title.service';
import { customMeta } from '../../../config/routes-config';
import { BankVo, BankUtils } from '@shared/models/bank';
import { environment } from '@environments/environment';
import { UserService } from '@services/remote-api/user.service';
import { map } from 'rxjs/operators';
import { Mask } from '@shared/constants/mask'

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
  public mask = Mask

  bank:BankVo;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private metaService: MetaService,
    private titleService: TitleService,
    private userService:UserService
  ) { }

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

        this.changeTitles();
        this.setBankIdForm();
      }
    });
  }

  ngOnDestroy() {
    this.routeParamsSub.unsubscribe();
  }

  get bankLogo():string {
    return BankUtils.getBankLogoUrl(this.bank.name);
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
          Validators.pattern(VALIDATION_PATTERN.ssnMasked),
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
    return this.bank && this.bank.name && this.bank.name.indexOf('SPAREBANK_1') > -1;
  }

  get isEikaBank(): boolean {
    return this.bank && this.bank.isEikaBank;
  }

  ssnAsyncValidator():ValidatorFn {
    return (input:FormControl):ValidationErrors => {
      let ssnToValidate:string = input.value;
      if (ssnToValidate && ssnToValidate.length >= 11) {
        ssnToValidate = ssnToValidate.replace(' ', '');
        return this.userService.validateSsn(ssnToValidate).pipe(
          map(res => res && res.ssn === ssnToValidate && res.valid ? {} : { ssnNotValid : true })
        );
      } else {
        of({});
      }
    };
  }

}
