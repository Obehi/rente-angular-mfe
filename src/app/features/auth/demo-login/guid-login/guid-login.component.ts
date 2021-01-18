import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  NgForm,
  FormControl
} from "@angular/forms";
import { ContactService } from "@services/remote-api/contact.service";
import { Router } from "@angular/router";
import { SnackBarService } from "@services/snackbar.service";
import { Mask } from '@shared/constants/mask'
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { environment } from "@environments/environment";
import { locale } from '../../../../config/locale/locale';

import { API_URL_MAP } from "@config/api-url-config";
import { Subscription, interval, Observable, timer, forkJoin } from "rxjs";
import {
  IDENTIFICATION_TIMEOUT_TIME,
  PING_TIME,
  RECONNECTION_TRIES,
  RECONNECTION_TIME,
  BANKID_STATUS,
  BANKID_TIMEOUT_TIME,
  MESSAGE_STATUS
} from "../../../auth/login-status/login-status.config";


import { ViewStatus } from "../../../auth/login-status/login-view-status";

import { take } from "rxjs/operators";
import { AuthService } from "@services/remote-api/auth.service";
import { UserService } from "@services/remote-api/user.service";
import { LoansService } from "@services/remote-api/loans.service";
import { LocalStorageService } from "@services/local-storage.service";
import { BankVo, BankUtils } from "@shared/models/bank";
import { ROUTES_MAP } from '@config/routes-config';
import { CustomLangTextService } from "@services/custom-lang-text.service";



@Component({
  selector: 'guid-login',
  templateUrl: './guid-login.component.html',
  styleUrls: ['./guid-login.component.scss']
})
export class GuidLoginComponent implements OnInit {

  public contactUsForm: FormGroup;
  public isLoading: boolean;
  public loginIdError: boolean = false
  p

  

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private snackBar: SnackBarService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    public customLangTextService: CustomLangTextService
  ) {
  }

  ngOnInit(): void {
    this.contactUsForm = this.fb.group({
      loginId: [
        ""
      ]
    });
  }

  public isErrorState(
    control: AbstractControl | null,
    form: FormGroup | NgForm | null
  ): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  public sendContactUsForm(formData) {
    this.isLoading = true;
    this.contactUsForm.markAllAsTouched();
    this.contactUsForm.updateValueAndValidity();
    this.contactService.sendContactForm(formData).subscribe(
      _ => {
        this.isLoading = false;
        this.router.navigate(["/"]);
        this.snackBar.openSuccessSnackBar(this.customLangTextService.getSnackBarSavedMessage(), 2);
      },
      err => {
        this.isLoading = false;
      }
    );
  }

  inValid() {
    return (
      this.contactUsForm.get('loginId').hasError('pattern') && 
      this.contactUsForm.get('loginId').dirty
    );
  } 
  onBlurErrorCheck() {
    this.loginIdError = this.inValid()
   }

 
  public request() {
    let guid = this.contactUsForm.controls['loginId'].value
    this.isLoading = true;
    this.authService.loginForDemo(guid).subscribe(
      _ => {
          this.isLoading = false;
          this.router.navigate(['/dashboard/' + ROUTES_MAP.offers]);
      },
      err => {
        this.isLoading = false;
        this.snackBar.openFailSnackBar(this.customLangTextService.getSnackBarErrorMessage(), 2)
      }
    );
  
  }

}
