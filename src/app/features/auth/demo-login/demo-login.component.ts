import { Component, OnDestroy, OnInit } from '@angular/core';
import {
} from "@angular/forms";
import { Router } from "@angular/router";
import { SnackBarService } from "@services/snackbar.service";
import { Mask } from '@shared/constants/mask'

import { environment } from "@environments/environment";
import { locale } from '../../../config/locale/locale';

import { API_URL_MAP } from "@config/api-url-config";
import { Subscription, Observable } from "rxjs";
import {
  MESSAGE_STATUS
} from "../../auth/login-status/login-status.config";


import { ViewStatus } from "../../auth/login-status/login-view-status";
import { AuthService } from "@services/remote-api/auth.service";
import { UserService } from "@services/remote-api/user.service";
import { LoansService } from "@services/remote-api/loans.service";
import { LocalStorageService } from "@services/local-storage.service";
import { ROUTES_MAP } from '@config/routes-config';
import { CustomLangTextService } from "@services/custom-lang-text.service";



@Component({
  selector: 'rente-demo-login',
  templateUrl: './demo-login.component.html',
  styleUrls: ['./demo-login.component.scss']
})
export class DemoLoginComponent implements OnInit {

  userSessionId: string;
  guuids: string[] = []

  constructor(
    private snackBar: SnackBarService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private loansService: LoansService,
    private localStorageService: LocalStorageService,
    public customLangTextService: CustomLangTextService
  ) {
  }

  ngOnInit(): void {
    this.guuids.push('56bd15f7bcd54d1f916a1c88555af5c1')

  }

  goToChoice(optionId: number) {
    let guid = this.guuids[optionId]
    this.authService.loginForDemo(guid).subscribe( res => {
      this.userService.getUserInfo().subscribe( userInfo => {
       this.router.navigate(['/dashboard/' + ROUTES_MAP.offers]);
      })
    })
  }
}
