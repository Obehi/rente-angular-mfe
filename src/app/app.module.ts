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
import { GuidePageComponent } from './features/guide-page/guide-page.component';
import { CoFounderComponent } from './features/co-founder/co-founder.component';
import { CounterComponent } from './shared/components/ui-components/counter/counter.component';
import { Ng2OdometerModule } from 'ng2-odometer'; // <-- import the module
import { UserService } from '@services/remote-api/user.service';
import { FormsModule } from '@angular/forms';

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
    GuidePageComponent,
    CoFounderComponent,
    CounterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    MaterialModule,
    Ng2OdometerModule.forRoot(),
    // MatExpansionModule,
    // MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'nb-NO' },
    UserService],
  bootstrap: [AppComponent]
})
export class AppModule {}
