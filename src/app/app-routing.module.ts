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

const routes: Routes = [
  { path: ROUTES_MAP.aboutUs, component: AboutUsComponent},
  { path: '*', component: PageNotFoundComponent},
  { path: '', component: LandingComponent},
  { path: 'faq', component: FaqComponent},
  { path: 'privacy', component: PrivacyComponent},
  { path: 'terms-conditions', component: TermsConditionsComponent},
  { path: 'privacy-policy', component: PrivacyPolicyComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
