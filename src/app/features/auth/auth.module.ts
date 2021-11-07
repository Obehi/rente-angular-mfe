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
import { DemoLoginComponent } from './demo-login/demo-user-option-login/demo-login.component';
import { GuidLoginComponent } from './demo-login/guid-login/guid-login.component';
import { ChooseSubBankComponent } from './crawler-login/choose-sub-bank/choose-sub-bank.component';
import { IntroNoBankIDComponent } from './bank-id-login/intro-no-bank-id/intro-no-bank-id.component';
import { IntroNoBankIdNordeaComponent } from './bank-id-login/intro-no-bank-id-nordea/intro-no-bank-id-nordea.component';
import { IntroDefaultSignicatComponent } from './bank-id-login/intro-default-signicat/intro-default-signicat.component';
import { SignicatLoanValidationComponent } from './bank-id-login/signicat-loan-validation/signicat-loan-validation.component';
import { IntroNoBankIdDnbComponent } from './bank-id-login/intro-no-bank-id-dnb/intro-no-bank-id-dnb.component';
import { IntroRedirectComponent } from './bank-id-login/intro-redirect/intro-redirect.component';
import { IntroCrawlerIsOffDnbComponent } from './bank-id-login/intro-crawler-is-off-dnb/intro-crawler-is-off-dnb.component';

@NgModule({
  declarations: [
    CrawlerLoginComponent,
    BankIdLoginComponent,
    BankIdLoginSecretComponent,
    DemoLoginComponent,
    DialogInfoServiceComponent,
    GuidLoginComponent,
    LoginStatusComponent,
    Sparebank1SubComponent,
    StatusMessageComponent,
    DemoLoginComponent,
    GuidLoginComponent,
    BankIdLoginComponent,
    ChooseSubBankComponent,
    IntroNoBankIDComponent,
    IntroNoBankIdNordeaComponent,
    IntroDefaultSignicatComponent,
    SignicatLoanValidationComponent,
    IntroNoBankIdDnbComponent,
    IntroRedirectComponent,
    IntroCrawlerIsOffDnbComponent
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
