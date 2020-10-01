import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { BankIdLoginComponent } from './bank-id-login/bank-id-login.component';
import { LoginStatusComponent } from './login-status/login-status.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { StatusMessageComponent } from './status-message/status-message.component';
import { DialogInfoServiceComponent } from './bank-id-login/dialog-info-service/dialog-info-service.component';
import { Sparebank1SubComponent } from './sparebank1-sub/sparebank1-sub.component';
import { MaterialModule } from '@shared/material/material.module';
import { BankChoiceComponent } from './bank-choice/bank-choice.component';

@NgModule({
  declarations: [
    BankIdLoginComponent,
    LoginStatusComponent,
    StatusMessageComponent,
    DialogInfoServiceComponent,
    Sparebank1SubComponent,
    BankChoiceComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule
  ],
  entryComponents: [DialogInfoServiceComponent]
})
export class AuthModule { }
