import { InitConfirmationComponent } from './features/init-confirmation/init-confirmation.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@features/page-not-found/page-not-found.component';
import { LandingComponent } from '@features/landing/landing.component';
import { AboutUsComponent } from '@features/about-us/about-us.component';
import { ROUTES_MAP } from '@config/routes-config';
import { PrivacyComponent } from '@features/privacy/privacy.component';
import { AboutCookiesComponent } from '@features/cookies/cookies.component';
import { TermsConditionsComponent } from '@features/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from '@features/privacy-policy/privacy-policy.component';
import { BankSelectComponent } from '@features/bank-select/bank-select.component';
import { ContactUsComponent } from '@features/contact-us/contact-us.component';
import { AuthGuard } from '@shared/guards/auth.guard';
import { GetNotifiedComponent } from '@features/get-notified/get-notified.component';
import { customMeta, defaultMeta, defaultTitle } from './config/routes-config';

const routes: Routes = [
  {
    path: '', component: LandingComponent,
    data: {
      title: customMeta.landingTitle,
      meta: defaultMeta
    }
  },
  {
    path: ROUTES_MAP.aboutUs, component: AboutUsComponent,
    data: {
      title: customMeta.omossTitle,
      meta: {
        name: defaultMeta.name,
        description: customMeta.omossDescription
      }
    }
  },
  {
    path: ROUTES_MAP.contactUs, component: ContactUsComponent,
    data: {
      title: customMeta.kontaktTitle,
      meta: {
        name: defaultMeta.name,
        description: customMeta.kontaktDescription
      }
    }
  },
  {
    path: ROUTES_MAP.privacy, component: PrivacyComponent,
    data: {
      title: customMeta.personvernerklaeringTitle,
      meta: {
        name: defaultMeta.name,
        description: customMeta.personvernDescription
      }
    }
  },
  {
    path: ROUTES_MAP.cookies, component: AboutCookiesComponent,
    data: {
      title: customMeta.cookiesTitle,
      meta: {
        name: defaultMeta.name,
        description: customMeta.cookiesDescription
      }
    }
  },
  {
    path: ROUTES_MAP.termsConditions, component: TermsConditionsComponent,
    data: {
      title: customMeta.brukervilkarTitle,
      meta: {
        name: defaultMeta.name,
        description: customMeta.personvernDescription
      }
    }
  },
  {
    path: ROUTES_MAP.privacyPolicy, component: PrivacyPolicyComponent, data: {
      title: customMeta.personvernTitle,
      meta: {
        name: defaultMeta.name,
        description: customMeta.personvernDescription
      }
    }
  },
  {
    path: ROUTES_MAP.bankSelect, component: BankSelectComponent,
    data: {
      title: customMeta.velgbankTitle,
      meta: {
        name: defaultMeta.name,
        description: customMeta.velgbankDescription
      }
    }
  },
  {
    path: ROUTES_MAP.initConfirmation, component: InitConfirmationComponent,
    data: {
      title: customMeta.bekreftTitle,
      meta: {
        name: defaultMeta.name,
        description: defaultMeta.description
      }
    }
  },
  {
    path: ROUTES_MAP.getNotified, component: GetNotifiedComponent,
    data: {
      title: customMeta.faabeskjedTitle,
      meta: {
        name: defaultMeta.name,
        description: customMeta.faabeskjedDescription
      }
    }
  },
  {
    path: ROUTES_MAP.auth,
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
    data: {
      title: customMeta.bankLoginTitle,
      meta: {
        name: defaultMeta.name,
        description: customMeta.bankDescription
      }
    }
  },
  {
    path: ROUTES_MAP.dashboard,
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
