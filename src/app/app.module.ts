import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutUsComponent } from '@features/about-us/about-us.component';
import { PageNotFoundComponent } from '@features/page-not-found/page-not-found.component';
import { LandingComponent } from '@features/landing/landing.component';
import { SharedModule } from '@shared/shared.module';
import { FaqComponent } from '@features/faq/faq.component';
import { PrivacyComponent } from '@features/privacy/privacy.component';
import { AboutCookiesComponent } from '@features/cookies/cookies.component';
import { TermsConditionsComponent } from '@features/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from '@features/privacy-policy/privacy-policy.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BankSelectComponent } from './features/bank-select/bank-select.component';
import { ContactUsComponent } from './features/contact-us/contact-us.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InitConfirmationComponent } from '@features/init-confirmation/init-confirmation.component';
import { registerLocaleData } from '@angular/common';
import localeNo from '@angular/common/locales/nb';
import { MaterialModule } from '@shared/material/material.module';
import { GetNotifiedComponent } from '@features/get-notified/get-notified.component';
import { CounterComponent } from './shared/components/ui-components/counter/counter.component';
import { Ng2OdometerModule } from 'ng2-odometer'; // <-- import the module
import { UserService } from '@services/remote-api/user.service';
import { FormsModule } from '@angular/forms';
import { DialogInfoComponent } from './features/init-confirmation/dialog-info/dialog-info.component';
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { EmailPerferencesComponent } from './features/email-perferences/email-perferences.component';


registerLocaleData(localeNo);

@NgModule({
  declarations: [
    AppComponent,
    AboutUsComponent,
    PageNotFoundComponent,
    LandingComponent,
    FaqComponent,
    PrivacyComponent,
    TermsConditionsComponent,
    PrivacyPolicyComponent,
    BankSelectComponent,
    ContactUsComponent,
    InitConfirmationComponent,
    GetNotifiedComponent,
    CounterComponent,
    DialogInfoComponent,
    AboutCookiesComponent,
    EmailPerferencesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    MaterialModule,
    Ng2OdometerModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    DeferLoadModule
  ],
  entryComponents: [DialogInfoComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'nb-NO' }, UserService],
  bootstrap: [AppComponent]
})
export class AppModule {}
