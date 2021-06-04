import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { BankIdLoginComponent } from './bank-id-login/bank-id-login.component';
import { BankIdLoginSecretComponent } from './bank-id-login-secret/bank-id-login.component';
import { LoginStatusComponent } from './login-status/login-status.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { StatusMessageComponent } from './status-message/status-message.component';
import { DialogInfoServiceComponent } from './bank-id-login/dialog-info-service/dialog-info-service.component';
import { Sparebank1SubComponent } from './sparebank1-sub/sparebank1-sub.component';
import { MaterialModule } from '@shared/material/material.module';
import { DemoLoginComponent } from './demo-login/demo-user-option-login/demo-login.component';
import { GuidLoginComponent } from './demo-login/guid-login/guid-login.component';

@NgModule({
  declarations: [
    BankIdLoginComponent,
    BankIdLoginSecretComponent,
    DemoLoginComponent,
    DialogInfoServiceComponent,
    GuidLoginComponent,
    LoginStatusComponent,
    Sparebank1SubComponent,
    StatusMessageComponent
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  entryComponents: [DialogInfoServiceComponent]
})
export class AuthModule {}
