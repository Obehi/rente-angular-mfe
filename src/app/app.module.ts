import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from '@features/page-not-found/page-not-found.component';
import { LandingComponent } from '@features/landing/landing.component';
import { SharedModule } from '@shared/shared.module';
import { FaqComponent } from '@features/faq/faq.component';
import { PrivacyComponent } from '@features/privacy/privacy.component';
import { AboutCookiesComponent } from '@features/cookies/cookies.component';
import { TermsConditionsComponent } from '@features/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from '@features/privacy-policy/privacy-policy.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContactUsComponent } from './features/contact-us/contact-us.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InitConfirmationComponent } from '@features/init-confirmation/init-confirmation.component';
import { registerLocaleData } from '@angular/common';
import localeNo from '@angular/common/locales/nb';
import { MaterialModule } from '@shared/material/material.module';
import { GetNotifiedComponent } from '@features/get-notified/get-notified.component';
import { CounterComponent } from './shared/components/ui-components/counter/counter.component';

import { UserService } from '@services/remote-api/user.service';
import { FormsModule } from '@angular/forms';
import { DialogInfoComponent } from './features/init-confirmation/dialog-info/dialog-info.component';
import { EmailPerferencesComponent } from './features/email-perferences/email-perferences.component';
import { ProfileDialogInfoComponent } from "./features/dashboard/profile/dialog-info/dialog-info.component";
import {IMaskModule} from 'angular-imask';

registerLocaleData(localeNo);

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LandingComponent,
    FaqComponent,
    PrivacyComponent,
    TermsConditionsComponent,
    PrivacyPolicyComponent,
    ContactUsComponent,
    InitConfirmationComponent,
    GetNotifiedComponent,
    CounterComponent,
    DialogInfoComponent,
    AboutCookiesComponent,
    EmailPerferencesComponent,
    ProfileDialogInfoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    IMaskModule
  ],
  entryComponents: [DialogInfoComponent, ProfileDialogInfoComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'nb-NO' }, UserService],
  bootstrap: [AppComponent]
})
export class AppModule {}
