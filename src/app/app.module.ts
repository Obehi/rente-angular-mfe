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
import {IMaskModule} from 'angular-imask';
import { EmailPreferencesComponent } from './features/email-preferences/email-preferences.component';
import { ProfileDialogInfoComponent } from "./features/dashboard/profile/dialog-info/dialog-info.component";
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CountUpModule } from 'ngx-countup';
import { AuthSvComponent } from './features/auth-sv/auth-sv.component';
import { OptimizeService } from '@services/optimize.service';
import { AuthSvMockupComponent } from './features/auth-sv-mockup/auth-sv-mockup.component';

import { LoginLangGenericComponent } from './local-components/components-output'

import { InitConfirmationLangGenericComponent  } from './local-components/components-output';


import { LandingTopLangGenericComponent  } from './local-components/components-output';

//import { LandingTopNoComponent  } from './features/landing/landing-top-no/landing-top-no.component';
import { EmailRedirectComponent } from './features/email-redirect/email-redirect.component'

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
    InitConfirmationLangGenericComponent,
    InitConfirmationComponent,
    GetNotifiedComponent,
    CounterComponent,
    DialogInfoComponent,
    AboutCookiesComponent,
    EmailPreferencesComponent,
    ProfileDialogInfoComponent,
    LoginLangGenericComponent,
    AuthSvComponent,
    AuthSvMockupComponent,
    LandingTopLangGenericComponent,
    EmailRedirectComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    IMaskModule,
    LazyLoadImageModule,
    CountUpModule,
  ],
  entryComponents: [DialogInfoComponent, ProfileDialogInfoComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'nb-NO' }, UserService, OptimizeService],
  bootstrap: [AppComponent]
})
export class AppModule {}
