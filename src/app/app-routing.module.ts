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

const routes: Routes = [
  { path: '', component: LandingComponent},
  { path: ROUTES_MAP.aboutUs, component: AboutUsComponent},
  { path: ROUTES_MAP.faq, component: FaqComponent},
  { path: ROUTES_MAP.contactUs, component: ContactUsComponent},
  { path: ROUTES_MAP.privacy, component: PrivacyComponent},
  { path: ROUTES_MAP.termsConditions, component: TermsConditionsComponent},
  { path: ROUTES_MAP.privacyPolicy, component: PrivacyPolicyComponent},
  { path: ROUTES_MAP.bankSelect, component: BankSelectComponent},
  {
    path: ROUTES_MAP.auth,
    // loadChildren: 'app/features/auth/auth.module#AuthModule',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  { path: '*', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
