import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';
import { ActivatedRoute } from '@angular/router';
import { BANK_MAP } from '../login-status/login-status.config';

@Component({
  selector: 'rente-bank-id-login',
  templateUrl: './bank-id-login.component.html',
  styleUrls: ['./bank-id-login.component.scss']
})
export class BankIdLoginComponent implements OnInit, OnDestroy {
  public bankIdForm: FormGroup;
  public isSsnBankLogin: boolean;
  public isLoginStarted = false;
  public userData: any = {};
  public userBank: any;
  private routeParamsSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.routeParamsSub = this.route.params.subscribe((params: any) => {
      if (params && params.bankName) {
        console.log(params.bankName);
        this.userBank = BANK_MAP[params.bankName];
        this.isSsnBankLogin = BANK_MAP[params.bankName].isSSN;
          // console.log(this.userBank);
        this.setBankIdForm();
      }
    });
  }

  ngOnDestroy() {
    this.routeParamsSub.unsubscribe();
  }

  public startLogin(formData) {
    this.userData = formData;
    this.isLoginStarted = true;
  }

  private initForm() {
    // 13018939554
    // 93253768
    return this.fb.group({
      ssn: ['', Validators.compose([
        Validators.required,
        Validators.pattern(VALIDATION_PATTERN.ssn)
      ])],
      phone: ['', Validators.compose([
        Validators.required,
        Validators.pattern(VALIDATION_PATTERN.phoneShort)
      ])],
    }, {
      updateOn: 'blur'
    });
  }

  private setBankIdForm() {
    this.bankIdForm = this.initForm();
    if (!this.isSsnBankLogin) {
      this.bankIdForm.addControl('birthdate', new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern(VALIDATION_PATTERN.dob)
        ])
      ));
      this.bankIdForm.removeControl('ssn');
    }
  }

}
