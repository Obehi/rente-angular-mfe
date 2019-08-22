import { InitConfirmationComponent } from './features/init-confirmation/init-confirmation.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@features/page-not-found/page-not-found.component';
import { LandingComponent } from '@features/landing/landing.component';
import { AboutUsComponent } from '@features/about-us/about-us.component';
import { ROUTES_MAP } from '@config/routes-config';
import { FaqComponent } from '@features/faq/faq.component';
import { PrivacyComponent } from '@features/privacy/privacy.component';
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
      title: defaultTitle,
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
    path: ROUTES_MAP.faq, component: FaqComponent,
    data: {
      title: customMeta.ofteStilteSporsmaalTitle,
      meta: {
        name: defaultMeta.name,
        description: customMeta.ofteStilteSporsmaalDescription
      }
    }
  },
  { path: ROUTES_MAP.contactUs, component: ContactUsComponent },
  {
    path: ROUTES_MAP.privacy, component: PrivacyComponent,
    data: {
      title: customMeta.personvernTitle,
      meta: {
        name: defaultMeta.name,
        description: customMeta.personvernDescription
      }
    }
  },
  { path: ROUTES_MAP.termsConditions, component: TermsConditionsComponent },
  { path: ROUTES_MAP.privacyPolicy, component: PrivacyPolicyComponent },
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
  { path: ROUTES_MAP.initConfirmation, component: InitConfirmationComponent },
  { path: ROUTES_MAP.getNotified, component: GetNotifiedComponent },
  {
    path: ROUTES_MAP.auth,
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
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
