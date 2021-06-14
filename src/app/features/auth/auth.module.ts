import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { CrawlerLoginComponent } from './crawler-login/crawler-login.component';
import { BankIdLoginComponent } from './bank-id-login/bank-id-login.component';
import { BankIdLoginSecretComponent } from './bank-id-login-secret/bank-id-login.component';
import { LoginStatusComponent } from './login-status/login-status.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { StatusMessageComponent } from './status-message/status-message.component';
import { DialogInfoServiceComponent } from './crawler-login/dialog-info-service/dialog-info-service.component';
import { Sparebank1SubComponent } from './sparebank1-sub/sparebank1-sub.component';
import { MaterialModule } from '@shared/material/material.module';
import { BankChoiceComponent } from './bank-choice/bank-choice.component';
import { DemoLoginComponent } from './demo-login/demo-user-option-login/demo-login.component';
import { GuidLoginComponent } from './demo-login/guid-login/guid-login.component';

@NgModule({
  declarations: [
    CrawlerLoginComponent,
    BankIdLoginComponent,
    BankIdLoginSecretComponent,
    LoginStatusComponent,
    StatusMessageComponent,
    DialogInfoServiceComponent,
    Sparebank1SubComponent,
    BankChoiceComponent,
    DemoLoginComponent,
    GuidLoginComponent,
    BankIdLoginComponent
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
export class AuthModule {}
