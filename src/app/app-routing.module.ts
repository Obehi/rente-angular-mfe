import { InitConfirmationComponent } from './features/init-confirmation/init-confirmation.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@features/page-not-found/page-not-found.component';
import { LandingComponent } from '@features/landing/landing.component';
import { ROUTES_MAP } from '@config/routes-config';
import { PrivacyComponent } from '@features/privacy/privacy.component';
import { AboutCookiesComponent } from '@features/cookies/cookies.component';
import { TermsConditionsComponent } from '@features/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from '@features/privacy-policy/privacy-policy.component';
import { ContactUsComponent } from '@features/contact-us/contact-us.component';
import { EmailPreferencesComponent } from '@features/email-preferences/email-preferences.component';
import { AuthSvMockupComponent } from '@features/auth-sv-mockup/auth-sv-mockup.component'

import { AuthGuard } from '@shared/guards/auth.guard';
import { GetNotifiedComponent } from '@features/get-notified/get-notified.component';
import { customMeta, defaultMeta, defaultTitle } from './config/routes-config';
import { BankChoiceComponent } from '@features/auth/bank-choice/bank-choice.component';
import { OptimizeService } from '@services/optimize.service';



const optimize = new OptimizeService()

/* 
path: 'tilbud', component: optimize.getBinaryVariation() ?  OffersComponent : OffersComponentBlue,
 */

const chooseBankVariation = () =>  {
  if(!optimize.getBinaryVariation()) 
  return import('./features/bank-select/bank-select.module').then(m => m.BankSelectModule)
  else
  return import('./features/bank-select-variation/bank-select.module').then(m => m.BankSelectVariationModule)
}
 
const routes: Routes = [
  {
    path: '', component: LandingComponent,
    data: {
      title: customMeta.landing.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.landing.description
      }
    }
  },
  {
    path: ROUTES_MAP.emailPreferences, component: EmailPreferencesComponent,
    children: [ 
      {
          path: '**',
          component: EmailPreferencesComponent
      },      
    ]
  },
  {
    path: ROUTES_MAP.aboutUs,
    loadChildren: () => import('./features/about-us/about-us.module').then(m => m.AboutUsModule),
    data: {
      title: customMeta.omOss.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.omOss.description
      }
    }
  },
  {
    path: ROUTES_MAP.contactUs, component: ContactUsComponent,
    data: {
      title: customMeta.kontakt.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.kontakt.description
      }
    }
  },
  {
    path: ROUTES_MAP.privacy, component: PrivacyComponent,
    data: {
      title: customMeta.personvern.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.personvern.description
      }
    }
  },
  {
    path: ROUTES_MAP.cookies, component: AboutCookiesComponent,
    data: {
      title: customMeta.cookies.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.cookies.description
      }
    }
  },
  {
    path: ROUTES_MAP.termsConditions, component: TermsConditionsComponent,
    data: {
      title: customMeta.personvernerklaering.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.personvernerklaering.description
      }
    }
  },
  {
    path: ROUTES_MAP.privacyPolicy, component: PrivacyPolicyComponent, data: {
      title: customMeta.personvernerklaering.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.personvernerklaering.description
      }
    }
  },
  {
    path: ROUTES_MAP.bankTestVariationSelect, component: BankChoiceComponent
  },
  {
    path: ROUTES_MAP.bankSelect,
    loadChildren: () => chooseBankVariation(),
    data: {
      title: customMeta.valgBank.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.valgBank.description
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
      title: customMeta.faabeskjed.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.faabeskjed.description
      }
    }
  },
  {
    path: ROUTES_MAP.auth,
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
    data: {
      title: customMeta.auth.title,
      meta: {
        name: defaultMeta.name,
        description: customMeta.auth.description
      }
    }
  },
  {
    path: ROUTES_MAP.tinkMockup, component: AuthSvMockupComponent,
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
