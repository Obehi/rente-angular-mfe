import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { VALIDATION_PATTERN } from '@config/validation-patterns.config';

@Component({
  selector: 'rente-bank-id-login',
  templateUrl: './bank-id-login.component.html',
  styleUrls: ['./bank-id-login.component.scss']
})
export class BankIdLoginComponent implements OnInit {
  public bankIdForm: FormGroup;
  public isSsnBankLogin = true;
  public isLoginStarted = false;
  public userData: any = {};
  constructor( private fb: FormBuilder) { }

  ngOnInit() {
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

  public startLogin(formData) {
    console.log(this.bankIdForm.value);
    this.userData = formData;
    this.isLoginStarted = true;
  }

  private initForm() {

    return this.fb.group({
      ssn: ['', Validators.compose([
        Validators.required,
        Validators.pattern(VALIDATION_PATTERN.ssn)
      ])],
      phone: ['', Validators.compose([
        Validators.required,
        Validators.pattern(VALIDATION_PATTERN.phoneShort)
      ])],
    });
  }

}
