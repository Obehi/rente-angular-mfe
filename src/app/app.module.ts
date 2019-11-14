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
    CoFounderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    MaterialModule,
    // MatExpansionModule,
    // MatFormFieldModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'nb-NO' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
