import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeNo from '@angular/common/locales/nb';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
import { ConfirmationProperty } from './features/init-confirmation/init-confirmation-sv/confirmation-property-sv/confirmation-property-sv.component';
import { NoLoansComponent } from '@features/dashboard/no-loans/no-loans.component';

import { Environment } from '@services/env.service';
import { UserService } from '@services/remote-api/user.service';
import { OptimizeService } from '@services/optimize.service';

import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@shared/material/material.module';
import { CounterComponent } from './shared/components/ui-components/counter/counter.component';
import { EnvService } from './shared/services/env.service';
import { DropdownBannerComponent } from '@shared/components/ui-components/dropdown-banner/dropdown-banner.component';

import { IMaskModule } from 'angular-imask';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CountUpModule } from 'ngx-countup';

import { PrivacyPolicyLangGenericComponent } from './local-components/components-output';
import { LoginLangGenericComponent } from './local-components/components-output';
import { InitConfirmationLangGenericComponent } from './local-components/components-output';
import { GetNotifiedLangGenericComponent } from './local-components/components-output';
import { LandingTopLangGenericComponent } from './local-components/components-output';

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
    LoginLangGenericComponent,
    NoLoansComponent,
    PageNotFoundComponent,
    PrivacyComponent,
    PrivacyPolicyLangGenericComponent,
    ProfileDialogInfoComponent,
    TermsConditionsComponent
  ],
  imports: [
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
    DropdownBannerComponent,
    ProfileDialogInfoComponent
  ],
  providers: [
    DropdownBannerComponent,
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
