// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeNo from '@angular/common/locales/nb';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

// App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Features
import { ContactUsComponent } from './features/contact-us/contact-us.component';
import { PageNotFoundComponent } from '@features/page-not-found/page-not-found.component';
import { LandingComponent } from '@features/landing/landing.component';

import { FaqComponent } from '@features/faq/faq.component';
import { PrivacyComponent } from '@features/privacy/privacy.component';
import { AboutCookiesComponent } from '@features/cookies/cookies.component';
import { TermsConditionsComponent } from '@features/terms-conditions/terms-conditions.component';
import { AuthSvComponent } from './features/auth-sv/auth-sv.component';
import { DialogInfoComponent } from './features/init-confirmation/dialog-info/dialog-info.component';
import { GetNotifiedDialogComponent } from './features/get-notified/getNotifiedDialogComponent/getNotifiedDialogComponent.component';
import { EmailPreferencesComponent } from './features/email-preferences/email-preferences.component';
import { ProfileDialogInfoComponent } from './features/dashboard/profile/dialog-info/dialog-info.component';
import { AuthSvMockupComponent } from './features/auth-sv-mockup/auth-sv-mockup.component';
import { EmailRedirectSVComponent } from './features/email-redirect/email-redirect-sv/email-redirect-sv.component';
import { EmailRedirectNOComponent } from './features/email-redirect/email-redirect-no/email-redirect-no.component';
import { ConfirmationProperty } from './features/init-confirmation/confirmation-property/confirmation-property.component';
import { NoLoansComponent } from '@features/dashboard/no-loans/no-loans.component';
import { Sb1DisabledComponent } from './features/sb1-disabled/sb1-disabled.component';

// Services
import { Environment } from '@services/env.service';
import { UserService } from '@services/remote-api/user.service';
import { OptimizeService } from '@services/optimize.service';

// Shared
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@shared/material/material.module';
import { CounterComponent } from './shared/components/ui-components/counter/counter.component';
import { EnvService } from './shared/services/env.service';
import { TopAnimationBannerComponent } from '@shared/components/ui-components/top-animation-banner/top-animation-banner.component';

// Package
import { IMaskModule } from 'angular-imask';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CountUpModule } from 'ngx-countup';

// Local-components
import { PrivacyPolicyLangGenericComponent } from './local-components/components-output';
import { LoginLangGenericComponent } from './local-components/components-output';
import { InitConfirmationLangGenericComponent } from './local-components/components-output';
import { GetNotifiedLangGenericComponent } from './local-components/components-output';
//
import { LandingTopLangGenericComponent } from './local-components/components-output';
import { LandingTopNoOldComponent } from './features/landing/landing-top-no-old/landing-top-no-old.component';
import { LandingTopNoComponent } from './features/landing/landing-top-no/landing-top-no.component';
//
import { LandingOldComponent } from './features/landing/landing-old/landing-old.component';
import { LandingNewComponent } from './features/landing/landing-new/landing-new.component';
import { LandingTopSvComponent } from './features/landing/landing-top-sv/landing-top-sv.component';

registerLocaleData(localeNo);

@NgModule({
  declarations: [
    AboutCookiesComponent,
    AppComponent,
    AuthSvComponent,
    AuthSvMockupComponent,
    ConfirmationProperty,
    ContactUsComponent,
    CounterComponent,
    DialogInfoComponent,
    EmailPreferencesComponent,
    EmailRedirectNOComponent,
    EmailRedirectSVComponent,
    FaqComponent,
    GetNotifiedDialogComponent,
    GetNotifiedLangGenericComponent,
    InitConfirmationLangGenericComponent,
    LandingComponent,
    LandingTopLangGenericComponent,
    LandingTopNoOldComponent,
    LandingTopNoComponent,
    LandingNewComponent,
    LandingOldComponent,
    LandingTopSvComponent,
    LoginLangGenericComponent,
    NoLoansComponent,
    PageNotFoundComponent,
    PrivacyComponent,
    PrivacyPolicyLangGenericComponent,
    ProfileDialogInfoComponent,
    Sb1DisabledComponent,
    TermsConditionsComponent
  ],
  imports: [
    NgxSliderModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CountUpModule,
    FormsModule,
    IMaskModule,
    LazyLoadImageModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  entryComponents: [
    DialogInfoComponent,
    ProfileDialogInfoComponent,
    TopAnimationBannerComponent
  ],
  providers: [
    EnvService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initializeConfig,
      deps: [EnvService, HttpClient]
    },
    { provide: LOCALE_ID, useValue: 'nb-NO' },
    { provide: Window, useValue: window },
    OptimizeService,
    TopAnimationBannerComponent,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function initializeConfig(
  envService: EnvService
): () => Promise<Environment> {
  return () => envService.loadEnv();
}
