import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ROUTES_MAP,
  ROUTES_MAP_NO,
  ROUTES_MAP_SV
} from '@config/routes-config';
import { AuthSvMockupComponent } from '@features/auth-sv-mockup/auth-sv-mockup.component';
import { ContactUsComponent } from '@features/contact-us/contact-us.component';
import { AboutCookiesComponent } from '@features/cookies/cookies.component';
import { EmailPreferencesComponent } from '@features/email-preferences/email-preferences.component';
import { GetNotifiedComponent } from '@features/get-notified/get-notified.component';
import { LandingComponent } from '@features/landing/landing.component';
import { PageNotFoundComponent } from '@features/page-not-found/page-not-found.component';
import { PrivacyPolicyComponent } from '@features/privacy-policy/privacy-policy.component';
import { PrivacyComponent } from '@features/privacy/privacy.component';
import { TermsConditionsComponent } from '@features/terms-conditions/terms-conditions.component';
import { customMeta, defaultMeta } from './config/routes-config';
import { InitConfirmationLangGenericComponent } from './local-components/components-output';
import { EmailRedirectNOComponent } from '@features/email-redirect/email-redirect-no/email-redirect-no.component';
import { EmailRedirectSVComponent } from '@features/email-redirect/email-redirect-sv/email-redirect-sv.component';
import { AuthGuard } from '@shared/guards/auth.guard';
import { NoLoansComponent } from '@features/dashboard/no-loans/no-loans.component';

import { BankChoiceComponent } from '@features/auth/bank-choice/bank-choice.component';

const commonRoutes: Routes = [
  {
    path: '',
    component: LandingComponent,
    data: {
      title: customMeta.landing.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.landing.description
      }
    }
  },
  {
    path: ROUTES_MAP.emailPreferences,
    component: EmailPreferencesComponent,
    children: [
      {
        path: '**',
        component: EmailPreferencesComponent
      }
    ]
  },
  {
    path: 'del-med-messenger',
    component: EmailRedirectNOComponent,
    children: [
      {
        path: '**',
        component: EmailRedirectNOComponent
      }
    ]
  },
  {
    path: 'dela-pa-messenger',
    component: EmailRedirectSVComponent,
    children: [
      {
        path: '**',
        component: EmailRedirectSVComponent
      }
    ]
  },
  {
    path: ROUTES_MAP.aboutUs,
    loadChildren: () =>
      import('./features/about-us/about-us.module').then(
        (m) => m.AboutUsModule
      ),
    data: {
      title: customMeta.omOss.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.omOss.description
      }
    }
  },
  {
    path: ROUTES_MAP_NO.boliglanskalkulator,
    loadChildren: () =>
      import('./features/first-buyers/first-buyers.module').then(
        (m) => m.FirstBuyersModule
      ),
    data: {
      // TODO: Set up correct meta
      title: customMeta.valgBank.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.valgBank.description
      }
    }
  },
  {
    path: ROUTES_MAP.contactUs,
    component: ContactUsComponent,
    data: {
      title: customMeta.kontakt.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.kontakt.description
      }
    }
  },
  {
    path: ROUTES_MAP.privacy,
    component: PrivacyComponent,
    data: {
      title: customMeta.personvern.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.personvern.description
      }
    }
  },
  {
    path: ROUTES_MAP.cookies,
    component: AboutCookiesComponent,
    data: {
      title: customMeta.cookies.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.cookies.description
      }
    }
  },
  {
    path: ROUTES_MAP.termsConditions,
    component: TermsConditionsComponent,
    data: {
      title: customMeta.personvernerklaering.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.personvernerklaering.description
      }
    }
  },
  {
    path: ROUTES_MAP.privacyPolicy,
    component: PrivacyPolicyComponent,
    data: {
      title: customMeta.personvernerklaering.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.personvernerklaering.description
      }
    }
  },
  {
    path: ROUTES_MAP.bankSelect,
    loadChildren: () =>
      import('./local-components/components-output').then(
        (m) => m.BankSelectLangGenericRoutingModule
      ),
    data: {
      title: customMeta.valgBank.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.valgBank.description
      }
    }
  },
  {
    path: ROUTES_MAP_NO.banksGuide,
    loadChildren: () =>
      import('./features/banks-guide/banks-guide.module').then(
        (m) => m.BanksGuideModule
      ),
    data: {
      title: customMeta.banksGuide.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.banksGuide.description
      }
    }
  },
  {
    path: ROUTES_MAP_NO.boliglanskalkulator,
    loadChildren: () =>
      import('./features/first-buyers/first-buyers.module').then(
        (m) => m.FirstBuyersModule
      ),
    data: {
      // TODO: Set up correct meta
      title: customMeta.valgBank.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.valgBank.description
      }
    }
  },
  {
    path: ROUTES_MAP.initConfirmation,
    component: InitConfirmationLangGenericComponent,
    data: {
      title: customMeta.bekreftTitle,
      meta: {
        name: defaultMeta.name,
        description: defaultMeta.description
      }
    }
  },
  {
    path: ROUTES_MAP.getNotified,
    component: GetNotifiedComponent,
    data: {
      title: customMeta.faabeskjed.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.faabeskjed.description
      }
    }
  },
  { path: ROUTES_MAP.noLoan, component: NoLoansComponent },

  {
    path: ROUTES_MAP.auth,
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
    data: {
      title: customMeta.auth.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.auth.description
      }
    }
  },
  {
    path: ROUTES_MAP.dashboard,
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard]
  },
  { path: '**', component: PageNotFoundComponent }
];

const routesSV: Routes = [
  {
    path: ROUTES_MAP_SV.tinkMockup,
    component: AuthSvMockupComponent
  }
];

const routesNo: Routes = [
  {
    path: ROUTES_MAP_NO.banksGuide,
    loadChildren: () =>
      import('./features/banks-guide/banks-guide.module').then(
        (m) => m.BanksGuideModule
      ),
    data: {
      title: customMeta.banksGuide.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.banksGuide.description
      }
    }
  }
];

const routes: Routes = [...routesNo, ...routesSV, ...commonRoutes];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
