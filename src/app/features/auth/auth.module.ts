import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { BankIdLoginComponent } from './bank-id-login/bank-id-login.component';
import { LoginStatusComponent } from './login-status/login-status.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { StatusMessageComponent } from './status-message/status-message.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Sparebank1SubComponent } from './sparebank1-sub/sparebank1-sub.component';

@NgModule({
  declarations: [BankIdLoginComponent, LoginStatusComponent, StatusMessageComponent, Sparebank1SubComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatProgressSpinnerModule
  ]
})
export class AuthModule { }
