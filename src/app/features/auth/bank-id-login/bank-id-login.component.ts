import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
  NgForm
} from '@angular/forms';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { BANK_MAP } from '../login-status/login-status.config';
import { MatDialog } from '@angular/material';
import { DialogInfoServiceComponent } from './dialog-info-service/dialog-info-service.component';
import { MetaService } from '@services/meta.service';
import { TitleService } from '@services/title.service';
import { customMeta } from '../../../config/routes-config';
import { BankVo, BankList } from '@shared/models/bank';
import { BANKS_DATA } from '@config/banks-config';

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
  public userBank: any;
  public bankLogo: string;
  public ssnMask = {
    mask: [
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      ' ',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/
    ],
    guide: false
  };
  public phoneMask = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    guide: false
  };
  public birthdateMask = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    guide: false
  };
  private routeParamsSub: Subscription;
  public metaTitle: string;
  public metaDescription: string;

  selectedBank:BankVo;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private metaService: MetaService,
    private titleService: TitleService
  ) {}

  ngOnInit() {
    this.routeParamsSub = this.route.params.subscribe((params: any) => {
      if (params && params.bankName) {
        const bank = this.getBankByName(params.bankName);
        this.selectedBank = bank;

        for (const iterator in customMeta) {
          if (customMeta[iterator].title) {
            if (params.bankName === customMeta[iterator].bankName) {
              this.metaTitle = customMeta[iterator].title;
              this.metaDescription = customMeta[iterator].description;
            }
          }
        }

        this.userBank = BANK_MAP[bank.name.toLocaleLowerCase()];
        if (this.userBank) {
          this.bankLogo = this.userBank.bankIcon;
          this.isSsnBankLogin = this.userBank.isSSN;
        }
        if (this.bankLogo == null) {
          this.bankLogo = BANKS_DATA[bank.name] ? BANKS_DATA[bank.name].img : null;
        }

        this.changeTitles();
        this.setBankIdForm();
      }
    });
  }

  getBankByName(name:string):BankVo {
    const allBanks = BankList;
    const n = name.toLocaleLowerCase();
    for (const bank of allBanks) {
      if (bank.name.toLocaleLowerCase() == n) {
        return bank;
      }
    }
    return null;
  }

  ngOnDestroy() {
    this.routeParamsSub.unsubscribe();
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
    // 13018939554
    // 93253768
    // VALIDATION_PATTERN.ssn
    return this.fb.group({
      ssn: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.ssnMasked)
        ])
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
    this.dialog.open(DialogInfoServiceComponent, {
      width: '800px',
      maxHeight: '85vh'
    });
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
    return this.userBank && this.userBank.bankName === 'DNB';
  }

  get isSB1Bank(): boolean {
    return this.userBank && this.userBank.bankName && this.userBank.bankName.indexOf('SPAREBANK_1') > -1;
  }

}
